<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Project Module Optimization
        if (Schema::hasTable('project_tasks')) {
            Schema::table('project_tasks', function (Blueprint $table) {
                if (Schema::hasColumn('project_tasks', 'project_id') && !$this->hasIndex('project_tasks', 'project_tasks_project_id_index', ['project_id'])) {
                    $table->index('project_id');
                }
                if (Schema::hasColumn('project_tasks', 'status') && !$this->hasIndex('project_tasks', 'project_tasks_status_index', ['status'])) {
                    $table->index('status');
                }
                if (Schema::hasColumn('project_tasks', 'created_by') && !$this->hasIndex('project_tasks', 'project_tasks_created_by_index', ['created_by'])) {
                    $table->index('created_by');
                }
            });
        }

        // 2. HRM Module Optimization
        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                if (Schema::hasColumn('employees', 'branch_id') && !$this->hasIndex('employees', 'employees_branch_id_index', ['branch_id'])) {
                    $table->index('branch_id');
                }
                if (Schema::hasColumn('employees', 'department_id') && !$this->hasIndex('employees', 'employees_department_id_index', ['department_id'])) {
                    $table->index('department_id');
                }
                if (Schema::hasColumn('employees', 'designation_id') && !$this->hasIndex('employees', 'employees_designation_id_index', ['designation_id'])) {
                    $table->index('designation_id');
                }
            });
        }

        // 3. CRM Module Optimization
        if (Schema::hasTable('leads')) {
            Schema::table('leads', function (Blueprint $table) {
                if (Schema::hasColumn('leads', 'pipeline_id') && !$this->hasIndex('leads', 'leads_pipeline_id_index', ['pipeline_id'])) {
                    $table->index('pipeline_id');
                }
                if (Schema::hasColumn('leads', 'stage_id') && !$this->hasIndex('leads', 'leads_stage_id_index', ['stage_id'])) {
                    $table->index('stage_id');
                }
                if (Schema::hasColumn('leads', 'created_by') && !$this->hasIndex('leads', 'leads_created_by_index', ['created_by'])) {
                    $table->index('created_by');
                }
            });
        }

        // 4. POS Module Optimization
        if (Schema::hasTable('pos')) {
            Schema::table('pos', function (Blueprint $table) {
                if (Schema::hasColumn('pos', 'warehouse_id') && !$this->hasIndex('pos', 'pos_warehouse_id_index', ['warehouse_id'])) {
                    $table->index('warehouse_id');
                }
                if (Schema::hasColumn('pos', 'created_by') && !$this->hasIndex('pos', 'pos_created_by_index', ['created_by'])) {
                    $table->index('created_by');
                }
            });
        }

        // 5. System Logs Optimization
        if (Schema::hasTable('audit_logs')) {
            Schema::table('audit_logs', function (Blueprint $table) {
                if (Schema::hasColumn('audit_logs', 'user_id') && !$this->hasIndex('audit_logs', 'audit_logs_user_id_index', ['user_id'])) {
                    $table->index('user_id');
                }
                if (Schema::hasColumn('audit_logs', 'created_at') && !$this->hasIndex('audit_logs', 'audit_logs_created_at_index', ['created_at'])) {
                    $table->index('created_at');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Dropping indexes is best effort to prevent failure on rollback
        Schema::table('project_tasks', function (Blueprint $table) { $table->dropIndex(['project_id']); $table->dropIndex(['status']); $table->dropIndex(['created_by']); });
        Schema::table('employees', function (Blueprint $table) { $table->dropIndex(['branch_id']); $table->dropIndex(['department_id']); $table->dropIndex(['designation_id']); });
        Schema::table('leads', function (Blueprint $table) { $table->dropIndex(['pipeline_id']); $table->dropIndex(['stage_id']); $table->dropIndex(['created_by']); });
        Schema::table('pos', function (Blueprint $table) { $table->dropIndex(['warehouse_id']); $table->dropIndex(['created_by']); });
        Schema::table('audit_logs', function (Blueprint $table) { $table->dropIndex(['user_id']); $table->dropIndex(['created_at']); });
    }

    private function hasIndex(string $table, string $name, array $columns): bool
    {
        foreach (Schema::getIndexes($table) as $index) {
            $indexName = $index['name'] ?? null;
            $indexColumns = $index['columns'] ?? [];

            if ($indexName === $name || $indexColumns === $columns) {
                return true;
            }
        }

        return false;
    }
};
