<?php

namespace Noble\Stripe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\BeautySpaManagement\Models\BeautyBooking;

class BeautyBookingPaymentStripe
{
    use Dispatchable;

    public function __construct(
        public BeautyBooking $booking
    ) {}
}
