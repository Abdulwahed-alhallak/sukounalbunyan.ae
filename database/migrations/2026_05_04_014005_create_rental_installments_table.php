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
        Schema::create('rental_installments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('rental_contracts')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->date('due_date');
            $table->string('status')->default('pending'); // pending, invoiced, paid
            $table->foreignId('invoice_id')->nullable()->constrained('sales_invoices')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->string('workspace')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_installments');
    }
};
