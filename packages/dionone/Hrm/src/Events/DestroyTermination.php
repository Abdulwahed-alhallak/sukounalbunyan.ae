<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Termination;

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