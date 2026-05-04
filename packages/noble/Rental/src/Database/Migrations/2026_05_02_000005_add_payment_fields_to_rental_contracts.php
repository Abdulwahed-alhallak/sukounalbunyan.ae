<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            if (!Schema::hasColumn('rental_contracts', 'payment_status')) {
                $table->string('payment_status')->default('unpaid')->after('status'); // unpaid, partial, paid
            }
            if (!Schema::hasColumn('rental_contracts', 'paid_amount')) {
                $table->decimal('paid_amount', 15, 2)->default(0)->after('payment_status');
            }
            if (!Schema::hasColumn('rental_contracts', 'total_invoiced')) {
                $table->decimal('total_invoiced', 15, 2)->default(0)->after('paid_amount');
            }
            if (!Schema::hasColumn('rental_contracts', 'terms')) {
                $table->text('terms')->nullable()->after('notes');
            }
        });
    }

    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'paid_amount', 'total_invoiced', 'terms']);
        });
    }
};
