<?php

namespace Noble\Lead\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Noble\Lead\Models\Pipeline;

use App\Traits\TenantBound;

class DealStage extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'name',
        'order',
        'pipeline_id',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            
        ];
    }



    public function pipeline()
    {
        return $this->belongsTo(Pipeline::class);
    }
}