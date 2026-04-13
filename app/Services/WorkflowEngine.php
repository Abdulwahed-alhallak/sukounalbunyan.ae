<?php

namespace App\Services;

use App\Models\WorkflowRule;
use App\Models\WorkflowLog;
use App\Models\UserNotification;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * WorkflowEngine
 *
 * Central engine for evaluating and executing workflow rules.
 * Called from model observers / event hooks when records are created/updated.
 */
class WorkflowEngine
{
    /**
     * Fire an event and execute matching workflow rules.
     *
     * @param string $module   Module key (invoice, hrm, crm, project, etc.)
     * @param string $event    Event type (created, updated, status_changed, etc.)
     * @param Model  $model    The Eloquent model that triggered the event
     * @param int    $companyId Company context
     */
    public static function fire(string $module, string $event, Model $model, int $companyId): void
    {
        try {
            $rules = WorkflowRule::active()
                ->forCompany($companyId)
                ->forTrigger($module, $event)
                ->orderBy('priority', 'desc')
                ->get();

            foreach ($rules as $rule) {
                /** @var WorkflowRule $rule */
                self::evaluate($rule, $model, $companyId);
            }
        } catch (\Exception $e) {
            Log::warning("WorkflowEngine error: {$e->getMessage()}", [
                'module' => $module,
                'event' => $event,
                'model_id' => $model->id ?? null,
            ]);
        }
    }

    /**
     * Evaluate a single rule against the model.
     */
    private static function evaluate(WorkflowRule $rule, Model $model, int $companyId): void
    {
        $startTime = microtime(true);

        // Check if conditions match
        if (!$rule->conditionsMatch($model)) {
            return;
        }

        $log = WorkflowLog::create([
            'workflow_rule_id' => $rule->id,
            'company_id' => $companyId,
            'trigger_module' => $rule->trigger_module,
            'trigger_event' => $rule->trigger_event,
            'triggerable_type' => get_class($model),
            'triggerable_id' => $model->id,
            'status' => 'running',
        ]);

        $executedActions = [];
        $hasError = false;
        $errorMessage = null;

        try {
            foreach ($rule->actions as $action) {
                $result = self::executeAction($action, $model, $companyId, $rule);
                $executedActions[] = [
                    'type' => $action['type'] ?? 'unknown',
                    'status' => $result ? 'success' : 'skipped',
                    'timestamp' => now()->toISOString(),
                ];
            }
        } catch (\Exception $e) {
            $hasError = true;
            $errorMessage = $e->getMessage();
        }

        $durationMs = (int) ((microtime(true) - $startTime) * 1000);

        $log->update([
            'status' => $hasError ? 'failed' : 'completed',
            'actions_executed' => $executedActions,
            'error_message' => $errorMessage,
            'duration_ms' => $durationMs,
        ]);

        $rule->recordExecution();
    }

    /**
     * Execute a single action.
     */
    private static function executeAction(array $action, Model $model, int $companyId, WorkflowRule $rule): bool
    {
        $type = $action['type'] ?? '';

        return match ($type) {
            'notification' => self::actionNotification($action, $model, $companyId, $rule),
            'email' => self::actionEmail($action, $model, $companyId, $rule),
            'create_task' => self::actionCreateTask($action, $model, $companyId),
            'change_status' => self::actionChangeStatus($action, $model),
            'webhook' => self::actionWebhook($action, $model),
            'whatsapp' => self::actionWhatsapp($action, $model, $companyId, $rule),
            default => false,
        };
    }

    // ═════════════════════════════════════════════════
    // ACTION IMPLEMENTATIONS
    // ═════════════════════════════════════════════════

    /**
     * Send in-app notification
     */
    private static function actionNotification(array $action, Model $model, int $companyId, WorkflowRule $rule): bool
    {
        $title = self::replacePlaceholders($action['title'] ?? $rule->name, $model);
        $message = self::replacePlaceholders($action['message'] ?? '', $model);
        $recipient = $action['recipient'] ?? 'company_owner';

        $userIds = self::resolveRecipients($recipient, $companyId);

        foreach ($userIds as $userId) {
            UserNotification::send($userId, $rule->trigger_module, $title, $message, [
                'category' => $action['category'] ?? 'info',
                'company_id' => $companyId,
                'icon' => $action['icon'] ?? null,
                'action_url' => $action['action_url'] ?? null,
                'notifiable_type' => get_class($model),
                'notifiable_id' => $model->id,
                'metadata' => ['workflow_rule_id' => $rule->id],
            ]);
        }

        return true;
    }

    /**
     * Send email notification
     */
    private static function actionEmail(array $action, Model $model, int $companyId, WorkflowRule $rule): bool
    {
        $to = $action['to'] ?? null;
        $subject = self::replacePlaceholders($action['subject'] ?? $rule->name, $model);
        $body = self::replacePlaceholders($action['body'] ?? '', $model);

        if (!$to) {
            // Resolve email from recipient type
            $recipient = $action['recipient'] ?? 'company_owner';
            $userIds = self::resolveRecipients($recipient, $companyId);
            $emails = User::whereIn('id', $userIds)->pluck('email')->filter()->toArray();
        } else {
            $emails = is_array($to) ? $to : [$to];
        }

        foreach ($emails as $email) {
            try {
                Mail::raw($body, function ($msg) use ($email, $subject) {
                    $msg->to($email)->subject($subject);
                });
            } catch (\Exception $e) {
                Log::warning("Workflow email failed: {$e->getMessage()}");
            }
        }

        return true;
    }

    /**
     * Create a task in Taskly
     */
    private static function actionCreateTask(array $action, Model $model, int $companyId): bool
    {
        if (!class_exists(\Noble\Taskly\Models\ProjectTask::class)) return false;

        $projectId = $action['project_id'] ?? null;
        if (!$projectId) return false;

        $title = self::replacePlaceholders($action['task_title'] ?? 'Auto-generated task', $model);

        \Noble\Taskly\Models\ProjectTask::create([
            'title' => $title,
            'project_id' => $projectId,
            'priority' => $action['priority'] ?? 'medium',
            'start_date' => now(),
            'end_date' => now()->addDays($action['due_days'] ?? 7),
            'is_complete' => 0,
            'created_by' => $companyId,
        ]);

        return true;
    }

    /**
     * Change model status
     */
    private static function actionChangeStatus(array $action, Model $model): bool
    {
        $newStatus = $action['new_status'] ?? null;
        if (!$newStatus || !$model->offsetExists('status')) return false;

        $model->update(['status' => $newStatus]);
        return true;
    }

    /**
     * Call external webhook
     */
    private static function actionWebhook(array $action, Model $model): bool
    {
        $url = $action['url'] ?? null;
        if (!$url) return false;

        try {
            $payload = [
                'event' => $action['event'] ?? 'workflow_triggered',
                'model' => class_basename($model),
                'model_id' => $model->id,
                'data' => $model->toArray(),
                'timestamp' => now()->toISOString(),
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_exec($ch);
            curl_close($ch);

            return true;
        } catch (\Exception $e) {
            Log::warning("Workflow webhook failed: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Send WhatsApp Message via Twilio
     */
    private static function actionWhatsapp(array $action, Model $model, int $companyId, WorkflowRule $rule): bool
    {
        if (!class_exists(\Twilio\Rest\Client::class)) {
            Log::warning("Twilio SDK is not installed. WhatsApp action skipped.");
            return false;
        }

        $messageBody = self::replacePlaceholders($action['message'] ?? '', $model);
        $toNumber = $action['to'] ?? null;
        
        if (!$toNumber) {
            // Resolve phone number from object relationships if specified, or fallback
            // Here we assume $model has a 'phone' or 'contact_number' attribute
            $toNumber = $model->phone ?? $model->contact_number ?? null;
            if (!$toNumber) return false;
        }

        // Add 'whatsapp:' prefix if not present
        if (!str_starts_with($toNumber, 'whatsapp:')) {
            $toNumber = 'whatsapp:' . $toNumber;
        }

        try {
            // Get Twilio credentials dynamically from company settings
            $settings = function_exists('getCompanyAllSetting') ? getCompanyAllSetting($companyId) : [];
            $sid = $settings['twilio_sid'] ?? env('TWILIO_SID');
            $token = $settings['twilio_auth_token'] ?? env('TWILIO_AUTH_TOKEN');
            $from = $settings['twilio_whatsapp_from'] ?? env('TWILIO_WHATSAPP_FROM');

            if (!$sid || !$token || !$from) {
                Log::warning("Twilio credentials not configured for company $companyId.");
                return false;
            }

            if (!str_starts_with($from, 'whatsapp:')) {
                $from = 'whatsapp:' . $from;
            }

            $twilio = new \Twilio\Rest\Client($sid, $token);
            $twilio->messages->create(
                $toNumber,
                [
                    "from" => $from,
                    "body" => $messageBody
                ]
            );

            return true;
        } catch (\Exception $e) {
            Log::warning("Workflow WhatsApp failed: {$e->getMessage()}");
            return false;
        }
    }

    // ═════════════════════════════════════════════════
    // HELPERS
    // ═════════════════════════════════════════════════

    /**
     * Replace placeholders like {invoice_number}, {employee_name}, {total_amount}
     */
    private static function replacePlaceholders(string $text, Model $model): string
    {
        $attributes = $model->toArray();
        foreach ($attributes as $key => $value) {
            if (is_string($value) || is_numeric($value)) {
                $text = str_replace("{{$key}}", (string) $value, $text);
            }
        }
        return $text;
    }

    /**
     * Resolve recipient type to user IDs
     */
    private static function resolveRecipients(string $recipient, int $companyId): array
    {
        return match ($recipient) {
            'company_owner' => [$companyId],
            'all_staff' => User::where('created_by', $companyId)->pluck('id')->toArray(),
            'superadmins' => User::where('type', 'superadmin')->pluck('id')->toArray(),
            default => is_numeric($recipient) ? [(int) $recipient] : [$companyId],
        };
    }
}
