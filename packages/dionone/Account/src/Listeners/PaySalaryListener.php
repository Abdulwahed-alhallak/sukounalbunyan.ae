<?php

namespace DionONE\Account\Listeners;

use DionONE\Account\Models\BankAccount;
use DionONE\Hrm\Events\PaySalary;
use DionONE\Account\Services\JournalService;
use DionONE\Account\Services\BankTransactionsService;
use DionONE\Account\Models\ChartOfAccount;

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

