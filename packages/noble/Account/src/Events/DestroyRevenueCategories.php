<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Account\Models\RevenueCategories;

class DestroyRevenueCategories
{
    use Dispatchable;

    public function __construct(
        public RevenueCategories $revenuecategories
    ) {}
}
