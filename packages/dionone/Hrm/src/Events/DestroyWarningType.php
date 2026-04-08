<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\WarningType;

class DestroyWarningType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public WarningType $warningType
    )
    {
        //
    }
}