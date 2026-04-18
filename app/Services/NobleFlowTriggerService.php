<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class NobleFlowTriggerService
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
        Log::info("nobleflow Triggered: {$eventName} for Company {$companyId}");

        $trigger = self::mapEvent($eventName);
        if (!$trigger) {
            Log::warning("nobleflow: Unsupported trigger [{$eventName}]");
            return;
        }

        WorkflowEngine::fire($trigger['module'], $trigger['event'], $payload, $companyId);
    }

    private static function mapEvent(string $eventName): ?array
    {
        return match ($eventName) {
            'invoice.created' => ['module' => 'invoice', 'event' => 'created'],
            'lead.converted' => ['module' => 'crm', 'event' => 'status_changed'],
            'employee.hired' => ['module' => 'hrm', 'event' => 'created'],
            default => null,
        };
    }
}

