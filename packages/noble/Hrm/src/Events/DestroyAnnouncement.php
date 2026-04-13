<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Announcement;

class DestroyAnnouncement
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Announcement $announcement
    )
    {
        //
    }
}