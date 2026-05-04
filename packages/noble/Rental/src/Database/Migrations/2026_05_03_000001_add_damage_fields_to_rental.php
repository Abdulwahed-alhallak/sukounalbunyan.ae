<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add damage fields to returns
        Schema::table('rental_returns', function (Blueprint $table) {
            $table->decimal('damage_fee', 15, 2)->default(0)->after('returned_quantity');
            $table->text('damage_notes')->nullable()->after('damage_fee');
        });

        // Add total damage tracker to contract
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->decimal('total_damage_fees', 15, 2)->default(0)->after('total_invoiced');
            // Status is already a string, so we just allow 'draft' in logic
        });
    }

    public function down(): void
    {
        Schema::table('rental_returns', function (Blueprint $table) {
            $table->dropColumn(['damage_fee', 'damage_notes']);
        });

        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn('total_damage_fees');
        });
    }
};
