<?php

namespace Noble\Pos\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Warehouse;
use App\Traits\TenantBound;

class Pos extends Model
{
    use TenantBound;
    protected $fillable = [
        'sale_number',
        'customer_id',
        'warehouse_id',
        'pos_date',
        'status',
        'creator_id',
        'created_by'
    ];

    protected function casts(): array
    {
        return [
            'tax_amount' => 'decimal:2',
            'pos_date' => 'date'
        ];
    }

    protected $appends = ['zatca_qr'];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PosItem::class, 'pos_id');
    }

    public function payment()
    {
        return $this->hasOne(PosPayment::class, 'pos_id');
    }

    public static function generateSaleNumber()
    {
       $nextNumber = self::where('created_by', creatorId())->count() + 1;
        return '#POS' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    public function getZatcaQrAttribute()
    {
        if (!class_exists(\App\Services\ZatcaQRService::class)) {
            return '';
        }

        if (function_exists('getCompanyAllSetting')) {
            $settings = getCompanyAllSetting($this->created_by);
            $companyName = $settings['company_name'] ?? 'Noble Architecture';
            $vatNumber = $settings['vat_number'] ?? '310122393500003';
        } else {
            $companyName = 'Noble Architecture';
            $vatNumber = '310122393500003';
        }

        $totalAmount = $this->items->sum('total_amount');
        $taxAmount = $this->items->sum('tax_amount');

        return \App\Services\ZatcaQRService::generate(
            $companyName,
            $vatNumber,
            $this->pos_date ?? $this->created_at,
            $totalAmount,
            $taxAmount,
            true // return base64 string for img src
        );
    }
}
