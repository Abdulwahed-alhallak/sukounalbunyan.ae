<?php

namespace Noble\LandingPage\Providers;

use Illuminate\Support\ServiceProvider;

class LandingPageServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        \Illuminate\Support\Facades\Log::info('LandingPageServiceProvider Booting...');
        $routesPath = __DIR__.'/../Routes/web.php';
        if (file_exists($routesPath)) {
            \Illuminate\Support\Facades\Log::info('Routes file found: ' . $routesPath);
            $this->loadRoutesFrom($routesPath);
        } else {
            \Illuminate\Support\Facades\Log::error('Routes file NOT found: ' . $routesPath);
        }
        
        $migrationsPath = __DIR__.'/../Database/Migrations';
        if (is_dir($migrationsPath)) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }
}