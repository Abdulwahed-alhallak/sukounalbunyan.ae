<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('sales_invoice_items')) {
            Schema::table('sales_invoice_items', function (Blueprint $table) {
                if (!Schema::hasColumn('sales_invoice_items', 'description')) {
                    $table->text('description')->nullable()->after('product_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('sales_invoice_items')) {
            Schema::table('sales_invoice_items', function (Blueprint $table) {
                if (Schema::hasColumn('sales_invoice_items', 'description')) {
                    $table->dropColumn('description');
                }
            });
        }
    }
};
