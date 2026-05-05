<?php

namespace Noble\Rental\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Traits\TenantBound;

class RentalProject extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'name',
        'code',
        'description',
        'customer_id',
        'color',
        'site_name',
        'site_address',
        'site_contact_person',
        'site_contact_phone',
        'status',
        'taskly_project_id',
        'workspace',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    // ── Relationships ──────────────────────────────────

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(RentalContract::class, 'rental_project_id');
    }

    public function activeContracts(): HasMany
    {
        return $this->hasMany(RentalContract::class, 'rental_project_id')
            ->where('status', 'active');
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(
            \Noble\Quotation\Models\SalesQuotation::class,
            'rental_project_id'
        );
    }

    // ── Accessors ──────────────────────────────────────

    /**
     * CSS-friendly text color class for the project color badge.
     */
    public function getContrastColorAttribute(): string
    {
        // Convert hex to RGB and decide black or white text
        $hex = ltrim($this->color ?? '#6366F1', '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        $luminance = (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255;
        return $luminance > 0.5 ? '#1a1a1a' : '#ffffff';
    }

    /**
     * Total accrued rent across all active contracts.
     */
    public function getTotalActiveRentAttribute(): float
    {
        return (float) $this->contracts()
            ->where('status', 'active')
            ->sum('total_invoiced');
    }

    /**
     * Human-readable status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'active'    => 'Active',
            'completed' => 'Completed',
            'on_hold'   => 'On Hold',
            'cancelled' => 'Cancelled',
            default     => ucfirst($this->status ?? 'Unknown'),
        };
    }

    // ── Scopes ─────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    // ── Event Logging ───────────────────────────────────

    /**
     * Log a simple audit entry for this project.
     * Stored in rental_contract_events with contract_id = 0 (project-level).
     * Uses the same table as contract events for uniformity.
     */
    public function logEvent(string $eventType, array $meta = []): void
    {
        try {
            RentalContractEvent::create([
                'contract_id' => 0,          // 0 = project-level event
                'event_type'  => $eventType,
                'meta'        => $meta,
                'created_by'  => \Illuminate\Support\Facades\Auth::id() ?? 1,
                'notes'       => "Project #{$this->id}: " . ($meta['name'] ?? $eventType),
            ]);
        } catch (\Throwable $e) {
            // Never block the main flow
        }
    }
}
