<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Account\Models\Expense;

class ApproveExpense
{
    use Dispatchable;

    public function __construct(
        public Expense $expense
    ) {}
}
