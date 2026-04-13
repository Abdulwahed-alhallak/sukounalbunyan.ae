<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $allModules = ["Taskly","Account","Hrm","Lead","Pos","Stripe","Paypal","AIAssistant","BudgetPlanner","Calendar","Contract","DoubleEntry","FormBuilder","Goal","Performance","Quotation","Recruitment","Slack","SupportTicket","Telegram","Timesheet","Training","Twilio","Webhook","ZoomMeeting","Retainer","Dairy","ProductService","Sales"];
        
        $plans = [
            [
                'name' => 'Noble Enterprise Master',
                'description' => 'Unlimited Lifetime Corporate Subscription',
                'number_of_users' => -1,
                'storage_limit' => 999999999,
                'status' => true,
                'free_plan' => true,
                'modules' => $allModules,
                'package_price_yearly' => 0,
                'package_price_monthly' => 0,
                'trial' => false,
                'trial_days' => 0,
                'created_by' => 1,
            ]
        ];

        $plan = Plan::first();
        if (!$plan) {
            foreach ($plans as $plan) {
                Plan::firstOrCreate(
                    ['name' => $plan['name']],
                    $plan
                );
            }
        }
    }
}
