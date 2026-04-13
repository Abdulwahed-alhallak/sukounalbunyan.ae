<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Warning;

class DestroyWarning
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Warning $warning
    )
    {
        //
    }
}