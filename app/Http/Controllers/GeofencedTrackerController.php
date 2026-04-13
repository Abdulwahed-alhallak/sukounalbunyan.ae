<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectTimeLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Noble\Account\Models\Expense;

class GeofencedTrackerController extends Controller
{
    /**
     * API Handler for an Employee clocking into a project location.
     */
    public function clockIn(Request $request)
    {
        $request->validate([
            'project_id' => 'required|integer',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        $user = Auth::user();

        // 1. Check if already clocked into another active project.
        $activeSession = ProjectTimeLog::where('user_id', $user->id)
                                        ->active()
                                        ->first();

        if ($activeSession) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are already clocked into another project. Please clock out first.'
            ], 422);
        }

        // 2. Retrieve Project and its Bound Location
        $project = DB::table('projects')
                     ->leftJoin('job_locations', 'projects.job_location_id', '=', 'job_locations.id')
                     ->where('projects.id', $request->project_id)
                     ->select('projects.id', 'job_locations.latitude', 'job_locations.longitude', 'job_locations.geofence_radius_meters')
                     ->first();

        if (!$project) {
            return response()->json(['status' => 'error', 'message' => 'Project not found.'], 404);
        }

        // 3. Smart Geofence Logic Validation
        $isWithinGeofence = true; // Default True if no coordinates setup
        if ($project->latitude && $project->longitude) {
            $distance = ProjectTimeLog::calculateDistanceMeters(
                $request->latitude, $request->longitude,
                $project->latitude, $project->longitude
            );

            // Verify if worker is actually physically present within the allocated radius limits
            if ($distance > $project->geofence_radius_meters) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Geofence Violation: You are {$distance} meters away from the project site. You must be within {$project->geofence_radius_meters} meters to clock in."
                ], 403);
            }
        }

        // 4. Create the Smart Log
        $log = ProjectTimeLog::create([
            'user_id' => $user->id,
            'project_id' => $request->project_id,
            'clock_in' => Carbon::now(),
            'check_in_latitude' => $request->latitude,
            'check_in_longitude' => $request->longitude,
            'is_within_geofence' => $isWithinGeofence,
            'created_by' => $user->created_by
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Clocked in successfully to the project location.',
            'data' => $log
        ]);
    }

    /**
     * API Handler for Clocking out, which automatically bridges the calculated labor cost to HR and Finance modules.
     */
    public function clockOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        $user = Auth::user();
        $employee = $user->employee ?? DB::table('employees')->where('user_id', $user->id)->first();

        // Find the active session for the user
        $session = ProjectTimeLog::where('user_id', $user->id)->active()->first();

        if (!$session) {
            return response()->json(['status' => 'error', 'message' => 'No active project shift found.'], 404);
        }

        $clockOutTime = Carbon::now();
        $durationHours = $session->clock_in->diffInMinutes($clockOutTime) / 60;

        // Smart Cross-Module Interaction: Accruing Cost based on HRM Salary
        $accruedCost = 0;
        if ($employee && isset($employee->rate_per_hour)) {
            $accruedCost = $durationHours * $employee->rate_per_hour;
        }

        // Secure checkout and log final GPS pin
        $session->update([
            'clock_out' => $clockOutTime,
            'check_out_latitude' => $request->latitude,
            'check_out_longitude' => $request->longitude,
            'accrued_cost' => $accruedCost
        ]);

        // Push Auto-Expense to General Ledger for the Project
        $bankAcc = \Noble\Account\Models\BankAccount::first();
        $catAcc = \Noble\Account\Models\ExpenseCategories::first();
        
        if ($accruedCost > 0 && $bankAcc && $catAcc) {
            Expense::create([
                'expense_date' => Carbon::now(),
                'category_id' => $catAcc->id,
                'bank_account_id' => $bankAcc->id,
                'amount' => $accruedCost,
                'description' => "Auto-accrued Labor Cost ({$durationHours} hrs) for Employee ID: {$employee->id}",
                'project_id' => $session->project_id,
                'status' => 'draft',
                'creator_id' => $user->creator_id ?? 1,
                'created_by' => $user->created_by ?? 1
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Clocked out successfully. Logged {$durationHours} hours.",
            'labor_cost_accrued' => $accruedCost
        ]);
    }
}
