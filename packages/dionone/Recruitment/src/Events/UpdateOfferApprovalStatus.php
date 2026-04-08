<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\Offer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateOfferApprovalStatus
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Offer $offer
    ) {}
}