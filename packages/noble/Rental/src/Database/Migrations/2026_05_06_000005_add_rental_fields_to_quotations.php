<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_quotations', function (Blueprint $table) {
            if (!Schema::hasColumn('sales_quotations', 'rental_project_id')) {
                $table->unsignedBigInteger('rental_project_id')->nullable()->after('customer_id');
            }
            if (!Schema::hasColumn('sales_quotations', 'quotation_type')) {
                $table->enum('quotation_type', ['sale', 'rental', 'mixed'])->default('sale')->after('rental_project_id');
            }
            if (!Schema::hasColumn('sales_quotations', 'rental_start_date')) {
                $table->date('rental_start_date')->nullable()->after('quotation_type');
            }
            if (!Schema::hasColumn('sales_quotations', 'rental_billing_cycle')) {
                $table->string('rental_billing_cycle', 20)->nullable()->after('rental_start_date');
            }
            if (!Schema::hasColumn('sales_quotations', 'approval_notes')) {
                $table->text('approval_notes')->nullable();
            }
        });

        Schema::table('sales_quotation_items', function (Blueprint $table) {
            if (!Schema::hasColumn('sales_quotation_items', 'line_type')) {
                $table->enum('line_type', ['rent', 'sell', 'service'])->default('rent')->after('product_id');
            }
            if (!Schema::hasColumn('sales_quotation_items', 'daily_rate')) {
                $table->decimal('daily_rate', 12, 2)->nullable()->after('line_type');
            }
            if (!Schema::hasColumn('sales_quotation_items', 'rental_days')) {
                $table->unsignedInteger('rental_days')->nullable()->after('daily_rate');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sales_quotation_items', function (Blueprint $table) {
            $table->dropColumn(['line_type', 'daily_rate', 'rental_days']);
        });
        Schema::table('sales_quotations', function (Blueprint $table) {
            $table->dropColumn(['rental_project_id', 'quotation_type', 'rental_start_date', 'rental_billing_cycle', 'approval_notes']);
        });
    }
};
