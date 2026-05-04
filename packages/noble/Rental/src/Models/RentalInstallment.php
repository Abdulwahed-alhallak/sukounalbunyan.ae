<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalInstallment extends Model
{
    protected $fillable = [
        'contract_id',
        'amount',
        'due_date',
        'status',
        'invoice_id',
        'notes',
        'workspace',
        'created_by'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'due_date' => 'date',
        ];
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(RentalContract::class, 'contract_id');
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(\App\Models\SalesInvoice::class, 'invoice_id');
    }
}
