<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Promotion;

class DestroyPromotion
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Promotion $promotion
    )
    {
        //
    }
}