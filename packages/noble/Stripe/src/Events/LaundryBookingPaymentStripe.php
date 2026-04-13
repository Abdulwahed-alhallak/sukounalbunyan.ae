<?php

namespace Noble\Stripe\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\LaundryManagement\Models\LaundryRequest;

class LaundryBookingPaymentStripe
{
    use Dispatchable;

    public function __construct(
        public LaundryRequest $booking
    ) {}
}
