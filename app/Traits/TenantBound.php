<?php

namespace App\Traits;

/**
 * Noble Architecture — Tenant Boundaries Trait
 * Automatically assigns creator_id and created_by to models upon creation.
 * Ensures data isolation across the enterprise ecosystem.
 */
trait TenantBound
{
    /**
     * Boot the trait and register the creating hook.
     */
    protected static function bootTenantBound()
    {
        static::creating(function ($model) {
            if (auth()->check()) {
                // Auto-assign the enterprise tenant ID
                if (method_exists($model, 'getTable') && in_array('created_by', \Schema::getColumnListing($model->getTable()))) {
                    if (empty($model->created_by)) {
                        $model->created_by = creatorId();
                    }
                }
                
                // Auto-assign the specific user who created the record
                if (method_exists($model, 'getTable') && in_array('creator_id', \Schema::getColumnListing($model->getTable()))) {
                    if (empty($model->creator_id)) {
                        $model->creator_id = auth()->id();
                    }
                }
            }
        });
    }
}
