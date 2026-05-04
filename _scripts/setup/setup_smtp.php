<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

function setupSMTP($user) {
    if (!$user) return;
    
    // Setup standard Hostinger SMTP parameters
    setSetting('email_driver', 'smtp', $user->id, false);
    setSetting('email_host', 'smtp.hostinger.com', $user->id, false);
    setSetting('email_port', '465', $user->id, false);
    setSetting('email_username', 'admin@noblearchitecture.net', $user->id, false);
    setSetting('email_encryption', 'ssl', $user->id, false);
    setSetting('email_fromAddress', 'admin@noblearchitecture.net', $user->id, false);
    setSetting('email_fromName', 'Sukoun Albunyan ERP', $user->id, false);
    
    echo "✅ SMTP Default Settings applied for: " . $user->email . "\n";
}

// Apply to Superadmin
$superadmin = \App\Models\User::where('type', 'superadmin')->first();
if ($superadmin) {
    if (strpos($superadmin->email, 'dion') !== false) {
        $superadmin->email = 'superadmin@noblearchitecture.net';
        $superadmin->save();
        echo "🛡️ Superadmin converted to: superadmin@noblearchitecture.net\n";
    }
    setupSMTP($superadmin);
}

// Apply to Company
$company = \App\Models\User::where('email', 'admin@noblearchitecture.net')->first();
setupSMTP($company);

\Illuminate\Support\Facades\Artisan::call('cache:clear');
echo "🚀 Email Configuration initialized. Remember to enter the password in the Dashboard!\n";
