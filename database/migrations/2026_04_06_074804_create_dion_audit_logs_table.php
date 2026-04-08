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
        Schema::create('dion_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('action'); // e.g. "AUTH_LOGIN", "DATA_DELETED", "EXPORT_CSV"
            $table->string('entity_type')->nullable(); // Model name
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('old_payload')->nullable();
            $table->json('new_payload')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->text('geo_location')->nullable();
            $table->string('risk_level')->default('LOW'); // LOW, MEDIUM, CRITICAL
            $table->timestamps();

            $table->index('company_id');
            $table->index('user_id');
            $table->index('action');
            $table->index('risk_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dion_audit_logs');
    }
};
