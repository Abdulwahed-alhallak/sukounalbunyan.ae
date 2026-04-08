<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Award;

class DestroyAward
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Award $award
    )
    {
        //
    }
}