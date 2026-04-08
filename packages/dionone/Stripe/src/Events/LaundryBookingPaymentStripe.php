<?php

namespace DionONE\Stripe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\LaundryManagement\Models\LaundryRequest;

class LaundryBookingPaymentStripe
{
    use Dispatchable;

    public function __construct(
        public LaundryRequest $booking
    ) {}
}
