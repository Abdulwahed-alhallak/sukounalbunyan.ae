<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\AnnouncementCategory;

class DestroyAnnouncementCategory
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public AnnouncementCategory $announcementCategory
    )
    {
        //
    }
}