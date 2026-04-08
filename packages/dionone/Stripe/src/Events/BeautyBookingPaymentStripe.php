<?php

namespace DionONE\Stripe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\BeautySpaManagement\Models\BeautyBooking;

class BeautyBookingPaymentStripe
{
    use Dispatchable;

    public function __construct(
        public BeautyBooking $booking
    ) {}
}
