<?php

namespace Noble\Hrm\Listeners;

use App\Events\CreateUser;
use Noble\Hrm\Models\Employee;
use Illuminate\Support\Facades\Log;

class CreateEmployeeFromUser
{
    /**
     * Handle the event.
     *
     * @param  \App\Events\CreateUser  $event
     * @return void
     */
    public function handle(CreateUser $event)
    {
        try {
            $user = $event->user;
            
            // Skip if user is superadmin or company creator
            if (in_array($user->type, ['superadmin', 'company'])) {
                return;
            }

            // Generate a unified employee ID
            $employeeId = Employee::generateEmployeeId();

            // Check if employee already exists to prevent duplicates
            $exists = Employee::where('user_id', $user->id)->first();
            
            if (!$exists) {
                Employee::create([
                    'user_id' => $user->id,
                    'name_ar' => $user->name, // Using 'name' for name_ar as default standard
                    'email_address' => $user->email,
                    'mobile_no' => $user->mobile_no,
                    'employee_id' => $employeeId,
                    'date_of_joining' => now(),
                    'created_by' => $user->created_by,
                    'creator_id' => $user->creator_id ?? $user->created_by,
                    'employee_status' => 'Active',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to sync User to Employee: ' . $e->getMessage());
        }
    }
}
