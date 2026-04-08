<?php

namespace DionONE\ZoomMeeting\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\ZoomMeeting\Models\ZoomMeeting;

class DestroyZoomMeeting
{
    use Dispatchable;

    public function __construct(
        public ZoomMeeting $meeting,
    ) {}
}