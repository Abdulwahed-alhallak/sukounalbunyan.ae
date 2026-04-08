<?php

namespace DionONE\Quotation\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Quotation\Models\SalesQuotation;

class RejectSalesQuotation
{
    use Dispatchable;

    public function __construct(
        public SalesQuotation $quotation
    ) {}
}