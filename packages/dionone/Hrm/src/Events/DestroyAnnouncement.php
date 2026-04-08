<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Announcement;

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