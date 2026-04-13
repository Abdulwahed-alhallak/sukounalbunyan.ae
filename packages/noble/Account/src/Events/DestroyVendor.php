<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Account\Models\Vendor;

class DestroyVendor
{
    use Dispatchable;

    public function __construct(
        public Vendor $vendor
    ) {}
}