<?php

namespace Noble\Contract\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

use App\Traits\TenantBound;

class ContractNote extends Model
{
    use TenantBound;
    protected $fillable = [
        'contract_id',
        'note',
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