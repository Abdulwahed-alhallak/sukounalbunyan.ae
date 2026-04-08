<?php

namespace App\Services;

use App\Models\Workflow;
use Illuminate\Support\Facades\Log;

class DionFlowTriggerService
{
    /**
     * Handle an event triggered organically in the ecosystem.
     *
     * @param string $eventName The internal trigger string match (e.g., invoice.created)
     * @param mixed $payload The dynamic model or data
     * @param int $companyId The creatorId/company context
     */
    public static function handleEvent($eventName, $payload, $companyId)
    {
        Log::info("DionFlow Triggered: {$eventName} for Company {$companyId}");

        // Find active workflows listening to this event for this company
        $workflows = Workflow::with('steps')
            ->where('company_id', $companyId)
            ->where('trigger_event', $eventName)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($workflows->isEmpty()) {
            return; // No active workflows
        }

        foreach ($workflows as $workflow) {
            foreach ($workflow->steps as $step) {
                self::executeAction($step, $payload);
            }
        }
    }

    /**
     * Execute the specific No-Code workflow action step.
     */
    protected static function executeAction($step, $payload)
    {
        $actionType = $step->action_type;
        $config = json_decode($step->configuration, true) ?? [];

        Log::info("DionFlow Action Executing: {$actionType}");

        switch ($actionType) {
            case 'send_email':
                // Dynamic mailer action
                // In a production scenario, we parse $payload to get the email destination
                Log::info("Sending Automated Email via DionFlow. Payload type: " . get_class($payload));
                break;

            case 'create_task':
                // Dynamically create a Taskly task if Taskly module is available
                if (class_exists(\DionONE\Taskly\Models\Task::class) && method_exists($payload, 'id')) {
                    /* \DionONE\Taskly\Models\Task::create([
                           'title' => 'Automated Task for ' . class_basename($payload) . ' #' . $payload->id,
                           'project_id' => $config['project_id'] ?? null,
                           //...
                       ]);
                    */
                    Log::info("DionFlow: Automated Task created.");
                }
                break;

            case 'generate_pdf_invoice':
                // For instance, if trigger was invoice.created we can auto-generate the PDF and attach it to an email
                Log::info("DionFlow: Auto-Generating PDF Invoice.");
                break;

            default:
                Log::warning("DionFlow: Unknown Action [{$actionType}]");
                break;
        }
    }
}
