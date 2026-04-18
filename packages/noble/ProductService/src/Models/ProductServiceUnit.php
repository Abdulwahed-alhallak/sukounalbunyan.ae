<?php

namespace Noble\ProductService\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\TenantBound;

class ProductServiceUnit extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'unit_name',
        'creator_id',
        'created_by',
    ];
}
