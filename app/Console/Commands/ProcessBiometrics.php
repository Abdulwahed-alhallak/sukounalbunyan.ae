<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Noble\Hrm\Models\BiometricLog;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Attendance;
use Noble\Hrm\Models\Shift;

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
        Log::info("HRM: Biometric processing started.");

        $unprocessedLogs = BiometricLog::where('is_processed', false)
            ->orderBy('punch_time', 'asc')
            ->get()
            ->groupBy(function($log) {
                // Group by Company, Employee AND date to process day by day securely
                $date = Carbon::parse($log->punch_time)->format('Y-m-d');
                return $log->created_by . '_' . $log->emp_id . '_' . $date;
            });

        $processedCount = 0;

        foreach ($unprocessedLogs as $groupKey => $logs) {
            $firstLog = $logs->first();
            $date = Carbon::parse($firstLog->punch_time)->format('Y-m-d');
            $empId = $firstLog->emp_id;
            $companyId = $firstLog->created_by;

            // Find Employee
            $employee = Employee::with('shift')
                ->where('employee_id', $empId)
                ->where('created_by', $companyId)
                ->first();

            if (!$employee) {
                Log::warning("HRM: Employee not found for ID: {$empId} in Company: {$companyId}");
                foreach($logs as $log) {
                    $log->is_processed = true;
                    $log->error_message = 'Employee not found in system.';
                    $log->save();
                }
                continue;
            }

            // Simple Logic: First-In / Last-Out
            $clockInTimeStr = $logs->min('punch_time');
            $clockOutTimeStr = $logs->max('punch_time');
            
            $clockInTime = Carbon::parse($clockInTimeStr);
            $clockOutTime = Carbon::parse($clockOutTimeStr);

            $attendance = Attendance::firstOrNew([
                'employee_id' => $employee->user_id,
                'date' => $date,
                'created_by' => $companyId
            ]);

            $attendance->shift_id = $employee->shift_id;
            
            // Update clock in if earlier than existing
            if (!$attendance->clock_in || $clockInTime->lt($attendance->clock_in)) {
                $attendance->clock_in = $clockInTime;
            }

            // Update clock out if later than existing
            if ($clockInTimeStr !== $clockOutTimeStr) {
                if (!$attendance->clock_out || $clockOutTime->gt($attendance->clock_out)) {
                    $attendance->clock_out = $clockOutTime;
                }
            }

            // Calculation Logic
            if ($attendance->clock_in && $attendance->clock_out) {
                $shift = $employee->shift;
                
                // Standard Hours (Default 8 if no shift)
                $standardHours = 8;
                $shiftStartTimeStr = null;
                
                if ($shift) {
                    $sStart = Carbon::parse($date . ' ' . $shift->start_time);
                    $sEnd = Carbon::parse($date . ' ' . $shift->end_time);
                    if ($sEnd->lt($sStart)) $sEnd->addDay();
                    
                    $shiftStartTimeStr = $sStart;

                    $breakMinutes = 0;
                    if ($shift->break_start_time && $shift->break_end_time) {
                        $bStart = Carbon::parse($date . ' ' . $shift->break_start_time);
                        $bEnd = Carbon::parse($date . ' ' . $shift->break_end_time);
                        if ($bEnd->lt($bStart)) $bEnd->addDay();
                        $breakMinutes = $bStart->diffInMinutes($bEnd);
                    }
                    
                    $standardHours = round(($sStart->diffInMinutes($sEnd) - $breakMinutes) / 60, 2);
                }

                $totalMinutes = $attendance->clock_in->diffInMinutes($attendance->clock_out);
                $totalHours = round($totalMinutes / 60, 2);
                
                $attendance->total_hour = $totalHours;
                $attendance->overtime_hours = max(0, $totalHours - $standardHours);
                
                if ($attendance->overtime_hours > 0 && $employee->rate_per_hour) {
                    $attendance->overtime_amount = round($attendance->overtime_hours * $employee->rate_per_hour, 2);
                }

                // Enhanced Status logic
                $isLate = false;
                if ($shiftStartTimeStr && $attendance->clock_in->gt($shiftStartTimeStr->addMinutes(15))) {
                    $isLate = true;
                }

                if ($totalHours >= $standardHours) {
                    $attendance->status = $isLate ? 'late' : 'present';
                } elseif ($totalHours >= ($standardHours / 2)) {
                    $attendance->status = 'half day';
                } else {
                    $attendance->status = 'absent';
                }
            } else {
                // If only one punch is recorded today
                $attendance->status = 'present'; 
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
        Log::info("HRM: Biometric processing completed. Processed {$processedCount} records.");
    }
}
