<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Plan;
use App\Models\Order;
use App\Models\AddOn;
use App\Models\UserActiveModule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

echo "=================================================\n";
echo "🚀 GLOBAL SAAS ACTIVATION PROTOCOL: NOBLE 🚀\n";
echo "=================================================\n\n";

// 1. Enable ALL AddOns in the database
echo "🛠️ Enabling all system modules...\n";
AddOn::query()->update(['is_enable' => 1]);
$allModuleNames = AddOn::pluck('module')->toArray();
echo "✅ " . count($allModuleNames) . " modules enabled in the system.\n\n";

// 2. Find the target users
$emails = ['superadmin@noblearchitecture.net', 'superadmin@example.com', 'admin@example.com'];
$users = User::whereIn('email', $emails)->get();

if ($users->isEmpty()) {
    die("❌ ERROR: No administrative users found.\n");
}

DB::beginTransaction();
try {
    // 3. Create or Update the Mission Control Master Plan
    echo "🛡️ Configuring 'Mission Control Master Plan' (Lifetime)...\n";
    $plan = Plan::updateOrCreate(
        ['name' => 'Mission Control Master Plan'],
        [
            'description' => 'Unrestricted ecosystem access with infinite scalability.',
            'price' => 0,
            'duration' => 'Lifetime',
            'max_users' => -1,
            'max_customers' => -1,
            'max_vendors' => -1,
            'max_clients' => -1,
            'storage_limit' => -1,
            'enable_crm' => 1,
            'enable_hrm' => 1,
            'enable_account' => 1,
            'enable_pms' => 1,
            'enable_pos' => 1,
            'modules' => $allModuleNames, // Exact array of all available modules
            'package_price_monthly' => 0,
            'package_price_yearly' => 0,
            'status' => 1,
        ]
    );

    foreach ($users as $user) {
        // 4. Force assignment to the user
        echo "👤 Resyncing user protocol: " . $user->name . " (".$user->email.")...\n";
        $user->active_plan = $plan->id;
        $user->plan_expire_date = null; // No expiry for lifetime
        $user->lang = 'ar'; // Set to Arabic as requested
        $user->save();

        // 5. Explicitly activate every module in UserActiveModule for redundancy
        echo "🔗 Hard-binding individual module permissions for " . $user->name . "...\n";
        foreach ($allModuleNames as $moduleName) {
            UserActiveModule::updateOrCreate(
                ['user_id' => $user->id, 'module' => $moduleName]
            );
        }

        // 6. Log a successful system order
        Order::updateOrCreate(
            ['txn_id' => 'NOBLE-LIFETIME-MASTER-' . strtoupper(Str::slug($user->name))],
            [
                'order_id' => 'SYS-' . strtoupper(Str::random(10)),
                'name' => $user->name,
                'plan_name' => $plan->name,
                'plan_id' => $plan->id,
                'price' => 0,
                'price_currency' => 'USD',
                'payment_type' => 'Protocol Activation',
                'payment_status' => 'succeeded',
                'user_id' => $user->id,
            ]
        );
    }

    DB::commit();
    echo "\n✨ SUCCESS: Fully modernized access granted to " . $user->name . ".\n";
    echo "🌐 Domain: noble.dion.sy\n";
    echo "🎨 Design System: Geist 2026 Ready\n";
    echo "🕋 Modules: " . implode(', ', $allModuleNames) . "\n";
} catch (\Exception $e) {
    DB::rollback();
    echo "❌ CRITICAL ERROR: " . $e->getMessage() . "\n";
}
