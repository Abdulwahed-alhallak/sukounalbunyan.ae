<?php

namespace App\Observers;

use App\Services\DionFlowTriggerService;
use Illuminate\Support\Facades\Log;

class DionFlowObserver
{
    /**
     * Handle the Model "created" event.
     */
    public function created($model)
    {
        $className = class_basename($model);
        $companyId = $model->created_by ?? null;

        if (!$companyId && method_exists($model, 'creatorId')) {
            $companyId = $model->creatorId();
        }

        if (!$companyId) {
            return;
        }

        $eventName = null;

        switch ($className) {
            case 'SalesInvoice':
            case 'Invoice':
                // DionFlow trigger for Invoice Creation
                $eventName = 'invoice.created';
                break;
            case 'Employee':
                $eventName = 'employee.hired';
                break;
            default:
                break;
        }

        if ($eventName) {
            Log::info("DionFlow Observer: Triggering [{$eventName}] for {$className}");
            DionFlowTriggerService::handleEvent($eventName, $model, $companyId);
        }
    }

    /**
     * Handle the Model "updated" event. (For things like lead.converted)
     */
    public function updated($model)
    {
        $className = class_basename($model);
        $companyId = $model->created_by ?? null;

        if (!$companyId) {
            return;
        }

        $eventName = null;

        switch ($className) {
            case 'Lead':
                if ($model->isDirty('is_converted') && $model->is_converted) {
                    $eventName = 'lead.converted';
                }
                break;
        }

        if ($eventName) {
            Log::info("DionFlow Observer: Triggering [{$eventName}] for {$className}");
            DionFlowTriggerService::handleEvent($eventName, $model, $companyId);
        }
    }
}
