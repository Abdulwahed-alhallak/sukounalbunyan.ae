<?php
$user = App\Models\User::where('email', 'admin@noble.dion.sy')->first();
if ($user) {
    echo "Found user: " . $user->name . " | type: " . $user->type . "\n";
    
    $creator = $user->createdBy;
    if ($creator) {
        echo "Found creator: " . $creator->name . " | email: " . $creator->email . "\n";
        echo "Creator plan date: " . $creator->plan_expire_date . " | Active plan: " . $creator->active_plan . "\n";
        $creator->plan_expire_date = null;
        $creator->active_plan = 1; // Assuming 1 is a valid plan id or active flag. In some systems it's the plan ID.
        $creator->save();
        echo "Updated creator plan successfully.\n";
    } else {
        echo "No creator found.\n";
        echo "User plan date: " . $user->plan_expire_date . " | Active plan: " . $user->active_plan . "\n";
        $user->plan_expire_date = null;
        $user->active_plan = 1;
        $user->save();
        echo "Updated user plan successfully.\n";
    }
} else {
    echo "User not found.\n";
}
