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
        // 1. Procurement Gap
        Schema::table('purchase_invoice_items', function (Blueprint $table) {
            if (!Schema::hasColumn('purchase_invoice_items', 'project_id')) {
                $table->unsignedBigInteger('project_id')->nullable()->after('invoice_id');
                $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            }
        });

        // 2. Billing Gap
        Schema::table('sales_invoices', function (Blueprint $table) {
            if (!Schema::hasColumn('sales_invoices', 'project_id')) {
                $table->unsignedBigInteger('project_id')->nullable()->after('customer_id');
                $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            }
        });

        // 3. General Ledger Gaps
        Schema::table('expenses', function (Blueprint $table) {
            if (!Schema::hasColumn('expenses', 'project_id')) {
                $table->unsignedBigInteger('project_id')->nullable()->after('category_id');
                $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            }
        });

        Schema::table('revenues', function (Blueprint $table) {
            if (!Schema::hasColumn('revenues', 'project_id')) {
                $table->unsignedBigInteger('project_id')->nullable()->after('category_id');
                $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            }
        });

        // 4. Sales Delivery Gap (Deals/Contracts to Projects)
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'contract_id')) {
                $table->unsignedBigInteger('contract_id')->nullable()->after('status');
                // Note: assuming contracts table exists from typical Sukoun Albunyan ecosystem
                if (Schema::hasTable('contracts')) {
                    $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('set null');
                }
            }
            if (!Schema::hasColumn('projects', 'deal_id')) {
                $table->unsignedBigInteger('deal_id')->nullable()->after('contract_id');
                if (Schema::hasTable('deals')) {
                    $table->foreign('deal_id')->references('id')->on('deals')->onDelete('set null');
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ... Reversing foreign keys ...
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'contract_id')) {
                if (Schema::hasTable('contracts')) $table->dropForeign(['contract_id']);
                $table->dropColumn('contract_id');
            }
            if (Schema::hasColumn('projects', 'deal_id')) {
                if (Schema::hasTable('deals')) $table->dropForeign(['deal_id']);
                $table->dropColumn('deal_id');
            }
        });

        Schema::table('expenses', function (Blueprint $table) {
            if (Schema::hasColumn('expenses', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            }
        });

        Schema::table('revenues', function (Blueprint $table) {
            if (Schema::hasColumn('revenues', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            }
        });

        Schema::table('sales_invoices', function (Blueprint $table) {
            if (Schema::hasColumn('sales_invoices', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            }
        });

        Schema::table('purchase_invoice_items', function (Blueprint $table) {
            if (Schema::hasColumn('purchase_invoice_items', 'project_id')) {
                $table->dropForeign(['project_id']);
                $table->dropColumn('project_id');
            }
        });
    }
};
