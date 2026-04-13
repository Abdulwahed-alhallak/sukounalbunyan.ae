<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Plan;
use App\Models\Order;
use App\Models\OrderExtraRequest;
use Illuminate\Support\Facades\DB;

echo "=================================================\n";
echo "🚀 SETTING UP LIFETIME MASTER PLAN FOR USER NOBLE 🚀\n";
echo "=================================================\n\n";

// 1. Find the target user
$user = User::where('name', 'NOBLE')->orWhere('email', 'admin@example.com')->first();
if (!$user) {
    die("ERROR: User NOBLE not found.\n");
}

DB::beginTransaction();
try {
    // 2. Create or Update the Master Plan
    $plan = Plan::updateOrCreate(
        ['name' => 'Legacy Master Plan'],
        [
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
            'modules' => 'all', // Assuming the app uses this for logic
            'details' => 'Full production master plan for early adopters.',
        ]
    );

    // 3. Assign plan to user
    $user->plan_id = $plan->id;
    $user->plan_expire_date = null; // null usually means lifetime
    $user->save();

    // 4. Record as Order for validity
    Order::create([
        'order_id' => 'SYS-' . strtoupper(Str::random(10)),
        'name' => $user->name,
        'card_number' => null,
        'card_exp_month' => null,
        'card_exp_year' => null,
        'plan_name' => $plan->name,
        'plan_id' => $plan->id,
        'price' => 0,
        'price_currency' => 'USD',
        'txn_id' => 'LIFETIME-BONUS',
        'payment_type' => 'Manually Activated',
        'payment_status' => 'succeeded',
        'receipt' => null,
        'user_id' => $user->id,
    ]);

    DB::commit();
    echo "SUCCESS: User " . $user->name . " is now on the Lifetime Master Plan.\n";
    echo "All modules and unlimited limits have been enabled.\n";
} catch (\Exception $e) {
    DB::rollback();
    echo "CRITICAL ERROR: " . $e->getMessage() . "\n";
}
