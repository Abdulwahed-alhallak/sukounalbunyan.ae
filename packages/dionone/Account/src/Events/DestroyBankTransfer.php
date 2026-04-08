<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Account\Models\BankTransfer;

class DestroyBankTransfer
{
    use Dispatchable;

    public function __construct(
        public BankTransfer $bankTransfer
    ) {}
}