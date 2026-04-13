<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Account\Models\Customer;

class DestroyCustomer
{
    use Dispatchable;

    public function __construct(
        public Customer $customer
    ) {}
}