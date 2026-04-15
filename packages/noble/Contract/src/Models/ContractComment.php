<?php

namespace Noble\Contract\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

use App\Traits\TenantBound;

class ContractComment extends Model
{
    use TenantBound;
    protected $fillable = [
        'contract_id',
        'comment',
        'user_id',
        'is_edited',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_edited' => 'boolean',
        ];
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}