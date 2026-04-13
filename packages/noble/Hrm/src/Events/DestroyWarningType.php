<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\WarningType;

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