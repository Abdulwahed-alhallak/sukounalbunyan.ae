<?php

namespace Noble\ProductService\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\TenantBound;

class ProductServiceCategory extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'name',
        'color',
        'creator_id',
        'created_by',
    ];


}
