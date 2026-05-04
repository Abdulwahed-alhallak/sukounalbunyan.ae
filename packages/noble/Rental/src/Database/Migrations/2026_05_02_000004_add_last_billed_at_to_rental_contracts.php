<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('rental_contracts', 'last_billed_at')) {
            Schema::table('rental_contracts', function (Blueprint $table) {
                $table->timestamp('last_billed_at')->nullable()->after('notes');
            });
        }
    }

    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn('last_billed_at');
        });
    }
};
