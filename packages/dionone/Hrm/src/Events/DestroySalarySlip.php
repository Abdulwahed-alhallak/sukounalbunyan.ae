<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\PayrollEntry;

class DestroySalarySlip
{
    use Dispatchable, SerializesModels;

    public function __construct(public PayrollEntry $payrollEntry)
    {
        //
    }
}