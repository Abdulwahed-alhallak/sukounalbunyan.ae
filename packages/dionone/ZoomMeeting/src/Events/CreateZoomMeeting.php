<?php

namespace DionONE\ZoomMeeting\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\ZoomMeeting\Models\ZoomMeeting;

class CreateZoomMeeting
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ZoomMeeting $meeting
    ) {}
}