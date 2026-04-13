<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$sourceDark = 'C:/Users/DION-SERVER/.gemini/antigravity/brain/237cc66f-f102-4990-b6ae-bf8404857d20/media__1775444394479.png'; // White logo
$sourceLight = 'C:/Users/DION-SERVER/.gemini/antigravity/brain/237cc66f-f102-4990-b6ae-bf8404857d20/media__1775444404272.png'; // Black logo

$targetFolder = storage_path('app/public/uploads/logo');
if (!file_exists($targetFolder)) {
    mkdir($targetFolder, 0755, true);
}

copy($sourceDark, $targetFolder . '/logo-dark-dion.png');
copy($sourceLight, $targetFolder . '/logo-light-dion.png');

$admin = \App\Models\User::where('email', 'superadmin@dion.sy')->first();
$adminId = $admin ? $admin->id : 1;

// update or insert for logo_dark (White logo for Dark theme)
$settingDark = \App\Models\Setting::where('key', 'logo_dark')->where('created_by', $adminId)->first();
if ($settingDark) {
    $settingDark->update(['value' => 'uploads/logo/logo-dark-dion.png']);
} else {
    \App\Models\Setting::create(['key' => 'logo_dark', 'value' => 'uploads/logo/logo-dark-dion.png', 'created_by' => $adminId]);
}

// update or insert for logo_light (Black logo for Light theme)
$settingLight = \App\Models\Setting::where('key', 'logo_light')->where('created_by', $adminId)->first();
if ($settingLight) {
    $settingLight->update(['value' => 'uploads/logo/logo-light-dion.png']);
} else {
    \App\Models\Setting::create(['key' => 'logo_light', 'value' => 'uploads/logo/logo-light-dion.png', 'created_by' => $adminId]);
}

echo "Logo settings updated!\n";
