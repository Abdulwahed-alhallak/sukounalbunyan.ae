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
        Schema::create('employee_violations', function (Blueprint $table) {
            $table->id();
            $table->integer('employee_id');
            $table->integer('violation_type_id');
            $table->date('violation_date');
            $table->date('incident_date')->nullable();
            $table->string('status')->default('Pending'); // Pending, Applied
            $table->string('action_taken')->nullable(); // Deduction, Warning
            $table->decimal('deduction_amount', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->integer('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_violations');
    }
};
