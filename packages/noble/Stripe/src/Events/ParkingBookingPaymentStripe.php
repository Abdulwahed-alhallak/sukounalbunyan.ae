<?php

namespace Noble\Stripe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\ParkingManagement\Models\ParkingBooking;

class ParkingBookingPaymentStripe
{
    use Dispatchable;

     public function __construct(
        public ParkingBooking $booking
    ) {}
}