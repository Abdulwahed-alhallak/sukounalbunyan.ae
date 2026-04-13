<?php

namespace Noble\Account\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Account\Services\BankTransactionsService;
use Noble\Account\Services\JournalService;

class UpdateCateringOrderPaymentStatusListener
{
    protected $journalService;
    protected $bankTransactionsService;

    public function __construct(JournalService $journalService, BankTransactionsService $bankTransactionsService)
    {
        $this->journalService = $journalService;
        $this->bankTransactionsService = $bankTransactionsService;
    }

    public function handle($event)
    {
        if(Module_is_active('Account'))
        {
            $this->bankTransactionsService->createCateringOrderPayment($event->payment);
            $this->journalService->createCateringOrderPaymentJournal($event->payment);
        }
    }
}
