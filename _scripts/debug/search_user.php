<?php
$users = App\Models\User::where('email', 'LIKE', '%dion.sy%')->orWhere('email', 'LIKE', '%noble%')->get(['id', 'name', 'email', 'type', 'created_by', 'plan_expire_date', 'active_plan']);
foreach($users as $u) {
    echo $u->id . " | " . $u->name . " | " . $u->email . " | " . $u->type . " | pb: " . $u->created_by . " | plan: " . $u->active_plan . " (" . $u->plan_expire_date . ")\n";
}
