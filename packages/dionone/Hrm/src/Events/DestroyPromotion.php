<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Promotion;

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