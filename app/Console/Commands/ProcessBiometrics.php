<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessBiometrics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hrm:process-biometrics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process raw biometric logs and insert them into attendances';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting biometric processing...");

        $unprocessedLogs = \Noble\Hrm\Models\BiometricLog::where('is_processed', false)
            ->orderBy('punch_time', 'asc')
            ->get()
            ->groupBy(function($log) {
                // Group by employee AND date to process day by day
                $date = \Carbon\Carbon::parse($log->punch_time)->format('Y-m-d');
                return $log->emp_id . '_' . $date;
            });

        $processedCount = 0;

        foreach ($unprocessedLogs as $groupKey => $logs) {
            $firstLog = $logs->first();
            $date = \Carbon\Carbon::parse($firstLog->punch_time)->format('Y-m-d');
            $empId = $firstLog->emp_id;
            $companyId = $firstLog->created_by;

            // Find Employee
            $employee = \Noble\Hrm\Models\Employee::with('shift')
                ->where('employee_id', $empId)
                ->where('created_by', $companyId)
                ->first();

            if (!$employee) {
                // Mark logs as processed with error to avoid repeated failed processing
                foreach($logs as $log) {
                    $log->is_processed = true;
                    $log->error_message = 'Employee not found in system.';
                    $log->save();
                }
                continue;
            }

            // Determine IN and OUT
            $clockInTime = $logs->min('punch_time');
            $clockOutTime = $logs->max('punch_time');
            
            // If only one punch exists, we might treat it as clock_in, but for a complete day we usually need two. 
            // In a real system, the command runs at the end of the day or frequently. 
            // We can just update the existing attendance if it exists.
            $attendance = \Noble\Hrm\Models\Attendance::firstOrNew([
                'employee_id' => $employee->user_id,
                'date' => $date,
                'created_by' => $companyId
            ]);

            $attendance->shift_id = $employee->shift_id;
            
            // Only update clock in if not set or if new punch is earlier
            if (!$attendance->clock_in || $clockInTime < $attendance->clock_in) {
                $attendance->clock_in = \Carbon\Carbon::parse($clockInTime)->format('H:i');
            }

            // If we have distinct punches, highest is clock out
            if ($clockInTime !== $clockOutTime) {
                $attendance->clock_out = \Carbon\Carbon::parse($clockOutTime)->format('H:i');
            }

            // Basic hour calculation
            if ($attendance->clock_in && $attendance->clock_out) {
                $cIn = \Carbon\Carbon::parse($date . ' ' . $attendance->clock_in);
                $cOut = \Carbon\Carbon::parse($date . ' ' . $attendance->clock_out);
                
                $diffInMinutes = $cIn->diffInMinutes($cOut);
                $attendance->total_hour = round($diffInMinutes / 60, 2);
                $attendance->status = 'present';
            } else {
                $attendance->status = 'present'; // partial present
            }

            $attendance->creator_id = $companyId;
            $attendance->save();

            // Mark logs as processed
            foreach($logs as $log) {
                $log->is_processed = true;
                $log->error_message = null;
                $log->save();
                $processedCount++;
            }
        }

        $this->info("Successfully processed {$processedCount} records.");
    }
}
