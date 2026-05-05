<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            if (!Schema::hasColumn('rental_contracts', 'rental_project_id')) {
                $table->unsignedBigInteger('rental_project_id')->nullable()->after('project_id');
                $table->foreign('rental_project_id')
                    ->references('id')
                    ->on('rental_projects')
                    ->nullOnDelete();
            }
            if (!Schema::hasColumn('rental_contracts', 'quotation_id')) {
                $table->unsignedBigInteger('quotation_id')->nullable()->after('rental_project_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropForeign(['rental_project_id']);
            $table->dropColumn(['rental_project_id', 'quotation_id']);
        });
    }
};
