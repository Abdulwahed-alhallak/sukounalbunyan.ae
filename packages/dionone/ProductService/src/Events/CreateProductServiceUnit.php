<?php

namespace DionONE\ProductService\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\ProductService\Models\ProductServiceUnit;

class CreateProductServiceUnit
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ProductServiceUnit $unit
    ) {}
}
