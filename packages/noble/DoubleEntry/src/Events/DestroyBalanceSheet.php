<?php

namespace Noble\DoubleEntry\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\DoubleEntry\Models\BalanceSheet;

class DestroyBalanceSheet
{
    use Dispatchable;

    public function __construct(
        public BalanceSheet $balanceSheet
    ) {}
}
