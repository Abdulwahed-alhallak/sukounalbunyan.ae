<?php
namespace App;
use App\Models\User;

$superadmins = User::where('type', 'superadmin')->get();
foreach ($superadmins as $u) {
    setSetting('enableEmailVerification', 'off', $u->id);
}
echo "SETTINGS_UPDATED\n";
