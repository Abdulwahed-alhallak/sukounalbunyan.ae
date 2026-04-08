<?php

namespace DionONE\Account\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Account\Models\Revenue;

class ApproveRevenue
{
    use Dispatchable;

    public function __construct(
        public Revenue $revenue
    ) {}
}
