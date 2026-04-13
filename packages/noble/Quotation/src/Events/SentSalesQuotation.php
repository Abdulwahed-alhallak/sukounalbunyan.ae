<?php

namespace Noble\Quotation\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Quotation\Models\SalesQuotation;

class SentSalesQuotation
{
    use Dispatchable;

    public function __construct(
        public SalesQuotation $quotation
    ) {}
}