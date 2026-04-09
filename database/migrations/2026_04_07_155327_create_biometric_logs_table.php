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
        if (Schema::hasTable('biometric_logs')) return;
        Schema::create('biometric_logs', function (Blueprint $table) {
            $table->id();
            $table->string('emp_id')->comment('employee_id in system');
            $table->datetime('punch_time');
            $table->string('type')->nullable()->comment('check-in / check-out');
            $table->boolean('is_processed')->default(false);
            $table->text('error_message')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biometric_logs');
    }
};
