<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Account\Models\BankAccount;

class DestroyBankAccount
{
    use Dispatchable;

    public function __construct(
        public BankAccount $bankAccount
    ) {}
}