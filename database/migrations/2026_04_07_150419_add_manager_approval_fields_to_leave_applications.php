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
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->string('manager_status')->default('pending')->after('status')->comment('pending, approved, rejected');
            $table->unsignedBigInteger('manager_id')->nullable()->after('manager_status');
            $table->text('manager_comment')->nullable()->after('manager_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->dropColumn(['manager_status', 'manager_id', 'manager_comment']);
        });
    }
};
