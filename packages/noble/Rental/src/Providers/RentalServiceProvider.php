<?php

namespace Noble\Rental\Providers;

use Illuminate\Support\ServiceProvider;

class RentalServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $routesPath = __DIR__.'/../Routes/web.php';
        if (file_exists($routesPath)) {
            $this->loadRoutesFrom($routesPath);
        }

        $viewsPath = __DIR__.'/../Resources/views';
        if (is_dir($viewsPath)) {
            $this->loadViewsFrom($viewsPath, 'rental');
        }
        
        $migrationsPath = __DIR__.'/../Database/Migrations';
        if (is_dir($migrationsPath)) {
            $this->loadMigrationsFrom($migrationsPath);
        }

        if ($this->app->runningInConsole()) {
            $this->commands([
                \Noble\Rental\Console\Commands\ProcessRentalBilling::class,
            ]);
        }

        // Define permissions
        \Illuminate\Support\Facades\Gate::define('manage-rentals', function ($user) {
            return $user->type === 'superadmin' || 
                   (isset($user->permissions) && in_array('manage-rentals', (array)$user->permissions));
        });
    }

    public function register(): void
    {
        //
    }
}
