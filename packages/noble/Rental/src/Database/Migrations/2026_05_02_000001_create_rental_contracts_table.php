<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_contracts', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('contract_number')->unique();
            $blueprint->foreignId('customer_id');
            $blueprint->foreignId('warehouse_id')->default(1);
            $blueprint->date('start_date');
            $blueprint->date('end_date')->nullable();
            $blueprint->string('billing_cycle')->default('daily'); // daily, monthly
            $blueprint->string('status')->default('active'); // active, closed, pending
            $blueprint->text('notes')->nullable();
            $blueprint->unsignedBigInteger('created_by');
            $blueprint->unsignedBigInteger('workspace');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_contracts');
    }
};
