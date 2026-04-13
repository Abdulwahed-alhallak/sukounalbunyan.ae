<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\Schema;

class NobleMasterSync extends Command
{
    protected $signature = 'noble:master-sync';
    protected $description = 'Globally synchronizes the Noble Master Plan across all corporate accounts.';

    public function handle()
    {
        $this->info("=================================================");
        $this->info("🚀 INITIATING GLOBAL MASTER PLAN SYNCHRONIZATION (NATIVE) 🚀");
        $this->info("=================================================");

        $allModules = \App\Models\AddOn::pluck('module')->toArray();
        $backupModules = ["Taskly","Account","Hrm","Lead","Pos","Stripe","Paypal","AIAssistant","BudgetPlanner","Calendar","Contract","DoubleEntry","FormBuilder","Goal","Performance","Quotation","Recruitment","Slack","SupportTicket","Telegram","Timesheet","Training","Twilio","Webhook","ZoomMeeting","Retainer","Dairy","ProductService","Sales"];
        
        $finalModules = array_unique(array_merge($allModules, $backupModules));
        $modulesStr = implode(',', $finalModules);

        $masterPlan = Plan::where('name', 'like', '%Master%')->first() ?? Plan::latest()->first();

        if ($masterPlan) {
            $masterPlan->modules = $finalModules;
            if (Schema::hasColumn('plans', 'max_users')) $masterPlan->max_users = -1;
            if (Schema::hasColumn('plans', 'max_workspaces')) $masterPlan->max_workspaces = -1;
            $masterPlan->save();
            $this->info("✅ Master Plan Updated: " . $masterPlan->name);
        }

        $companies = User::where('type', 'company')->get();
        $count = 0;

        foreach ($companies as $user) {
            $user->active_plan = $masterPlan->id ?? 1;
            $user->plan_expire_date = null;
            $user->trial_expire_date = null;
            $user->is_trial_done = 1;
            $user->storage_limit = -1;
            $user->total_user = -1;
            
            if (Schema::hasColumn('users', 'active_module')) {
                $user->active_module = $modulesStr;
            }
            $user->save();

            \App\Models\UserActiveModule::where('user_id', $user->id)->delete();
            foreach ($finalModules as $mod) {
                \App\Models\UserActiveModule::create([
                    'user_id' => $user->id,
                    'module' => $mod
                ]);
            }
            
            event(new \App\Events\DefaultData($user->id, $modulesStr));
            $count++;
        }

        $superadmin = User::where('type', 'superadmin')->first();
        if ($superadmin && Schema::hasColumn('users', 'active_module')) {
            $superadmin->active_module = $modulesStr;
            $superadmin->save();
            $this->info("✅ Superadmin active modules overridden natively.");
        }

        $this->info("✅ SUCCESS! $count Corporate accounts upgraded permanently to full modules.");
        return 0;
    }
}
