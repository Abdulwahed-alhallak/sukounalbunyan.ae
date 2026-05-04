<?php
// ============================================================
// Sukoun Albunyan — Full Module & Plan Activation Script v2
// ============================================================

use App\Models\User;
use App\Models\Plan;
use App\Models\AddOn;
use App\Models\UserActiveModule;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

echo "🚀 Starting Full Module & Plan Activation v2...\n";

// ─── 0. Ensure superadmin exists ──────────────────────────────
$superadmin = User::where('type', 'superadmin')->first();
if (!$superadmin) {
    $superadmin = User::where('email', 'superadmin@noblearchitecture.net')->first();
    if ($superadmin) {
        $superadmin->type = 'super admin';
        $superadmin->save();
        echo "✅ Fixed existing superadmin user (ID: {$superadmin->id}).\n";
    } else {
        $superadmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@noblearchitecture.net',
            'password' => Hash::make('Nn@!23456'),
            'type' => 'super admin',
            'email_verified_at' => now(),
            'active_status' => 1,
            'is_enable_login' => 1,
            'lang' => 'ar',
        ]);
        echo "✅ Created superadmin user (ID: {$superadmin->id}).\n";
    }
}

$companyAdmin = User::where('email', 'admin@noblearchitecture.net')->first();
echo "📌 Superadmin ID: {$superadmin->id}, Company Admin ID: {$companyAdmin->id}\n";

// ─── 1. Register all modules in add_ons table ─────────────────
$packageDirs = glob(base_path('packages/noble/*'), GLOB_ONLYDIR);
$modulesRegistered = 0;

foreach ($packageDirs as $dir) {
    $moduleName = basename($dir);
    $jsonPath = $dir . '/module.json';
    
    $data = [
        'module' => $moduleName,
        'name' => $moduleName,
        'is_enable' => 1,
        'for_admin' => 0,
        'monthly_price' => 0,
        'yearly_price' => 0,
        'priority' => 10,
        'package_name' => strtolower($moduleName),
    ];
    
    if (File::exists($jsonPath)) {
        $json = json_decode(File::get($jsonPath), true);
        $data['name'] = $json['alias'] ?? $json['name'] ?? $moduleName;
        $data['priority'] = $json['priority'] ?? 10;
        $data['monthly_price'] = $json['monthly_price'] ?? 0;
        $data['yearly_price'] = $json['yearly_price'] ?? 0;
        $data['package_name'] = $json['package_name'] ?? strtolower($moduleName);
    }
    
    if (in_array($moduleName, ['LandingPage', 'GoogleCaptcha'])) {
        $data['for_admin'] = 1;
    }
    
    AddOn::updateOrCreate(['module' => $moduleName], $data);
    $modulesRegistered++;
}

echo "✅ Registered $modulesRegistered modules in add_ons (all enabled).\n";

// ─── 2. Create the Noble Enterprise Master Plan ───────────────
$allModuleNames = array_map('basename', $packageDirs);

$plan = Plan::updateOrCreate(
    ['name' => 'Noble Enterprise Master'],
    [
        'description' => 'Unlimited Lifetime Corporate Subscription',
        'number_of_users' => -1,
        'storage_limit' => 999999999,
        'status' => true,
        'free_plan' => true,
        'modules' => $allModuleNames,
        'package_price_yearly' => 0,
        'package_price_monthly' => 0,
        'trial' => false,
        'trial_days' => 0,
        'created_by' => $superadmin->id,
    ]
);

echo "✅ Plan '{$plan->name}' (ID: {$plan->id}) created.\n";

// ─── 3. Assign plan to both superadmin and company admin ──────
$targetUsers = User::whereIn('id', [$superadmin->id, $companyAdmin->id])->get();

foreach ($targetUsers as $user) {
    $user->active_plan = $plan->id;
    $user->plan_expire_date = null;
    $user->total_user = -1;
    $user->storage_limit = 999999999;
    $user->save();

    // Register ALL modules in user_active_modules
    UserActiveModule::where('user_id', $user->id)->delete();
    foreach ($allModuleNames as $mod) {
        UserActiveModule::create([
            'user_id' => $user->id,
            'module' => $mod,
        ]);
    }
    
    echo "✅ User '{$user->email}' — plan assigned, $modulesRegistered modules activated.\n";
}

// ─── 4. Company settings + roles ──────────────────────────────
User::CompanySetting($companyAdmin->id);
User::MakeRole($companyAdmin->id);
echo "✅ Company settings & roles synced.\n";

// ─── 5. Clear caches ─────────────────────────────────────────
Cache::flush();
echo "✅ All caches flushed.\n";

// ─── 6. Final Summary ────────────────────────────────────────
echo "\n🏁 FINAL STATUS:\n";
echo json_encode([
    'addons_total' => AddOn::count(),
    'addons_enabled' => AddOn::where('is_enable', 1)->count(),
    'plans' => Plan::count(),
    'admin_active_modules' => UserActiveModule::where('user_id', $companyAdmin->id)->count(),
    'admin_total_user' => $companyAdmin->fresh()->total_user,
    'admin_storage' => $companyAdmin->fresh()->storage_limit,
], JSON_PRETTY_PRINT) . "\n";
