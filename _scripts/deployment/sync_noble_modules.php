<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\AddOn;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserActiveModule;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

echo "--- NOBLE ARCHITECTURE - DEEP AUDIT & SUBSCRIPTION SYNCHRONIZATION STARTED ---\n";

// Phase 1: Sync all Noble Modules
echo "1. Scanning packages/noble...\n";
$modulesPath = base_path('packages/noble');
$directories = File::directories($modulesPath);

$allModules = [];

foreach ($directories as $dir) {
    // Only valid folders with module.json
    $jsonPath = $dir . '/module.json';
    if (File::exists($jsonPath)) {
        $jsonContent = json_decode(File::get($jsonPath), true);
        $alias = $jsonContent['alias'] ?? basename($dir);
        $name = $jsonContent['name'] ?? basename($dir);
        
        $allModules[] = $name;

        // Force register or enable module
        $addon = AddOn::firstOrNew(['module' => $name]);
        $addon->name = $alias;
        $addon->monthly_price = $jsonContent['monthly_price'] ?? 0;
        $addon->yearly_price = $jsonContent['yearly_price'] ?? 0;
        $addon->package_name = $jsonContent['package_name'] ?? $name;
        $addon->is_enable = 1;

        $addon->save();
        echo "   [ENABLED] $name\n";
    }
}

// Map these 28 modules into "Professional Plan"
echo "2. Securing the Professional Plan...\n";
$proPlan = Plan::where('name', 'Professional Plan')->orWhere('name', 'Professional')->first();

if (!$proPlan) {
    // Fallback: get the highest limit plan
    $proPlan = Plan::orderBy('package_price_yearly', 'desc')->first();
}

if ($proPlan) {
    $proPlan->modules = $allModules;
    $proPlan->save();
    echo "   [SUCCESS] Professional Plan ({$proPlan->name}) updated with " . count($allModules) . " modules.\n";
} else {
    echo "   [ERROR] Cannot find a suitable Professional Plan!\n";
}

// Phase 2: Professional Plan Enforcement
echo "3. Securing Noble Corporate Subscriptions...\n";

// Helper function to link
function upgradeCompanyToPro($email, $plan, $modules) {
    $company = User::where('email', $email)->where('type', 'company')->first();
    if ($company && $plan) {
        $company->active_plan = $plan->id;
        $company->save();

        // Seed pure module list
        UserActiveModule::where('user_id', $company->id)->delete();
        foreach ($modules as $mod) {
            UserActiveModule::create([
                'user_id' => $company->id,
                'module' => $mod
            ]);
        }
        echo "   [UPGRADED] User $email is now on Professional Plan with full modules.\n";
    } else {
        echo "   [SKIPPED] User $email not found.\n";
    }
}

upgradeCompanyToPro('admin@noble.com', $proPlan, $allModules);
upgradeCompanyToPro('admin@dion.sy', $proPlan, $allModules); 

// Phase 3: Setup Testing Trial Companies
echo "4. Setting up Testing Companies (Alpha & Beta)...\n";

$basicPlan = Plan::where('name', 'Basic Plan')->first();
if (!$basicPlan && $proPlan) {
    $basicPlan = Plan::create([
        'name' => 'Basic Plan',
        'package_price_monthly' => 19,
        'package_price_yearly' => 190,
        'modules' => ['Taskly'], // Only Tasks
        'status' => 1,
        'number_of_users' => 5,
        'created_by' => 1,
    ]);
}

$standardPlan = Plan::where('name', 'Standard Plan')->first();
if (!$standardPlan && $proPlan) {
    $standardPlan = Plan::create([
        'name' => 'Standard Plan',
        'package_price_monthly' => 49,
        'package_price_yearly' => 490,
        'modules' => ['Taskly', 'Hrm'], // Tasks AND HRM
        'status' => 1,
        'number_of_users' => 20,
        'created_by' => 1,
    ]);
}

$superAdmin = User::where('type', 'superadmin')->first();

function seedTrialCompany($name, $email, $plan, $superAdmin) {
    $company = User::where('email', $email)->first();
    if (!$company) {
        $company = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make('12345678'),
            'type' => 'company',
            'lang' => 'en',
            'email_verified_at' => now(),
            'active_plan' => $plan ? $plan->id : null,
            'created_by' => $superAdmin->id ?? 1,
        ]);
        User::CompanySetting($company->id);
        User::MakeRole($company->id);
        $company->assignRole($company->type);
        echo "   [CREATED] $name ($email) on {$plan->name}\n";
    } else {
        $company->active_plan = $plan ? $plan->id : null;
        $company->save();
        echo "   [UPDATED] $name ($email) on {$plan->name}\n";
    }
}

seedTrialCompany('Alpha Corp', 'admin@alphacorp.com', $basicPlan, $superAdmin);
seedTrialCompany('Beta Ltd', 'admin@betaltd.com', $standardPlan, $superAdmin);

echo "--- SYNCHRONIZATION COMPLETE ---\n";
