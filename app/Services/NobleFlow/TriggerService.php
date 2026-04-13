<?php

namespace App\Services\nobleflow;

use App\Models\Workflow;
use App\Models\WorkflowStep;
use Illuminate\Support\Facades\Log;

class TriggerService
{
    /**
     * Dispatch an event to the nobleflow Engine.
     *
     * @param string $eventName e.g., 'invoice.created'
     * @param mixed $payload The Eloquent Model or data associated with the event
     * @param int|null $companyId Scope the workflow to a specific company
     */
    public static function dispatch(string $eventName, $payload, ?int $companyId = null): void
    {
        // 1. Find all active workflows for this trigger & company
        $query = Workflow::where('trigger_event', $eventName)->where('is_active', true);
        
        if ($companyId) {
            // Either specifically for this company, or a global SuperAdmin workflow (company_id null)
            $query->where(function($q) use ($companyId) {
                $q->where('company_id', $companyId)
                  ->orWhereNull('company_id');
            });
        }
        
        $workflows = $query->get();

        if ($workflows->isEmpty()) {
            return;
        }

        // 2. Pass to the Execution Engine
        foreach ($workflows as $workflow) {
            Log::info("nobleflow Triggered: [{$workflow->name}] via [{$eventName}]");
            ExecutionEngine::run($workflow, $payload);
        }
    }
}

