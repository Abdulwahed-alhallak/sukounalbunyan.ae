<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->string('color', 7)->default('#6366F1'); // hex color
            $table->string('site_name')->nullable();
            $table->text('site_address')->nullable();
            $table->string('site_contact_person')->nullable();
            $table->string('site_contact_phone')->nullable();
            $table->enum('status', ['active', 'completed', 'on_hold', 'cancelled'])->default('active');
            $table->unsignedBigInteger('taskly_project_id')->nullable(); // optional link to Taskly
            $table->string('workspace')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['customer_id', 'status']);
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_projects');
    }
};
