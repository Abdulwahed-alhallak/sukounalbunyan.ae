<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Workflow automation rules
        Schema::create('workflow_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);

            // Trigger
            $table->string('trigger_module', 50);         // invoice, hrm, crm, project, pos, contract
            $table->string('trigger_event', 50);           // created, updated, status_changed, overdue
            $table->json('trigger_conditions')->nullable(); // e.g. {"field":"total_amount","operator":">","value":5000}

            // Actions (array of actions)
            $table->json('actions');                        // [{type:"email",to:"manager",template:"..."}, {type:"notification",...}]

            // Scheduling
            $table->string('schedule_type', 20)->default('immediate'); // immediate, delayed, recurring
            $table->integer('delay_minutes')->nullable();
            $table->string('cron_expression')->nullable();

            $table->unsignedBigInteger('created_by');
            $table->unsignedInteger('execution_count')->default(0);
            $table->timestamp('last_executed_at')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'is_active', 'trigger_module']);
        });

        // Workflow execution logs
        Schema::create('workflow_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('workflow_rule_id')->index();
            $table->unsignedBigInteger('company_id')->index();
            $table->string('trigger_module', 50);
            $table->string('trigger_event', 50);
            $table->string('triggerable_type')->nullable();
            $table->unsignedBigInteger('triggerable_id')->nullable();
            $table->string('status', 20)->default('pending'); // pending, running, completed, failed
            $table->json('actions_executed')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->timestamps();

            $table->index(['workflow_rule_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_logs');
        Schema::dropIfExists('workflow_rules');
    }
};
