<?php

namespace DionONE\Paypal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\LaundryManagement\Models\LaundryRequest;

class LaundryBookingPaymentPaypal
{
    use Dispatchable;

    public function __construct(
        public LaundryRequest $booking
    ) {}
}
