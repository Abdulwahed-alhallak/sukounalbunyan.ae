<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('task_attachments', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('attachable');
            $table->unsignedBigInteger('task_id')->nullable(); // For backward compatibility if needed, but we'll use polymorphism
            $table->string('file_name');
            $table->string('file_path');
            $table->unsignedBigInteger('uploaded_by');
            $table->unsignedBigInteger('creator_id');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('task_attachments');
    }
};
