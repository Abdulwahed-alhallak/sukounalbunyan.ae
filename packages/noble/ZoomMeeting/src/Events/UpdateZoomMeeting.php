<?php

namespace Noble\ZoomMeeting\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Noble\ZoomMeeting\Models\ZoomMeeting;

class UpdateZoomMeeting
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ZoomMeeting $meeting
    ) {}
}