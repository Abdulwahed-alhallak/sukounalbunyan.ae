<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\HrmDocument;

class DestroyDocument
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public HrmDocument $hrmDocument
    )
    {
        //
    }
}