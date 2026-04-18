<?php

namespace App\Http\Controllers;

use App\Models\WorkflowRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NobleFlowController extends Controller
{
    /**
     * Display the NobleFlow Studio dashboard.
     */
    public function index()
    {
        $workflows = WorkflowRule::query()
            ->where('company_id', creatorId())
            ->orderBy('created_at', 'desc')
            ->get()
            ->filter(fn (WorkflowRule $rule) => $this->fromModuleEvent($rule->trigger_module, $rule->trigger_event) !== null)
            ->values();

        return Inertia::render('MissionCommand/NobleFlow/Index', [
            'workflows' => $workflows->map(fn (WorkflowRule $rule) => $this->toNobleFlowPayload($rule))->values(),
            // Available trigger events for the drag-n-drop builder
            'triggers' => array_map(fn ($pair) => $pair['label'], $this->supportedTriggers()),
            // Available actions
            'actions' => [
                'send_email'           => 'Send Email',
                'create_task'          => 'Create Taskly Task',
                'generate_pdf_invoice' => 'Auto-Generate PDF Invoice'
            ]
        ]);
    }

    /**
     * Store a newly created workflow.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'trigger_event' => 'required|string|in:' . implode(',', array_keys($this->supportedTriggers())),
            'steps'         => 'required|array|min:1',
            'steps.*.action_type' => 'required|string|in:send_email,create_task,generate_pdf_invoice',
            'steps.*.configuration' => 'nullable|array',
        ]);

        $trigger = $this->supportedTriggers()[$validated['trigger_event']];
        $user = Auth::user();

        WorkflowRule::create([
            'company_id'    => creatorId(),
            'name'          => $validated['name'],
            'description'   => 'Created from NobleFlow Studio',
            'is_active'     => true,
            'priority'      => 0,
            'trigger_module'=> $trigger['module'],
            'trigger_event' => $trigger['event'],
            'trigger_conditions' => [],
            'actions'       => array_map(fn (array $step) => $this->toWorkflowAction($step), $validated['steps']),
            'schedule_type' => 'immediate',
            'created_by'    => $user->id,
        ]);

        return redirect()->back()->with('success', 'NobleFlow workflow deployed successfully.');
    }

    private function supportedTriggers(): array
    {
        return [
            'invoice.created' => ['module' => 'invoice', 'event' => 'created', 'label' => 'Invoice Created'],
            'lead.converted' => ['module' => 'crm', 'event' => 'status_changed', 'label' => 'Lead Converted'],
            'employee.hired' => ['module' => 'hrm', 'event' => 'created', 'label' => 'Employee Hired'],
        ];
    }

    private function toNobleFlowPayload(WorkflowRule $rule): array
    {
        $triggerKey = $this->fromModuleEvent($rule->trigger_module, $rule->trigger_event);

        return [
            'id' => $rule->id,
            'name' => $rule->name,
            'is_active' => $rule->is_active,
            'trigger_event' => $triggerKey ?? ($rule->trigger_module . '.' . $rule->trigger_event),
            'steps' => collect($rule->actions ?? [])->values()->map(function (array $action, int $index) {
                return [
                    'id' => $index + 1,
                    'action_type' => $this->fromWorkflowActionType($action['type'] ?? ''),
                    'configuration' => $action,
                ];
            })->all(),
        ];
    }

    private function toWorkflowAction(array $step): array
    {
        $configuration = $step['configuration'] ?? [];
        $type = $step['action_type'];

        return match ($type) {
            'send_email' => [
                'type' => 'email',
                'recipient' => $configuration['recipient'] ?? 'company_owner',
                'subject' => $configuration['subject'] ?? 'Automated email',
                'body' => $configuration['body'] ?? '',
            ],
            'create_task' => [
                'type' => 'create_task',
                'project_id' => $configuration['project_id'] ?? null,
                'task_title' => $configuration['title'] ?? 'Auto-generated task',
                'description' => $configuration['description'] ?? null,
                'priority' => $configuration['priority'] ?? 'medium',
                'assigned_to' => $configuration['assigned_to'] ?? null,
                'stage_id' => $configuration['stage_id'] ?? null,
                'due_days' => $configuration['due_days'] ?? 7,
            ],
            'generate_pdf_invoice' => [
                'type' => 'generate_pdf_invoice',
                'template' => $configuration['template'] ?? 'default',
            ],
            default => [
                'type' => $type,
            ],
        };
    }

    private function fromWorkflowActionType(string $type): string
    {
        return match ($type) {
            'email' => 'send_email',
            'create_task' => 'create_task',
            'generate_pdf_invoice' => 'generate_pdf_invoice',
            default => $type,
        };
    }

    private function fromModuleEvent(string $module, string $event): ?string
    {
        foreach ($this->supportedTriggers() as $key => $trigger) {
            if ($trigger['module'] === $module && $trigger['event'] === $event) {
                return $key;
            }
        }

        return null;
    }
}

