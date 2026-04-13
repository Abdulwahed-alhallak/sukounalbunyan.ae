<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Noble\Hrm\Models\Employee;

class ProjectTimeLog extends Model
{
    use HasFactory;

    protected $table = 'project_time_logs';

    protected $fillable = [
        'user_id',
        'project_id',
        'task_id',
        'clock_in',
        'clock_out',
        'check_in_latitude',
        'check_in_longitude',
        'check_out_latitude',
        'check_out_longitude',
        'is_within_geofence',
        'accrued_cost',
        'created_by'
    ];

    protected $casts = [
        'clock_in' => 'datetime',
        'clock_out' => 'datetime',
        'is_within_geofence' => 'boolean',
        'accrued_cost' => 'decimal:2',
    ];

    /**
     * Scope to find active sessions for a user (clocked in but not out).
     */
    public function scopeActive($query)
    {
        return $query->whereNotNull('clock_in')->whereNull('clock_out');
    }

    /**
     * Relationship to the user logging the time.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the associated HR Employee record natively.
     */
    public function employee()
    {
        return $this->hasOne(Employee::class, 'user_id', 'user_id');
    }

    /**
     * Helper: Haversine distance calculation in meters.
     */
    public static function calculateDistanceMeters($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Earth's radius in meters

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
             
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
