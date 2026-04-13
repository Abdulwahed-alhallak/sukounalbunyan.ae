<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Account\Models\VendorPayment;

class DestroyVendorPayment
{
    use Dispatchable;

    public function __construct(
        public VendorPayment $vendorPayment
    ) {}
}