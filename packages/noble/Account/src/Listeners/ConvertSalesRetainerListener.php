<?php

namespace Noble\Account\Listeners;

use Noble\Account\Services\JournalService;
use Noble\Retainer\Events\ConvertSalesRetainer;

class ConvertSalesRetainerListener
{
    protected $journalService;

    public function __construct(JournalService $journalService)
    {
        $this->journalService = $journalService;
    }

    public function handle(ConvertSalesRetainer $event)
    {
        if (Module_is_active('Account')) {
            $this->journalService->createSalesInvoiceJournal($event->invoice);
            $this->journalService->createSalesRetainerToInvoiceJournal($event->retainer);
            $this->journalService->createSalesCOGSJournal($event->invoice);
        }
    }
}
