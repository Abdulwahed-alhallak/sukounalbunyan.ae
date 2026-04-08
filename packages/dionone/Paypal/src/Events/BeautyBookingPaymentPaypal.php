<?php

namespace DionONE\Paypal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\BeautySpaManagement\Models\BeautyBooking;

class BeautyBookingPaymentPaypal
{
    use Dispatchable;

    public function __construct(
        public BeautyBooking $booking
    ) {}
}
