<?php

namespace Noble\Paypal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\ParkingManagement\Models\ParkingBooking;

class ParkingBookingPaymentPaypal
{
    use Dispatchable;

    public function __construct(
        public ParkingBooking $booking
    ) {}
}