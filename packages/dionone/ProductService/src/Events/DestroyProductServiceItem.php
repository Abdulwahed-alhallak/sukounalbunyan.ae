<?php

namespace DionONE\ProductService\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\ProductService\Models\ProductServiceItem;

class DestroyProductServiceItem
{
    use Dispatchable;

    public function __construct(
        public ProductServiceItem $item,
    ) {}
}
