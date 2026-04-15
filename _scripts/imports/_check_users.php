<?php
require __DIR__.'/../../vendor/autoload.php';
$app = require_once __DIR__.'/../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = App\Models\User::select('id','type','email','name')->get();
foreach($users as $u) {
    echo $u->id . ' | ' . $u->type . ' | ' . $u->email . ' | ' . $u->name . PHP_EOL;
}
echo "Total users: " . $users->count() . PHP_EOL;

// Check for roles  
$roles = Spatie\Permission\Models\Role::all();
foreach($roles as $r) {
    echo "Role: " . $r->name . " (created_by: " . $r->created_by . ")" . PHP_EOL;
}
