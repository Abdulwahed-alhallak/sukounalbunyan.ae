<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Termination;

class DestroyTermination
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Termination $termination
    )
    {
        //
    }
}