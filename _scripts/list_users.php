<?php
$users = App\Models\User::limit(10)->get(['id', 'name', 'email', 'type', 'created_by']);
foreach($users as $u) {
    echo $u->id . " | " . $u->name . " | " . $u->email . " | " . $u->type . " | pb: " . $u->created_by . "\n";
}
