<?php

namespace Noble\DoubleEntry\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\DoubleEntry\Models\BalanceSheetNote;

class DestroyBalanceSheetNote
{
    use Dispatchable;

    public function __construct(
        public BalanceSheetNote $balanceSheetNote
    ) {}
}
