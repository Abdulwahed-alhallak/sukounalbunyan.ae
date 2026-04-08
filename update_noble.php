<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$nobleAdmin = \App\Models\User::where('email', 'admin@noble.com')->first();
if ($nobleAdmin) {
    // Determine active plan to fetch modules
    if ($nobleAdmin->active_plan) {
        $plan = \App\Models\Plan::find($nobleAdmin->active_plan);
        if ($plan && $plan->modules) {
            $modules = is_string($plan->modules) ? explode(',', $plan->modules) : $plan->modules;
            foreach ($modules as $mod) {
                \App\Models\UserActiveModule::firstOrCreate([
                    'user_id' => $nobleAdmin->id,
                    'module' => $mod
                ]);
            }
            echo "Modules added: " . implode(',', $modules) . "\n";
        } else {
            // Give all active modules if plan modules are empty or specific
            $allModules = array_keys((new \App\Classes\Module())->allEnabled());
            foreach ($allModules as $mod) {
                \App\Models\UserActiveModule::firstOrCreate([
                    'user_id' => $nobleAdmin->id,
                    'module' => $mod
                ]);
            }
            echo "All system modules added to Noble.\n";
        }
    } else {
        // Fallback for no plan
        $allModules = array_keys((new \App\Classes\Module())->allEnabled());
        foreach ($allModules as $mod) {
            \App\Models\UserActiveModule::firstOrCreate([
                'user_id' => $nobleAdmin->id,
                'module' => $mod
            ]);
        }
        echo "All system modules added to Noble without specific plan.\n";
    }
} else {
    echo "Noble account not found.\n";
}
