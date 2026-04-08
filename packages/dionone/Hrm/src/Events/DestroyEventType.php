<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\EventType;

class DestroyEventType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public EventType $eventType
    )
    {
        //
    }
}