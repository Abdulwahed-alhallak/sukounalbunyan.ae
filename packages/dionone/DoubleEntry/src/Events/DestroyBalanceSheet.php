<?php

namespace DionONE\DoubleEntry\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\DoubleEntry\Models\BalanceSheet;

class DestroyBalanceSheet
{
    use Dispatchable;

    public function __construct(
        public BalanceSheet $balanceSheet
    ) {}
}
