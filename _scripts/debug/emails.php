<?php
$emails = App\Models\User::pluck('email')->toArray();
$match = array_filter($emails, function($e) {
    return strpos($e, 'dion') !== false || strpos($e, 'admin') !== false || strpos($e, 'noble') !== false;
});
print_r($match);
