<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_contract_items', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('contract_id')->constrained('rental_contracts')->onDelete('cascade');
            $blueprint->foreignId('product_id'); // ProductServiceItem
            $blueprint->decimal('quantity', 15, 2);
            $blueprint->decimal('price_per_cycle', 15, 2); // Price per day or month
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_contract_items');
    }
};
