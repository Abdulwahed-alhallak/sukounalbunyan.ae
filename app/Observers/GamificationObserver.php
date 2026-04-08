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
        // When a Sales Invoice is generated, reward the creator with points!
        // The SaaS environment links the creator via created_by
        if ($invoice->created_by) {
            GamificationService::awardPoints($invoice->created_by, 'invoice_generated');
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
        // For example, if an invoice switches to PAID, we could award 'invoice_paid' points
        if ($invoice->isDirty('status') && $invoice->status === 'PAID') {
            if ($invoice->created_by) {
                GamificationService::awardPoints($invoice->created_by, 'invoice_paid');
            }
        }
    }
}
