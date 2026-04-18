<?php

namespace Noble\Quotation\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\TenantBound;

class SalesQuotationItemTax extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'item_id',
        'tax_name',
        'tax_rate',
        'creator_id',
        'created_by'
    ];

    protected $casts = [
        'tax_rate' => 'decimal:2'
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(SalesQuotationItem::class, 'item_id');
    }
}