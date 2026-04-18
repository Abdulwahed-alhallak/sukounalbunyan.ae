<?php
namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model)
    {
        if (auth()->check()) {
            $tableName = $model->getTable();
            $columns = Schema::getColumnListing($tableName);
            
            // Priority 1: created_by (Noble standard)
            if (in_array('created_by', $columns)) {
                $builder->where($tableName . '.created_by', creatorId());
            } 
            // Priority 2: company_id (Core app legacy/mix standard)
            elseif (in_array('company_id', $columns)) {
                $builder->where($tableName . '.company_id', creatorId());
            }
        }
    }
}
