<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Acknowledgment;

class DestroyAcknowledgment
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Acknowledgment $acknowledgment
    )
    {
        //
    }
}