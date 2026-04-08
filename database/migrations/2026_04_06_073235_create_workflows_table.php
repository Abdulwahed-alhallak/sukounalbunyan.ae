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
        Schema::create('workflows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->nullable(); // Super Admin if null
            $table->string('name');
            $table->string('trigger_event'); // e.g., 'lead.converted', 'invoice.created'
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Note: In some systems company is integer, but unsignedBigInteger is standard
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflows');
    }
};
