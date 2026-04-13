<?php

namespace Noble\Account\Listeners;

use Noble\Account\Services\BankTransactionsService;
use Noble\Retainer\Events\UpdateRetainerPaymentStatus;
use Noble\Account\Services\JournalService;

class UpdateRetainerPaymentStatusListener
{
    protected $journalService;
    protected $bankTransactionsService;

    public function __construct(JournalService $journalService, BankTransactionsService $bankTransactionsService)
    {
        $this->journalService = $journalService;
        $this->bankTransactionsService = $bankTransactionsService;
    }

    public function handle(UpdateRetainerPaymentStatus $event)
    {
        if (Module_is_active('Account') && $event->request->status === 'cleared') {
            $this->journalService->createRetainerPaymentJournal($event->retainerPayment);
            $this->bankTransactionsService->createRetainerPayment($event->retainerPayment);
        }
    }
}
