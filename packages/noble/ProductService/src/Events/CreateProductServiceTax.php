<?php

namespace Noble\ProductService\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Noble\ProductService\Models\ProductServiceTax;

class CreateProductServiceTax
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ProductServiceTax $tax
    ) {}
}
