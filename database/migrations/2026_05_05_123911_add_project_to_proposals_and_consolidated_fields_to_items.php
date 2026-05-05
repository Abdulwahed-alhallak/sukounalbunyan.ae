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
        Schema::table('sales_proposals', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id')->nullable()->after('customer_id');
        });

        Schema::table('sales_invoice_items', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id')->nullable()->after('invoice_id');
            $table->unsignedBigInteger('rental_contract_id')->nullable()->after('project_id');
        });

        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->boolean('is_lease_to_own')->default(false)->after('status');
            $table->decimal('purchase_price', 15, 2)->nullable()->after('is_lease_to_own');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_proposals', function (Blueprint $table) {
            $table->dropColumn('project_id');
        });

        Schema::table('sales_invoice_items', function (Blueprint $table) {
            $table->dropColumn(['project_id', 'rental_contract_id']);
        });

        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn(['is_lease_to_own', 'purchase_price']);
        });
    }
};
