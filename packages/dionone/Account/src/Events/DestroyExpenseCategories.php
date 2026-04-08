<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Account\Models\ExpenseCategories;

class DestroyExpenseCategories
{
    use Dispatchable;

    public function __construct(
        public ExpenseCategories $expenseCategories
    ) {}
}
