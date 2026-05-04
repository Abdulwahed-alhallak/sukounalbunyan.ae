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
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->string('deposit_status')->default('held')->after('security_deposit'); // held, refunded, applied
            $table->decimal('deposit_settled_amount', 15, 2)->default(0)->after('deposit_status');
            $table->text('deposit_notes')->nullable()->after('deposit_settled_amount');
        });
    }

    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn(['deposit_status', 'deposit_settled_amount', 'deposit_notes']);
        });
    }
};
