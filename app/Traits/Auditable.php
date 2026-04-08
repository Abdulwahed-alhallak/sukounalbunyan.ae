<?php

namespace App\Traits;

use App\Models\AuditLog;

/**
 * Trait Auditable
 *
 * Add this trait to any Eloquent model to automatically log
 * created, updated, and deleted events to the audit_logs table.
 *
 * Usage:
 *   use App\Traits\Auditable;
 *   class Invoice extends Model {
 *       use Auditable;
 *
 *       // Optional: specify fields to exclude from audit
 *       protected array $auditExclude = ['updated_at', 'remember_token'];
 *
 *       // Optional: specify which fields to audit (whitelist mode)
 *       protected array $auditInclude = ['status', 'amount', 'client_id'];
 *   }
 */
trait Auditable
{
    /**
     * Boot the trait and register model events
     */
    public static function bootAuditable(): void
    {
        // Log when a model is created
        static::created(function ($model) {
            if ($model->shouldAudit()) {
                AuditLog::record(
                    'created',
                    $model,
                    null,
                    $model->getAuditableValues($model->getAttributes())
                );
            }
        });

        // Log when a model is updated
        static::updated(function ($model) {
            if ($model->shouldAudit()) {
                $original = $model->getOriginal();
                $changed = $model->getChanges();

                // Only log if there are actual meaningful changes
                $filteredChanges = $model->getAuditableValues($changed);
                if (!empty($filteredChanges)) {
                    $filteredOriginal = $model->getAuditableValues(
                        array_intersect_key($original, $filteredChanges)
                    );

                    AuditLog::record(
                        'updated',
                        $model,
                        $filteredOriginal,
                        $filteredChanges
                    );
                }
            }
        });

        // Log when a model is deleted
        static::deleted(function ($model) {
            if ($model->shouldAudit()) {
                AuditLog::record(
                    'deleted',
                    $model,
                    $model->getAuditableValues($model->getAttributes()),
                    null
                );
            }
        });
    }

    /**
     * Check if auditing is currently enabled
     */
    protected function shouldAudit(): bool
    {
        // Don't audit if globally disabled
        if (property_exists($this, 'auditDisabled') && $this->auditDisabled) {
            return false;
        }

        // Don't audit during seeding or migration
        if (app()->runningInConsole() && !app()->runningUnitTests()) {
            return false;
        }

        return true;
    }

    /**
     * Filter values to only include auditable fields
     */
    protected function getAuditableValues(array $values): array
    {
        // Remove timestamps if not explicitly included
        $exclude = array_merge(
            ['updated_at', 'created_at'],
            property_exists($this, 'auditExclude') ? $this->auditExclude : [],
            AuditLog::$sensitiveFields
        );

        // If whitelist mode is active, only include specified fields
        if (property_exists($this, 'auditInclude') && !empty($this->auditInclude)) {
            $values = array_intersect_key($values, array_flip($this->auditInclude));
        }

        // Remove excluded fields
        return array_diff_key($values, array_flip($exclude));
    }

    /**
     * Temporarily disable auditing for this model instance
     */
    public function withoutAudit(): self
    {
        $this->auditDisabled = true;
        return $this;
    }

    /**
     * Get the audit history for this model
     */
    public function auditLogs()
    {
        return AuditLog::where('auditable_type', get_class($this))
            ->where('auditable_id', $this->getKey())
            ->orderBy('created_at', 'desc');
    }

    /**
     * Get the latest audit log entry
     */
    public function lastAuditLog(): ?AuditLog
    {
        return $this->auditLogs()->first();
    }

    /**
     * Custom audit log entry (for manual events like "approved", "exported", etc.)
     */
    public function logCustomEvent(string $event, ?string $comment = null, ?array $metadata = null): AuditLog
    {
        return AuditLog::record(
            $event,
            $this,
            null,
            $metadata,
            $comment
        );
    }
}
