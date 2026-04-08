<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Users table — critical for multi-tenant queries
        Schema::table('users', function (Blueprint $table) {
            // Most common queries: filter by creator + type
            if (!$this->indexExists('users', 'idx_users_created_by_type')) {
                $table->index(['created_by', 'type'], 'idx_users_created_by_type');
            }
            if (!$this->indexExists('users', 'idx_users_type_disable')) {
                $table->index(['type', 'is_disable'], 'idx_users_type_disable');
            }
            if (!$this->indexExists('users', 'idx_users_active_plan')) {
                $table->index('active_plan', 'idx_users_active_plan');
            }
        });

        // Sales Invoices — financial reports & dashboards
        if (Schema::hasTable('sales_invoices')) {
            Schema::table('sales_invoices', function (Blueprint $table) {
                if (!$this->indexExists('sales_invoices', 'idx_si_status_date')) {
                    $table->index(['status', 'invoice_date'], 'idx_si_status_date');
                }
                if (!$this->indexExists('sales_invoices', 'idx_si_customer_creator')) {
                    $table->index(['customer_id', 'created_by'], 'idx_si_customer_creator');
                }
                if (!$this->indexExists('sales_invoices', 'idx_si_due_date')) {
                    $table->index('due_date', 'idx_si_due_date');
                }
            });
        }

        // Purchase Invoices
        if (Schema::hasTable('purchase_invoices')) {
            Schema::table('purchase_invoices', function (Blueprint $table) {
                if (!$this->indexExists('purchase_invoices', 'idx_pi_status_date')) {
                    $table->index(['status', 'invoice_date'], 'idx_pi_status_date');
                }
                if (!$this->indexExists('purchase_invoices', 'idx_pi_vendor_creator')) {
                    $table->index(['vendor_id', 'created_by'], 'idx_pi_vendor_creator');
                }
            });
        }

        // Orders — subscription tracking
        Schema::table('orders', function (Blueprint $table) {
            if (!$this->indexExists('orders', 'idx_orders_created_by_status')) {
                $table->index(['created_by', 'payment_status'], 'idx_orders_created_by_status');
            }
            if (!$this->indexExists('orders', 'idx_orders_plan_id')) {
                $table->index('plan_id', 'idx_orders_plan_id');
            }
        });

        // Settings — extremely frequently queried table
        Schema::table('settings', function (Blueprint $table) {
            if (!$this->indexExists('settings', 'idx_settings_creator_key')) {
                $table->index(['created_by', 'key'], 'idx_settings_creator_key');
            }
        });

        // User Active Modules — queried on every request via PlanModuleCheck
        Schema::table('user_active_modules', function (Blueprint $table) {
            if (!$this->indexExists('user_active_modules', 'idx_uam_user_module')) {
                $table->index(['user_id', 'module'], 'idx_uam_user_module');
            }
        });

        // Employees table (HRM module)
        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                if (!$this->indexExists('employees', 'idx_emp_department_creator')) {
                    $table->index(['department_id', 'created_by'], 'idx_emp_department_creator');
                }
                if (!$this->indexExists('employees', 'idx_emp_user_id')) {
                    $table->index('user_id', 'idx_emp_user_id');
                }
            });
        }

        // Attendance table (HRM module)
        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                if (!$this->indexExists('attendances', 'idx_att_employee_date')) {
                    $table->index(['employee_id', 'date'], 'idx_att_employee_date');
                }
                if (!$this->indexExists('attendances', 'idx_att_date_creator')) {
                    $table->index(['date', 'created_by'], 'idx_att_date_creator');
                }
            });
        }

        // Messages — messenger performance
        Schema::table('ch_messages', function (Blueprint $table) {
            if (!$this->indexExists('ch_messages', 'idx_msg_from_to')) {
                $table->index(['from_id', 'to_id', 'created_at'], 'idx_msg_from_to');
            }
        });
    }

    public function down(): void
    {
        // Users
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_created_by_type');
            $table->dropIndex('idx_users_type_disable');
            $table->dropIndex('idx_users_active_plan');
        });

        if (Schema::hasTable('sales_invoices')) {
            Schema::table('sales_invoices', function (Blueprint $table) {
                $table->dropIndex('idx_si_status_date');
                $table->dropIndex('idx_si_customer_creator');
                $table->dropIndex('idx_si_due_date');
            });
        }

        if (Schema::hasTable('purchase_invoices')) {
            Schema::table('purchase_invoices', function (Blueprint $table) {
                $table->dropIndex('idx_pi_status_date');
                $table->dropIndex('idx_pi_vendor_creator');
            });
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_created_by_status');
            $table->dropIndex('idx_orders_plan_id');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->dropIndex('idx_settings_creator_key');
        });

        Schema::table('user_active_modules', function (Blueprint $table) {
            $table->dropIndex('idx_uam_user_module');
        });

        if (Schema::hasTable('employees')) {
            Schema::table('employees', function (Blueprint $table) {
                $table->dropIndex('idx_emp_department_creator');
                $table->dropIndex('idx_emp_user_id');
            });
        }

        if (Schema::hasTable('attendances')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->dropIndex('idx_att_employee_date');
                $table->dropIndex('idx_att_date_creator');
            });
        }

        Schema::table('ch_messages', function (Blueprint $table) {
            $table->dropIndex('idx_msg_from_to');
        });
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
