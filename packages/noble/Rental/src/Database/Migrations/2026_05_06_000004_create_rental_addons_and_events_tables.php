<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('rental_contracts')->cascadeOnDelete();
            $table->unsignedBigInteger('product_id');
            $table->decimal('quantity', 10, 2);
            $table->decimal('price_per_cycle', 12, 2)->default(0);
            $table->date('effective_date'); // billing starts from this date
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['contract_id', 'effective_date']);
        });

        Schema::create('rental_contract_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained('rental_contracts')->cascadeOnDelete();
            $table->enum('event_type', [
                'created',
                'activated',
                'partial_return',
                'full_return',
                'addon',
                'renewal',
                'lease_to_own',
                'payment',
                'invoice_generated',
                'closed',
                'deposit_settled',
            ]);
            $table->json('details')->nullable(); // flexible payload
            $table->decimal('amount', 12, 2)->nullable(); // monetary amount if relevant
            $table->timestamp('occurred_at')->useCurrent();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['contract_id', 'event_type']);
            $table->index('occurred_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_contract_events');
        Schema::dropIfExists('rental_addons');
    }
};
