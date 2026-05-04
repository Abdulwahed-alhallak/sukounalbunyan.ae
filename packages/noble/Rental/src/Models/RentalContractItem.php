<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalContractItem extends Model
{
    protected $fillable = [
        'contract_id',
        'product_id',
        'quantity',
        'price_per_cycle',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(RentalContract::class, 'contract_id');
    }

    public function product()
    {
        // Assuming ProductServiceItem is the target model
        return $this->belongsTo(\Noble\ProductService\Models\ProductServiceItem::class, 'product_id');
    }
}
