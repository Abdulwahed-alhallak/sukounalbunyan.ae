<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalContractEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'event_type',
        'details',
        'amount',
        'occurred_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'details'     => 'array',
            'amount'      => 'decimal:2',
            'occurred_at' => 'datetime',
        ];
    }

    // Event type labels for UI display
    const LABELS = [
        'created'           => 'Contract Created',
        'activated'         => 'Contract Activated',
        'partial_return'    => 'Partial Return',
        'full_return'       => 'Full Return',
        'addon'             => 'Materials Added',
        'renewal'           => 'Contract Renewed',
        'lease_to_own'      => 'Converted to Sale',
        'payment'           => 'Payment Recorded',
        'invoice_generated' => 'Invoice Generated',
        'closed'            => 'Contract Closed',
        'deposit_settled'   => 'Deposit Settled',
    ];

    // Event type icon mapping (lucide icon names for frontend)
    const ICONS = [
        'created'           => 'FilePlus',
        'activated'         => 'CheckCircle2',
        'partial_return'    => 'PackageMinus',
        'full_return'       => 'PackageCheck',
        'addon'             => 'PackagePlus',
        'renewal'           => 'RefreshCw',
        'lease_to_own'      => 'ShoppingCart',
        'payment'           => 'CreditCard',
        'invoice_generated' => 'FileText',
        'closed'            => 'XCircle',
        'deposit_settled'   => 'Shield',
    ];

    // Event type color classes
    const COLORS = [
        'created'           => 'bg-blue-100 text-blue-700',
        'activated'         => 'bg-green-100 text-green-700',
        'partial_return'    => 'bg-amber-100 text-amber-700',
        'full_return'       => 'bg-emerald-100 text-emerald-700',
        'addon'             => 'bg-violet-100 text-violet-700',
        'renewal'           => 'bg-cyan-100 text-cyan-700',
        'lease_to_own'      => 'bg-orange-100 text-orange-700',
        'payment'           => 'bg-teal-100 text-teal-700',
        'invoice_generated' => 'bg-indigo-100 text-indigo-700',
        'closed'            => 'bg-gray-100 text-gray-600',
        'deposit_settled'   => 'bg-rose-100 text-rose-700',
    ];

    protected $appends = ['label', 'icon', 'color_class'];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(RentalContract::class, 'contract_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    /** Alias used by eager-loading: ->with('events.createdByUser') */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function getLabelAttribute(): string
    {
        return self::LABELS[$this->event_type] ?? ucfirst(str_replace('_', ' ', $this->event_type));
    }

    public function getIconAttribute(): string
    {
        return self::ICONS[$this->event_type] ?? 'Activity';
    }

    public function getColorClassAttribute(): string
    {
        return self::COLORS[$this->event_type] ?? 'bg-gray-100 text-gray-600';
    }
}

