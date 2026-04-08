<?php

namespace DionONE\Timesheet\Events;

use DionONE\Timesheet\Models\Timesheet;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyTimesheet
{
    use Dispatchable;

    public function __construct(
        public Timesheet $timesheet
    ) {}
}