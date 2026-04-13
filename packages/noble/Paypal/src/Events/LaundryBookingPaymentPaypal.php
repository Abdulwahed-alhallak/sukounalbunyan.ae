<?php

namespace Noble\Paypal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\LaundryManagement\Models\LaundryRequest;

class LaundryBookingPaymentPaypal
{
    use Dispatchable;

    public function __construct(
        public LaundryRequest $booking
    ) {}
}
