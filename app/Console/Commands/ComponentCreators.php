<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\File;

/**
 * @module ComponentCreators
 * @description Trait containing component creation methods for MakePackageComponent command
 * @author DION System
 * @lastModified 2026-04-18
 * @status stable
 * @dependencies Illuminate\Support\Facades\File
 */
trait ComponentCreators
{
    protected function createController(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Http/Controllers/{$name}.php";
        $namespace .= "Http\\Controllers";

        if (File::exists($path)) {
            $this->error("Controller already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/controller.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$CLASS_NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);
        $stub = str_replace('$PACKAGE_NAME$', $this->packageName, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Controller $name created successfully.");
    }

    protected function createModel(string $name, string $baseDir, string $namespace, bool $createMigration, string $package): void
    {
        $path = "$baseDir/Models/{$name}.php";
        $namespace .= "Models";

        if (File::exists($path)) {
            $this->error("Model already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/model.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);
        $this->info("Model $name Created Successfully!");

        if ($createMigration) {
            $this->createMigration("create_{$this->camelToSnake($this->pluralize($name))}_table", $package);
        }
    }

    protected function createMigration(string $name, string $package): void
    {
        $migrationPath = base_path("packages/noble/$package/src/Database/Migrations");
        $timestamp = date('Y_m_d_His');
        $fileName = "{$timestamp}_{$name}.php";
        $fullPath = "$migrationPath/$fileName";

        if (File::exists($fullPath)) {
            $this->error("Migration already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/migrations/migration.stub');
        if (!File::exists($stubPath)) {
            $this->error("Migration stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $tableName = str_replace(['create_', '_table'], '', $name);
        $stub = str_replace('$TABLE_NAME$', $tableName, $stub);

        File::ensureDirectoryExists($migrationPath);
        File::put($fullPath, $stub);

        $this->info("Migration $name created successfully.");
    }

    protected function createMiddleware(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Http/Middleware/{$name}.php";
        $namespace .= "Http\\Middleware";

        if (File::exists($path)) {
            $this->error("Middleware already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/middleware.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Middleware $name Created Successfully!");
    }

    protected function createEvent(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Events/{$name}.php";
        $namespace .= "Events";

        if (File::exists($path)) {
            $this->error("Event already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/event.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Event $name Created Successfully!");
    }

    protected function createListener(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Listeners/{$name}.php";
        $namespace .= "Listeners";

        if (File::exists($path)) {
            $this->error("Listener already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/listener.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Listener $name Created Successfully!");
    }

    protected function createProvider(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Providers/{$name}.php";
        $namespace .= "Providers";

        if (File::exists($path)) {
            $this->error("Provider already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/provider.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Provider $name Created Successfully!");
    }

    protected function createSeeder(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Database/Seeders/{$name}DatabaseSeeder.php";
        $namespace .= "Database\\Seeders";

        if (File::exists($path)) {
            $this->error("Seeder already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/seeder.stub');
        if (!File::exists($stubPath)) {
            $this->error("Stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Seeder $name Created Successfully!");
    }

    protected function createRequest(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Http/Requests/{$name}.php";
        $namespace .= "Http\\Requests";

        if (File::exists($path)) {
            $this->error("Request already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/request.stub');
        if (!File::exists($stubPath)) {
            $this->error("Request stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Request $name Created Successfully!");
    }

    protected function createTrait(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Traits/{$name}.php";
        $namespace .= "Traits";

        if (File::exists($path)) {
            $this->error("Trait already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/trait.stub');
        if (!File::exists($stubPath)) {
            $this->error("Trait stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Trait $name Created Successfully!");
    }

    protected function createHelper(string $name, string $baseDir, string $namespace): void
    {
        $path = "$baseDir/Helpers/{$name}.php";
        $namespace .= "Helpers";

        if (File::exists($path)) {
            $this->error("Helper already exists!");
            return;
        }

        $stubPath = base_path('stubs/react-package-stubs/helper.stub');
        if (!File::exists($stubPath)) {
            $this->error("Helper stub file does not exist!");
            return;
        }

        $stub = File::get($stubPath);
        $stub = str_replace('$NAMESPACE$', $namespace, $stub);
        $stub = str_replace('$CLASS$', $name, $stub);

        File::ensureDirectoryExists(dirname($path));
        File::put($path, $stub);

        $this->info("Helper $name Created Successfully!");
    }
}
