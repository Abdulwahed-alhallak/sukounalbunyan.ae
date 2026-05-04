<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Noble\Taskly\Traits\InteractsWithMedia;
use App\Models\User;
use App\Traits\TenantBound;

class RentalContract extends Model
{
    use HasFactory, TenantBound, InteractsWithMedia;

    protected $fillable = [
        'contract_number',
        'customer_id',
        'warehouse_id',
        'start_date',
        'end_date',
        'billing_cycle',
        'status',
        'payment_status',
        'paid_amount',
        'total_invoiced',
        'notes',
        'terms',
        'security_deposit',
        'min_days',
        'created_by',
        'workspace',
        'last_billed_at',
        'total_damage_fees',
        'invoiced_damage_fees',
        'deposit_status',
        'deposit_settled_amount',
        'deposit_notes',
        'payment_method',
        'site_name',
        'site_address',
        'site_contact_person',
        'site_contact_phone',
        'delivery_fee',
        'pickup_fee',
        'logistics_status',
    ];

    protected function casts(): array
    {
        return [
            'start_date'     => 'date',
            'end_date'       => 'date',
            'last_billed_at' => 'date',
            'paid_amount'      => 'decimal:2',
            'total_invoiced'   => 'decimal:2',
            'security_deposit' => 'decimal:2',
            'min_days'         => 'integer',
            'total_damage_fees' => 'decimal:2',
            'invoiced_damage_fees' => 'decimal:2',
            'deposit_settled_amount' => 'decimal:2',
            'delivery_fee'     => 'decimal:2',
            'pickup_fee'       => 'decimal:2',
        ];
    }

    public function getBalanceDueAttribute(): float
    {
        return max(0, (float)$this->total_invoiced - (float)$this->paid_amount);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Warehouse::class, 'warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(RentalContractItem::class, 'contract_id');
    }

    public function returns(): HasMany
    {
        return $this->hasMany(RentalReturn::class, 'contract_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(\App\Models\SalesInvoice::class, 'rental_contract_id');
    }

    public function installments(): HasMany
    {
        return $this->hasMany(RentalInstallment::class, 'contract_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($contract) {
            if (empty($contract->contract_number)) {
                $contract->contract_number = static::generateContractNumber();
            }
        });
    }

    public static function generateContractNumber(): string
    {
        $year = date('Y');
        $month = date('m');
        $last = static::where('contract_number', 'like', "RENT-{$year}-{$month}-%")
            ->orderBy('contract_number', 'desc')
            ->first();

        if ($last) {
            $lastNumber = (int) substr($last->contract_number, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return "RENT-{$year}-{$month}-" . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
