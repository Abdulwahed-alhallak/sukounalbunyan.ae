<?php

namespace Noble\Hrm\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Noble\Hrm\Models\BiometricLog;
use Illuminate\Support\Facades\Log;

class BiometricApiController extends Controller
{
    /**
     * Endpoint to receive biometric sync data.
     * Expected JSON Payload:
     * {
     *   "logs": [
     *     { "emp_id": "101", "punch_time": "2026-04-07 08:00:00", "type": "check-in" },
     *     ...
     *   ],
     *   "company_id": 1 // Or determine via API token
     * }
     */
    public function syncLogs(Request $request)
    {
        $request->validate([
            'logs' => 'required|array',
            'logs.*.emp_id' => 'required|string',
            'logs.*.punch_time' => 'required|date_format:Y-m-d H:i:s',
        ]);

        // Support passing company_id explicitly for multi-tenant pushing
        $companyId = $request->input('company_id', 1);

        $insertedCount = 0;

        foreach ($request->logs as $logData) {
            // Avoid duplicate exact punches
            $exists = BiometricLog::where('emp_id', $logData['emp_id'])
                ->where('punch_time', $logData['punch_time'])
                ->where('created_by', $companyId)
                ->exists();

            if (!$exists) {
                BiometricLog::create([
                    'emp_id' => $logData['emp_id'],
                    'punch_time' => $logData['punch_time'],
                    'type' => $logData['type'] ?? null,
                    'created_by' => $companyId,
                ]);
                $insertedCount++;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => "Successfully synced {$insertedCount} logs."
        ]);
    }
}
