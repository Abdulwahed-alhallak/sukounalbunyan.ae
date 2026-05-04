<?php

/**
 * Sukoun Albunyan — Root Entry Point
 * Redirects all requests to public/index.php (Laravel entry point)
 * Required for Hostinger shared hosting where document root = public_html/
 */

// Set the public path for the application
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/public/index.php';

// Forward to Laravel's public entry point
require __DIR__ . '/public/index.php';
