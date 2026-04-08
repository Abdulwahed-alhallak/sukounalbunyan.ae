<?php

namespace DionONE\ProductService\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\ProductService\Models\ProductServiceItem;

class UpdateProductServiceItem
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public ProductServiceItem $item
    ) {}
}
