<?php

$user = \App\Models\User::where('email', 'admin@noblearchitecture.net')->first();
$count = \App\Models\UserActiveModule::where('user_id', $user->id)->count();

echo "Local Module Count: " . $count . "\n";
