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
        if (!Schema::hasTable('project_time_logs')) {
            Schema::create('project_time_logs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('project_id');
                $table->unsignedBigInteger('task_id')->nullable();
                
                $table->dateTime('clock_in')->nullable();
                $table->dateTime('clock_out')->nullable();
                
                // Geolocation Tracking
                $table->decimal('check_in_latitude', 10, 8)->nullable();
                $table->decimal('check_in_longitude', 11, 8)->nullable();
                $table->decimal('check_out_latitude', 10, 8)->nullable();
                $table->decimal('check_out_longitude', 11, 8)->nullable();
                $table->boolean('is_within_geofence')->default(false);
                
                // Financial tracking
                $table->decimal('accrued_cost', 15, 2)->default(0);
                
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                // Foreign Keys
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_time_logs');
    }
};
