<?php

namespace App\Observers;

use App\Models\SalesInvoice;
use App\Models\User;
use App\Services\GamificationService;

class GamificationObserver
{
    /**
     * Handle the SalesInvoice "created" event.
     *
     * @param  \App\Models\SalesInvoice  $invoice
     * @return void
     */
    public function created(SalesInvoice $invoice)
    {
        // Reward the acting user first, then fall back to the company context if needed.
        $recipientId = $invoice->creator_id ?: $invoice->created_by;

        if ($recipientId) {
            GamificationService::awardPoints($recipientId, 'invoice_generated', $invoice->created_by);
        }
    }

    /**
     * Handle the SalesInvoice "updated" event.
     *
     * @param  \App\Models\SalesInvoice  $invoice
     * @return void
     */
    public function updated(SalesInvoice $invoice)
    {
        $recipientId = $invoice->creator_id ?: $invoice->created_by;

        if ($invoice->wasChanged('status') && strtolower((string) $invoice->status) === 'paid' && $recipientId) {
            GamificationService::awardPoints($recipientId, 'invoice_paid', $invoice->created_by);
        }
    }
}
