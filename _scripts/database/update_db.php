<?php
$env = file_get_contents('.env');
$env = preg_replace('/DB_HOST=.*/', 'DB_HOST=193.203.166.17', $env);
$env = preg_replace('/DB_DATABASE=.*/', 'DB_DATABASE=u256167180_noble', $env);
$env = preg_replace('/DB_USERNAME=.*/', 'DB_USERNAME=u256167180_noble', $env);
$env = preg_replace('/DB_PASSWORD=.*/', 'DB_PASSWORD="m:&!u>Do!P3"', $env);
file_put_contents('.env', $env);
echo "Env updated.";

