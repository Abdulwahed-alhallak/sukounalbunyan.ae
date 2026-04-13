<?php

namespace Noble\Hrm\Listeners;

use App\Events\UpdateUser;
use Noble\Hrm\Models\Employee;
use Illuminate\Support\Facades\Log;

class UpdateEmployeeFromUser
{
    /**
     * Handle the event.
     *
     * @param  \App\Events\UpdateUser  $event
     * @return void
     */
    public function handle(UpdateUser $event)
    {
        try {
            $user = $event->user;
            
            // Skip if user is superadmin or company creator
            if (in_array($user->type, ['superadmin', 'company'])) {
                return;
            }

            $employee = Employee::where('user_id', $user->id)->first();
            
            if ($employee) {
                $employee->update([
                    'name_ar' => $user->name,
                    'email_address' => $user->email,
                    'mobile_no' => $user->mobile_no,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to update Employee from User: ' . $e->getMessage());
        }
    }
}
