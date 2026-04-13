<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\Offer;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyOffer
{
    use Dispatchable;

    public function __construct(
        public Offer $offer
    ) {}
}