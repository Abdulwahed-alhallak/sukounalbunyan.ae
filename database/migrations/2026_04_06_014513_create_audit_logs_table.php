<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('user_type', 50)->nullable(); // superadmin, company, staff, etc.
            $table->string('user_name')->nullable();
            $table->string('event', 20)->index(); // created, updated, deleted, login, logout, exported, etc.
            $table->string('auditable_type')->nullable()->index(); // Model class
            $table->unsignedBigInteger('auditable_id')->nullable()->index();
            $table->string('auditable_label')->nullable(); // Human-readable label (e.g., "Invoice #1234")
            $table->json('old_values')->nullable(); // Previous state
            $table->json('new_values')->nullable(); // New state
            $table->json('changed_fields')->nullable(); // List of changed field names
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable(); // GET, POST, PUT, DELETE
            $table->string('route_name')->nullable();
            $table->unsignedBigInteger('company_id')->nullable()->index(); // For tenant isolation
            $table->text('comment')->nullable(); // Optional manual note
            $table->timestamps();

            // Composite indexes for common queries
            $table->index(['auditable_type', 'auditable_id']);
            $table->index(['user_id', 'event']);
            $table->index(['company_id', 'created_at']);
            $table->index('created_at');
        });

        // Separate table for login/security audit
        Schema::create('security_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('event', 50)->index(); // login, logout, failed_login, password_changed, 2fa_enabled, etc.
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->string('device_type', 20)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->boolean('is_suspicious')->default(false);
            $table->text('details')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'event']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_audit_logs');
        Schema::dropIfExists('audit_logs');
    }
};
