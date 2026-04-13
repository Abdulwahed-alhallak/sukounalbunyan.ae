<?php
$user = App\Models\User::where('email', 'admin@noble.dion.sy')->first();
if ($user) {
    echo "Found user with NOBEL: " . $user->name . " | type: " . $user->type . "\n";
    $creator = $user->createdBy;
    if ($creator) {
        echo "Found creator: " . $creator->name . " | email: " . $creator->email . "\n";
        $creator->plan_expire_date = null;
        $creator->active_plan = 1;
        $creator->save();
        echo "Updated creator plan.\n";
    } else {
        echo "No creator found.\n";
        $user->plan_expire_date = null;
        $user->active_plan = 1;
        $user->save();
        echo "Updated user plan.\n";
    }
} else {
    echo "User admin@noble.dion.sy not found.\n";
}
