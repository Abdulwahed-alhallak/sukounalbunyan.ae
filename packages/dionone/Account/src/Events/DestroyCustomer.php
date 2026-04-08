<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Account\Models\Customer;

class DestroyCustomer
{
    use Dispatchable;

    public function __construct(
        public Customer $customer
    ) {}
}