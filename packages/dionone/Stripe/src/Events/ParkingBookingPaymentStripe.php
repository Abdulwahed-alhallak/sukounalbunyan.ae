<?php

namespace DionONE\Stripe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\ParkingManagement\Models\ParkingBooking;

class ParkingBookingPaymentStripe
{
    use Dispatchable;

     public function __construct(
        public ParkingBooking $booking
    ) {}
}