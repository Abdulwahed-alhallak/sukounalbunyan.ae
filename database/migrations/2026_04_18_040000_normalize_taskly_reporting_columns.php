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
        if (Schema::hasTable('project_tasks')) {
            Schema::table('project_tasks', function (Blueprint $table) {
                if (!Schema::hasColumn('project_tasks', 'end_date')) {
                    $table->date('end_date')->nullable()->after('start_date');
                }
                if (!Schema::hasColumn('project_tasks', 'status')) {
                    $table->string('status')->default('todo')->after('priority');
                }
                
                // Add index to speed up reporting if not already added by previous migration
                if (!$this->hasIndex('project_tasks', 'project_tasks_end_date_index', ['end_date'])) {
                    $table->index('end_date');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('project_tasks')) {
            Schema::table('project_tasks', function (Blueprint $table) {
                if (Schema::hasColumn('project_tasks', 'end_date')) {
                    $table->dropColumn('end_date');
                }
                if (Schema::hasColumn('project_tasks', 'status')) {
                    $table->dropColumn('status');
                }
            });
        }
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
