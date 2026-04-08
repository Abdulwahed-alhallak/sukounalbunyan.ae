<?php

namespace DionONE\DoubleEntry\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use DionONE\DoubleEntry\Models\BalanceSheetNote;

class CreateBalanceSheetNote
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public BalanceSheetNote $balanceSheetNote
    ) {}
}
