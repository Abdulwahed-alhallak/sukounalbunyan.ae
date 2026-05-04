<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalReturn extends Model
{
    protected $fillable = [
        'contract_id',
        'product_id',
        'returned_quantity',
        'condition',
        'damage_fee',
        'damage_notes',
        'return_date',
    ];

    protected function casts(): array
    {
        return [
            'return_date' => 'date',
            'damage_fee'  => 'decimal:2',
        ];
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(RentalContract::class, 'contract_id');
    }

    public function product()
    {
        return $this->belongsTo(\Noble\ProductService\Models\ProductServiceItem::class, 'product_id');
    }
}
