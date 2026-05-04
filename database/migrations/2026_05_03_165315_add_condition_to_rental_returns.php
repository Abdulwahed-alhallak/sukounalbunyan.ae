<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('rental_returns', function (Blueprint $table) {
            $table->string('condition')->default('good')->after('returned_quantity'); // good, lost, scrap
        });
    }

    public function down()
    {
        Schema::table('rental_returns', function (Blueprint $table) {
            $table->dropColumn('condition');
        });
    }
};
