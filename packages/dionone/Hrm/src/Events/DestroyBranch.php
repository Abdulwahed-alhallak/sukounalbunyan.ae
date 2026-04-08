<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Branch;

class DestroyBranch
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Branch $branch
    )
    {
        //
    }
}