<?php

namespace Noble\ProductService\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\TenantBound;

class ProductServiceTax extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'tax_name',
        'rate',
        'creator_id',
        'created_by',
    ];
}
