<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\HolidayType;

class DestroyHolidayType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public HolidayType $holidayType
    )
    {
        //
    }
}