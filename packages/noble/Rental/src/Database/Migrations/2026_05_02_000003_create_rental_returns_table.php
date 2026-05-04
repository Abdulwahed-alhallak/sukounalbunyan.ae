<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_returns', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('contract_id')->constrained('rental_contracts')->onDelete('cascade');
            $blueprint->foreignId('product_id');
            $blueprint->decimal('returned_quantity', 15, 2);
            $blueprint->date('return_date');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_returns');
    }
};
