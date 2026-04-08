<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // User-facing notifications — the actual notification center data
        Schema::create('user_notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();          // Recipient user
            $table->unsignedBigInteger('company_id')->nullable()->index(); // Tenant isolation
            $table->string('type', 50)->index();                      // invoice, hrm, crm, project, system, etc.
            $table->string('category', 30)->default('info');          // info, warning, success, danger
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('icon', 50)->nullable();                   // lucide icon name
            $table->string('action_url', 500)->nullable();            // Link to take action
            $table->string('action_label', 100)->nullable();          // Button text
            $table->string('notifiable_type')->nullable();            // Related model class
            $table->unsignedBigInteger('notifiable_id')->nullable();  // Related model ID
            $table->unsignedBigInteger('triggered_by')->nullable();   // User who caused the notification
            $table->json('metadata')->nullable();                     // Extra data
            $table->timestamp('read_at')->nullable();                 // Null = unread
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            // Composite indexes for fast queries
            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'type', 'read_at']);
            $table->index(['company_id', 'type']);
            $table->index(['notifiable_type', 'notifiable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_notifications');
    }
};
