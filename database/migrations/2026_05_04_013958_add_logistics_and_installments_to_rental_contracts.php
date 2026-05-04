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
            $table->string('payment_method')->default('cash')->after('status');
            $table->string('site_name')->nullable()->after('warehouse_id');
            $table->string('site_address')->nullable()->after('site_name');
            $table->string('site_contact_person')->nullable()->after('site_address');
            $table->string('site_contact_phone')->nullable()->after('site_contact_person');
            $table->decimal('delivery_fee', 10, 2)->default(0)->after('security_deposit');
            $table->decimal('pickup_fee', 10, 2)->default(0)->after('delivery_fee');
            $table->string('logistics_status')->default('Pending Delivery')->after('pickup_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'site_name',
                'site_address',
                'site_contact_person',
                'site_contact_phone',
                'delivery_fee',
                'pickup_fee',
                'logistics_status'
            ]);
        });
    }
};
