<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Account\Models\VendorPayment;

class UpdateVendorPaymentStatus
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public VendorPayment $vendorPayment
    ) {}
}