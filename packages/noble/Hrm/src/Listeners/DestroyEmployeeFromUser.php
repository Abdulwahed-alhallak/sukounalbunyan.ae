<?php

namespace Noble\Hrm\Listeners;

use App\Events\DestroyUser;
use Noble\Hrm\Models\Employee;
use Illuminate\Support\Facades\Log;

class DestroyEmployeeFromUser
{
    /**
     * Handle the event.
     *
     * @param  \App\Events\DestroyUser  $event
     * @return void
     */
    public function handle(DestroyUser $event)
    {
        try {
            $user = $event->user;
            
            // Skip if user is superadmin or company creator
            if (in_array($user->type, ['superadmin', 'company'])) {
                return;
            }

            $employee = Employee::where('user_id', $user->id)->first();
            
            if ($employee) {
                $employee->delete();
            }
        } catch (\Exception $e) {
            Log::error('Failed to delete Employee from User: ' . $e->getMessage());
        }
    }
}
