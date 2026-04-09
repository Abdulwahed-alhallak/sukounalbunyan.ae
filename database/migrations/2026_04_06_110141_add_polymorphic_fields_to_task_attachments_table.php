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
        Schema::table('task_attachments', function (Blueprint $table) {
            if (!Schema::hasColumn('task_attachments', 'attachable_type')) {
                $table->string('attachable_type')->nullable();
            }
            if (!Schema::hasColumn('task_attachments', 'attachable_id')) {
                $table->unsignedBigInteger('attachable_id')->nullable();
                $table->index(['attachable_type', 'attachable_id']);
            }
            if (Schema::hasColumn('task_attachments', 'task_id')) {
                $table->unsignedBigInteger('task_id')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('task_attachments', function (Blueprint $table) {
            //
        });
    }
};
