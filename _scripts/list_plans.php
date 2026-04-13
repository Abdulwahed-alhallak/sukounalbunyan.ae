<?php
$plans = App\Models\Plan::get(['id', 'name', 'price', 'duration']);
foreach($plans as $p) {
    echo "Plan ID: " . $p->id . " | Name: " . $p->name . " | Price: " . $p->price . " | Duration: " . $p->duration . "\n";
}
