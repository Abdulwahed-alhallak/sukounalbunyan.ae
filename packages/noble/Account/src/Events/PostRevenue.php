<?php

namespace Noble\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Account\Models\Revenue;

class PostRevenue
{
    use Dispatchable;

    public function __construct(
        public Revenue $revenue
    ) {}
}
