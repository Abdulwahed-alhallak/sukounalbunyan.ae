<?php

namespace Noble\Quotation\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Quotation\Models\SalesQuotation;

class AcceptSalesQuotation
{
    use Dispatchable;
    public function __construct(
        public SalesQuotation $quotation
        ) {}
}