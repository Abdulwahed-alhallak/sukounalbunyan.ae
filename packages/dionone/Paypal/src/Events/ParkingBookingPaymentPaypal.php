<?php

namespace DionONE\Paypal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\ParkingManagement\Models\ParkingBooking;

class ParkingBookingPaymentPaypal
{
    use Dispatchable;

    public function __construct(
        public ParkingBooking $booking
    ) {}
}