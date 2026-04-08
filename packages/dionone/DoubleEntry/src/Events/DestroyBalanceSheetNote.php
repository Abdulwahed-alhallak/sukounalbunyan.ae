<?php

namespace DionONE\DoubleEntry\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\DoubleEntry\Models\BalanceSheetNote;

class DestroyBalanceSheetNote
{
    use Dispatchable;

    public function __construct(
        public BalanceSheetNote $balanceSheetNote
    ) {}
}
