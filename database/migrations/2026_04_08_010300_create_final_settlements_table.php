<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('final_settlements')) return;
        Schema::create('final_settlements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->date('last_working_day');
            $table->string('status')->default('Open'); // Open, Processing, Paid
            $table->decimal('basic_salary', 15, 2)->default(0);
            $table->decimal('leave_encashment', 15, 2)->default(0);
            $table->decimal('gratuity', 15, 2)->default(0);
            $table->decimal('other_earnings', 15, 2)->default(0);
            $table->decimal('deductions', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('separation_reason')->nullable(); // Resignation, Termination, Contract End
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('final_settlements');
    }
};
