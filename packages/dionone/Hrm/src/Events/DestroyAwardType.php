<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\AwardType;

class DestroyAwardType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public AwardType $awardType
    )
    {
        //
    }
}