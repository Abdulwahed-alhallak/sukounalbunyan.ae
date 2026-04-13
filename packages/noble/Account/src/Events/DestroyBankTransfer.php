<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Account\Models\BankTransfer;

class DestroyBankTransfer
{
    use Dispatchable;

    public function __construct(
        public BankTransfer $bankTransfer
    ) {}
}