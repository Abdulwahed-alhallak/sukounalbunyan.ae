<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = [
    'admin@noblearchitecture.net',
    'superadmin@noblearchitecture.net',
    'samad34557788@noblearchitecture.net'
];

foreach ($users as $email) {
    $user = \App\Models\User::where('email', $email)->first();
    if ($user) {
        $user->password = \Illuminate\Support\Facades\Hash::make('1234');
        $user->save();
        echo "Reset password to 1234 for $email\n";
    }
}
echo "Done!\n";
