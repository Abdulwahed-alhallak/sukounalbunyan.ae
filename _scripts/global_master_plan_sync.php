<?php
/**
 * NOBLE MASTER PLAN - GLOBAL SYNC SCRIPT
 * Run this on Hostinger via SSH or Web to upgrade ALL corporate accounts to the unlimited Master Plan.
 */

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\Schema;
use App\Models\UserActiveModule;
use Spatie\Permission\Models\Role;
use App\Events\GivePermissionToRole;

echo "=================================================\n";
echo "🚀 INITIATING GLOBAL MASTER PLAN SYNCHRONIZATION 🚀\n";
echo "=================================================\n\n";

// 1. Gather all 31+ Enterprise Modules
$allModules = \App\Models\AddOn::pluck('module')->toArray();
$backupModules = ["Taskly","Account","Hrm","Lead","Pos","Stripe","Paypal","AIAssistant","BudgetPlanner","Calendar","Contract","DoubleEntry","FormBuilder","Goal","Performance","Quotation","Recruitment","Slack","SupportTicket","Telegram","Timesheet","Training","Twilio","Webhook","ZoomMeeting","Retainer","Dairy","ProductService","Sales"];

$finalModules = array_unique(array_merge($allModules, $backupModules));
$modulesStr = implode(',', $finalModules);

// 2. Identify or Create the "Noble Master Plan"
$masterPlan = Plan::where('name', 'like', '%Master%')->first();
if (!$masterPlan) {
    echo "⚠️ 'Master Plan' not found by name. Defaulting to the latest active plan...\n";
    $masterPlan = Plan::latest()->first();
}

if ($masterPlan) {
    $masterPlan->modules = $finalModules; // Update plan globally
    if (Schema::hasColumn('plans', 'max_users')) {
        $masterPlan->max_users = -1;
    }
    if (Schema::hasColumn('plans', 'max_workspaces')) {
        $masterPlan->max_workspaces = -1;
    }
    $masterPlan->save();
    echo "✅ Master Plan Updated: " . $masterPlan->name . "\n";
}

// 3. Migrate All Corporate Accounts
$companies = User::where('type', 'company')->get();
$count = 0;

foreach ($companies as $user) {
    // Grant Lifetime/Unlimited Access
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

    // Unlock Workspace Modules
    if (class_exists('\App\Models\Workspace')) {
        $workspaceModel = '\App\Models\Workspace';
        $workspaces = $workspaceModel::where('created_by', $user->id)->get();
        foreach ($workspaces as $workspace) {
            $workspace->active_modules = $modulesStr;
            $workspace->save();
        }
    }

    // Refresh User Active Modules DB
    UserActiveModule::where('user_id', $user->id)->delete();
    $insertData = [];
    foreach ($finalModules as $modName) {
        $insertData[] = [
            'user_id' => $user->id,
            'module' => $modName,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
    UserActiveModule::insert($insertData);

    // Sync Roles
    $client_role = Role::where('name', 'client')->where('created_by', $user->id)->first();
    $staff_role = Role::where('name', 'staff')->where('created_by', $user->id)->first();

    if ($client_role) {
        event(new GivePermissionToRole($client_role->id, 'client', $modulesStr));
    }
    if ($staff_role) {
        event(new GivePermissionToRole($staff_role->id, 'staff', $modulesStr));
    }

    $count++;
}

echo "\n✅ SUCCESS! Converted {$count} corporate accounts to the Noble Master Plan globally.\n";
echo "All {$count} companies now have uninterrupted access to " . count($finalModules) . " modules.\n";
echo "=================================================\n";
