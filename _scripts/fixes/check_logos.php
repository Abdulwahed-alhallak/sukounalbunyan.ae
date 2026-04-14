<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Setting;

$logos = Setting::whereIn('key', ['logo_dark', 'logo_light', 'favicon'])->get();
foreach ($logos as $logo) {
    echo $logo->key . ": " . $logo->value . "\n";
}
