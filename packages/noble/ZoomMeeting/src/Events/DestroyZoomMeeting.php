<?php

namespace Noble\ZoomMeeting\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\ZoomMeeting\Models\ZoomMeeting;

class DestroyZoomMeeting
{
    use Dispatchable;

    public function __construct(
        public ZoomMeeting $meeting,
    ) {}
}