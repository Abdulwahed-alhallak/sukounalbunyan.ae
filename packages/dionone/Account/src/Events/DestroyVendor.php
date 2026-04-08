<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Account\Models\Vendor;

class DestroyVendor
{
    use Dispatchable;

    public function __construct(
        public Vendor $vendor
    ) {}
}