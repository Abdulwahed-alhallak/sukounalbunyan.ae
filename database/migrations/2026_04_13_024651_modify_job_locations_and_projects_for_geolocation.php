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
        Schema::table('job_locations', function (Blueprint $table) {
            if (!Schema::hasColumn('job_locations', 'latitude')) {
                $table->decimal('latitude', 10, 8)->nullable()->after('address');
                $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
                $table->integer('geofence_radius_meters')->default(50)->after('longitude');
            }
        });

        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'job_location_id')) {
                $table->unsignedBigInteger('job_location_id')->nullable()->after('status');
                $table->foreign('job_location_id')->references('id')->on('job_locations')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'job_location_id')) {
                $table->dropForeign(['job_location_id']);
                $table->dropColumn('job_location_id');
            }
        });

        Schema::table('job_locations', function (Blueprint $table) {
            if (Schema::hasColumn('job_locations', 'latitude')) {
                $table->dropColumn(['latitude', 'longitude', 'geofence_radius_meters']);
            }
        });
    }
};
