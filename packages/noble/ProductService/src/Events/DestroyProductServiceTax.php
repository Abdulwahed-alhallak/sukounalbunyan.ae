<?php

namespace Noble\ProductService\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\ProductService\Models\ProductServiceTax;

class DestroyProductServiceTax
{
    use Dispatchable;

    public function __construct(
        public ProductServiceTax $tax,
    ) {}
}
