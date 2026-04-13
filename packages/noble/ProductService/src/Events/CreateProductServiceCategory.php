<?php

namespace Noble\ProductService\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Noble\ProductService\Models\ProductServiceCategory;

class CreateProductServiceCategory
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ProductServiceCategory $category
    ) {}
}
