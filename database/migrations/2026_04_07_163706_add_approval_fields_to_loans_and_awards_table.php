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
        Schema::table('loans', function (Blueprint $table) {
            if (!Schema::hasColumn('loans', 'status')) {
                $table->string('status')->default('approved'); // Default to approved for older records
            }
            if (!Schema::hasColumn('loans', 'manager_status')) {
                $table->string('manager_status')->default('approved');
                $table->text('manager_comment')->nullable();
                $table->unsignedBigInteger('manager_id')->nullable();
                $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
            }
        });

        Schema::table('awards', function (Blueprint $table) {
            if (!Schema::hasColumn('awards', 'status')) {
                $table->string('status')->default('approved');
            }
            if (!Schema::hasColumn('awards', 'manager_status')) {
                $table->string('manager_status')->default('approved');
                $table->text('manager_comment')->nullable();
                $table->unsignedBigInteger('manager_id')->nullable();
                $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropColumn(['status', 'manager_status', 'manager_comment', 'manager_id']);
        });

        Schema::table('awards', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropColumn(['status', 'manager_status', 'manager_comment', 'manager_id']);
        });
    }
};
