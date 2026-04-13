<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\Offer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateOffer
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Offer $offer
    ) {}
}