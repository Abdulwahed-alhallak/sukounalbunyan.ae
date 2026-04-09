<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('company_assets')) return;
        Schema::create('company_assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_name');
            $table->string('asset_type')->default('Other'); // Laptop, Phone, Key, Vehicle, Other
            $table->string('serial_number')->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 15, 2)->default(0);
            $table->string('status')->default('Available'); // Available, Assigned, Under Maintenance, Retired
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->date('assigned_date')->nullable();
            $table->date('return_date')->nullable();
            $table->string('condition')->default('Good'); // New, Good, Fair, Poor
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_assets');
    }
};
