<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\EventType;

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