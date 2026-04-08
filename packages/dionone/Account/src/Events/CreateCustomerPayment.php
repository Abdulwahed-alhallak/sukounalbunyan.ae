<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\Account\Models\CustomerPayment;

class CreateCustomerPayment
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public CustomerPayment $customerPayment
    ) {}
}
