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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('contact_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('calendar_color')->default('#f59e0b'); // Default to dion-amber
        });

        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->string('security_deposit_check')->nullable()->comment('Security check number');
            $table->decimal('security_deposit_amount', 15, 2)->default(0);
            $table->text('security_deposit_notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['contact_name', 'contact_phone', 'calendar_color']);
        });

        Schema::table('rental_contracts', function (Blueprint $table) {
            $table->dropColumn(['security_deposit_check', 'security_deposit_amount', 'security_deposit_notes']);
        });
    }
};
