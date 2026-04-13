<?php

namespace Noble\Account\Listeners;

use Noble\Account\Models\BankAccount;
use Noble\Hrm\Events\PaySalary;
use Noble\Account\Services\JournalService;
use Noble\Account\Services\BankTransactionsService;
use Noble\Account\Models\ChartOfAccount;

class PaySalaryListener
{
    protected $journalService;
    protected $bankTransactionsService;

    public function __construct(JournalService $journalService, BankTransactionsService $bankTransactionsService)
    {
        $this->journalService = $journalService;
        $this->bankTransactionsService = $bankTransactionsService;
    }

    public function handle(PaySalary $event)
    {
        if (Module_is_active('Account'))
        {
            $this->journalService->createPayrollJournal($event->payrollEntry);
            $this->bankTransactionsService->createPayrollPayment($event->payrollEntry);
        }
    }
}

