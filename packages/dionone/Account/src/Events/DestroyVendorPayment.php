<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Account\Models\VendorPayment;

class DestroyVendorPayment
{
    use Dispatchable;

    public function __construct(
        public VendorPayment $vendorPayment
    ) {}
}