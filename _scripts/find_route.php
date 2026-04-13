<?php
$routes = \Illuminate\Support\Facades\Route::getRoutes()->getRoutesByMethod()['GET'];
foreach ($routes as $route) {
    if ($route->uri() === '/') {
        echo "Root route uses: " . json_encode($route->action) . "\n";
    }
}
