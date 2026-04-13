<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Account\Models\BankAccount;

class DestroyBankAccount
{
    use Dispatchable;

    public function __construct(
        public BankAccount $bankAccount
    ) {}
}