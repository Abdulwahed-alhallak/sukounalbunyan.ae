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
        if (Schema::hasTable('journal_entries')) {
            Schema::table('journal_entries', function (Blueprint $table) {
                if (!$this->indexExists('journal_entries', 'idx_je_created_by_date')) {
                    $table->index(['created_by', 'journal_date'], 'idx_je_created_by_date');
                }
            });
        }

        if (Schema::hasTable('customer_payments')) {
            Schema::table('customer_payments', function (Blueprint $table) {
                if (!$this->indexExists('customer_payments', 'idx_cp_created_by_status')) {
                    $table->index(['created_by', 'status'], 'idx_cp_created_by_status');
                }
            });
        }

        if (Schema::hasTable('vendor_payments')) {
            Schema::table('vendor_payments', function (Blueprint $table) {
                if (!$this->indexExists('vendor_payments', 'idx_vp_created_by_status')) {
                    $table->index(['created_by', 'status'], 'idx_vp_created_by_status');
                }
            });
        }

        if (Schema::hasTable('bank_transactions')) {
            Schema::table('bank_transactions', function (Blueprint $table) {
                if (!$this->indexExists('bank_transactions', 'idx_bt_bank_creator_date')) {
                    $table->index(['bank_account_id', 'created_by', 'transaction_date'], 'idx_bt_bank_creator_date');
                }
            });
        }

        if (Schema::hasTable('chart_of_accounts')) {
            Schema::table('chart_of_accounts', function (Blueprint $table) {
                $codeColumn = Schema::hasColumn('chart_of_accounts', 'account_code')
                    ? 'account_code'
                    : (Schema::hasColumn('chart_of_accounts', 'code') ? 'code' : null);

                if ($codeColumn && !$this->indexExists('chart_of_accounts', 'idx_coa_creator_code')) {
                    $table->index(['created_by', $codeColumn], 'idx_coa_creator_code');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('journal_entries')) {
            Schema::table('journal_entries', function (Blueprint $table) {
                $table->dropIndex('idx_je_created_by_date');
            });
        }

        if (Schema::hasTable('customer_payments')) {
            Schema::table('customer_payments', function (Blueprint $table) {
                $table->dropIndex('idx_cp_created_by_status');
            });
        }

        if (Schema::hasTable('vendor_payments')) {
            Schema::table('vendor_payments', function (Blueprint $table) {
                $table->dropIndex('idx_vp_created_by_status');
            });
        }

        if (Schema::hasTable('bank_transactions')) {
            Schema::table('bank_transactions', function (Blueprint $table) {
                $table->dropIndex('idx_bt_bank_creator_date');
            });
        }

        if (Schema::hasTable('chart_of_accounts')) {
            Schema::table('chart_of_accounts', function (Blueprint $table) {
                $table->dropIndex('idx_coa_creator_code');
            });
        }
    }

    /**
     * Check if an index exists on a table
     */
    private function indexExists(string $table, string $indexName): bool
    {
        $indexes = Schema::getIndexes($table);
        foreach ($indexes as $index) {
            if ($index['name'] === $indexName) {
                return true;
            }
        }
        return false;
    }
};
