<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
\App\Models\User::where('email', 'superadmin@example.com')->update(['email' => 'superadmin@dion.sy']);
echo "Updated!";
