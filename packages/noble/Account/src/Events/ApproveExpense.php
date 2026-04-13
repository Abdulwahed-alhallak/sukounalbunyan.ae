<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Account\Models\Expense;

class ApproveExpense
{
    use Dispatchable;

    public function __construct(
        public Expense $expense
    ) {}
}
