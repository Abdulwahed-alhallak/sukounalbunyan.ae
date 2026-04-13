<?php

namespace App\Services\nobleflow;

use App\Models\Workflow;
use App\Models\WorkflowStep;
use Illuminate\Support\Facades\Log;

class ExecutionEngine
{
    /**
     * Execute a specific workflow.
     */
    public static function run(Workflow $workflow, $payload): void
    {
        // 1. Order steps sequentially
        $steps = WorkflowStep::where('workflow_id', $workflow->id)
            ->orderBy('order_index', 'asc')
            ->get();

        if ($steps->isEmpty()) {
            return;
        }

        // 2. Map and run actions
        foreach ($steps as $step) {
            try {
                self::processAction($step, $payload);
            } catch (\Exception $e) {
                Log::error("nobleflow Execution Error: Workflow [{$workflow->name}], Step ID [{$step->id}]: " . $e->getMessage());
                // Depending on strictness, we might throw or continue.
                // In nobleflow, we log and continue so partial execution works.
            }
        }
    }

    /**
     * Execute a single action step based on action_type.
     */
    private static function processAction(WorkflowStep $step, $payload): void
    {
        $config = json_decode($step->configuration, true) ?? [];
        
        Log::info("Executing Action: " . $step->action_type);

        switch ($step->action_type) {
            case 'send_email':
                // Pseudo logic: Mail::to($config['to'])->send(new DynamicFlowEmail($config['body']));
                Log::info("nobleflow: Mock Sending Email to " . ($config['to'] ?? 'Unknown'));
                break;

            case 'create_task':
                // Check if Taskly module exists
                if (class_exists(\Noble\Taskly\Entities\Task::class)) {
                    // Logic to create a project task based on payload (e.g. Lead -> New Task)
                    Log::info("nobleflow: Task Creation Hooked!");
                } else {
                    Log::warning("nobleflow: create_task failed. Taskly module missing.");
                }
                break;
            
            case 'generate_pdf_invoice':
                // Integrate with our existing backend PDF generator!
                Log::info("nobleflow: Autogenerating PDF...");
                break;

            default:
                Log::warning("nobleflow: Unknown Action Type - {$step->action_type}");
                break;
        }
    }
}

