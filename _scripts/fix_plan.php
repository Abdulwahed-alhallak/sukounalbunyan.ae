<?php
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Fix ALL company users
$companyUsers = App\Models\User::where('type', 'company')->get();
echo "=== Fixing All Company Users ===" . PHP_EOL;

foreach ($companyUsers as $company) {
    echo PHP_EOL . "User: {$company->id} - {$company->name} ({$company->email})" . PHP_EOL;
    echo "  Before: active_plan={$company->active_plan}, expire={$company->plan_expire_date}" . PHP_EOL;
    
    $company->active_plan = 8; // Mission Control Master Plan
    $company->plan_expire_date = '2030-12-31';
    $company->total_user = 999;
    $company->storage_limit = 999999;
    $company->is_trial_done = 1;
    $company->save();
    
    echo "  After:  active_plan=8, expire=2030-12-31, users=999, storage=999999" . PHP_EOL;
    echo "  ✅ Fixed!" . PHP_EOL;
    
    // Activate all modules
    $modules = ['Account', 'AIAssistant', 'BudgetPlanner', 'Calendar', 'Contract', 'DoubleEntry', 
                'FormBuilder', 'Goal', 'GoogleCaptcha', 'Hrm', 'LandingPage', 'Lead', 'Paypal', 
                'Performance', 'Pos', 'ProductService', 'Quotation', 'Recruitment', 'Slack', 
                'Stripe', 'SupportTicket', 'Taskly', 'Telegram', 'Timesheet', 'Training', 
                'Twilio', 'Webhook', 'ZoomMeeting'];
    
    foreach ($modules as $module) {
        App\Models\UserActiveModule::updateOrCreate(
            ['user_id' => $company->id, 'module' => $module],
            ['user_id' => $company->id, 'module' => $module]
        );
    }
    echo "  ✅ All " . count($modules) . " modules activated!" . PHP_EOL;
}

// Also fix superadmin users
echo PHP_EOL . "=== Fixing SuperAdmin Users ===" . PHP_EOL;
$superAdmins = App\Models\User::where('type', 'superadmin')->get();
foreach ($superAdmins as $sa) {
    echo "SuperAdmin: {$sa->id} - {$sa->name} ({$sa->email})" . PHP_EOL;
}

echo PHP_EOL . "=== Done! Refresh browser to see changes ===" . PHP_EOL;
