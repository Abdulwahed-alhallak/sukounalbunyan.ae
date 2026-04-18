<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Traits\TenantBound;
use Illuminate\Support\Facades\Auth;

class AuditLog extends Model
{
    use TenantBound;
    protected $fillable = [
        'user_id',
        'user_type',
        'user_name',
        'event',
        'auditable_type',
        'auditable_id',
        'auditable_label',
        'old_values',
        'new_values',
        'changed_fields',
        'ip_address',
        'user_agent',
        'url',
        'method',
        'route_name',
        'company_id',
        'comment',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'changed_fields' => 'array',
    ];

    /**
     * Attributes that should never be logged (sensitive data)
     */
    public static array $sensitiveFields = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'api_token',
        'secret_key',
        'credit_card',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Record an audit log entry
     */
    public static function record(
        string $event,
        ?Model $model = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $comment = null
    ): self {
        $user = Auth::user();
        $request = request();

        // Calculate changed fields
        $changedFields = null;
        if ($oldValues && $newValues) {
            $changedFields = array_keys(array_diff_assoc(
                array_map('strval', $newValues),
                array_map('strval', $oldValues)
            ));
        }

        // Sanitize sensitive fields
        $oldValues = self::sanitize($oldValues);
        $newValues = self::sanitize($newValues);

        // Determine company_id
        $companyId = null;
        if ($user) {
            $companyId = ($user->type === 'company' || $user->type === 'superadmin')
                ? $user->id
                : $user->created_by;
        }

        return self::create([
            'user_id' => $user?->id,
            'user_type' => $user?->type,
            'user_name' => $user?->name,
            'event' => $event,
            'auditable_type' => $model ? get_class($model) : null,
            'auditable_id' => $model?->getKey(),
            'auditable_label' => $model ? self::getAuditLabel($model) : null,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'changed_fields' => $changedFields,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'url' => $request?->fullUrl(),
            'method' => $request?->method(),
            'route_name' => $request?->route()?->getName(),
            'company_id' => $companyId,
            'comment' => $comment,
        ]);
    }

    /**
     * Remove sensitive fields from values
     */
    protected static function sanitize(?array $values): ?array
    {
        if (!$values) return null;

        foreach (self::$sensitiveFields as $field) {
            if (array_key_exists($field, $values)) {
                $values[$field] = '[REDACTED]';
            }
        }

        return $values;
    }

    /**
     * Generate a human-readable label for the audited model
     */
    protected static function getAuditLabel(Model $model): string
    {
        // Try common label fields in order
        $labelFields = ['name', 'title', 'subject', 'invoice_number', 'code', 'email', 'label'];

        foreach ($labelFields as $field) {
            if (isset($model->$field) && !empty($model->$field)) {
                return class_basename($model) . ': ' . $model->$field;
            }
        }

        return class_basename($model) . ' #' . $model->getKey();
    }

    /**
     * Scope: filter by company
     */
    public function scopeForCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope: filter by event type
     */
    public function scopeOfEvent($query, string $event)
    {
        return $query->where('event', $event);
    }

    /**
     * Scope: filter by model type
     */
    public function scopeForModel($query, string $modelClass)
    {
        return $query->where('auditable_type', $modelClass);
    }

    /**
     * Scope: filter by date range
     */
    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }
}
