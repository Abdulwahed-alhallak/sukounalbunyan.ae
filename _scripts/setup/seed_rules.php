<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\GamificationRule;

GamificationRule::updateOrCreate(
    ['event_name' => 'daily_login'], 
    ['title' => 'Daily Login', 'description' => 'Login to the platform', 'points_reward' => 5, 'is_active' => true]
);

GamificationRule::updateOrCreate(
    ['event_name' => 'invoice_generated'], 
    ['title' => 'Invoice Issued', 'description' => 'Successfully generated an invoice', 'points_reward' => 20, 'is_active' => true]
);

echo "Rules seeded perfectly.\n";
