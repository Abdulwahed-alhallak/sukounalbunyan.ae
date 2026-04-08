<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\Offer;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyOffer
{
    use Dispatchable;

    public function __construct(
        public Offer $offer
    ) {}
}