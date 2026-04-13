<?php

namespace Noble\Paypal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\BeautySpaManagement\Models\BeautyBooking;

class BeautyBookingPaymentPaypal
{
    use Dispatchable;

    public function __construct(
        public BeautyBooking $booking
    ) {}
}
