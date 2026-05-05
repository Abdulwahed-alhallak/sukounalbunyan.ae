<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalAddon extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'product_id',
        'quantity',
        'price_per_cycle',
        'effective_date',
        'notes',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'quantity'        => 'decimal:2',
            'price_per_cycle' => 'decimal:2',
            'effective_date'  => 'date',
        ];
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(RentalContract::class, 'contract_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(\Noble\ProductService\Models\ProductServiceItem::class, 'product_id');
    }

    /**
     * Calculate how many days this addon has been active up to $toDate.
     */
    public function activeDays(\Carbon\Carbon $toDate = null): int
    {
        $to = $toDate ?? now();
        return max(0, (int) $this->effective_date->diffInDays($to));
    }
}
