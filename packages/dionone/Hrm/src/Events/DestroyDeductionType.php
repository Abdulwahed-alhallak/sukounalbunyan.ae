<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\DeductionType;

class DestroyDeductionType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public DeductionType $deductionType
    )
    {
        //
    }
}