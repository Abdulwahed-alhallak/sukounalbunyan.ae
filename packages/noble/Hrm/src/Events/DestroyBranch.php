<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Branch;

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