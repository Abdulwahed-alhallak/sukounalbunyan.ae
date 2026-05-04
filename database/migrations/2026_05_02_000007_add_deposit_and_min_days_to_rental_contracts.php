<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('rental_contracts')) {
            Schema::table('rental_contracts', function (Blueprint $table) {
                if (!Schema::hasColumn('rental_contracts', 'security_deposit')) {
                    $table->decimal('security_deposit', 15, 2)->default(0)->after('paid_amount');
                }
                if (!Schema::hasColumn('rental_contracts', 'min_days')) {
                    $table->integer('min_days')->default(0)->after('billing_cycle');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('rental_contracts')) {
            Schema::table('rental_contracts', function (Blueprint $table) {
                if (Schema::hasColumn('rental_contracts', 'security_deposit')) {
                    $table->dropColumn('security_deposit');
                }
                if (Schema::hasColumn('rental_contracts', 'min_days')) {
                    $table->dropColumn('min_days');
                }
            });
        }
    }
};
