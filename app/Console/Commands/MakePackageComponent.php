<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

/**
 * @module MakePackageComponent
 * @description Command for creating package components (controllers, models, etc.)
 * @author DION System
 * @lastModified 2026-04-18
 * @status stable
 * @dependencies Illuminate\Console\Command, File, Artisan, ComponentCreators trait
 */
class MakePackageComponent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:package {type} {name} {package} {--m}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new component in the specified package';

    /**
     * Execute the console command.
     */
    public string $packageName;

    public function handle(): void
    {
        $type = $this->argument('type');
        $name = $this->argument('name');
        $package = $this->argument('package');
        $createMigration = $this->option('m');

        $this->packageName = $this->camelToKebab($package);

        $baseDir = base_path("packages/noble/$package/src");
        $namespace = "Noble\\$package\\";

        // EXCEPTION: Complex switch statement for multiple component types
        switch ($type) {
            case 'controller':
                $this->createController($name, $baseDir, $namespace);
                break;
            case 'model':
                $this->createModel($name, $baseDir, $namespace, $createMigration, $package);
                break;
            case 'migration':
                $this->createMigration($name, $package);
                break;
            case 'middleware':
                $this->createMiddleware($name, $baseDir, $namespace);
                break;
            case 'event':
                $this->createEvent($name, $baseDir, $namespace);
                break;
            case 'listener':
                $this->createListener($name, $baseDir, $namespace);
                break;
            case 'provider':
                $this->createProvider($name, $baseDir, $namespace);
                break;
            case 'seeder':
                $this->createSeeder($name, $baseDir, $namespace);
                break;
            case 'request':
                $this->createRequest($name, $baseDir, $namespace);
                break;
            case 'trait':
                $this->createTrait($name, $baseDir, $namespace);
                break;
            case 'helper':
                $this->createHelper($name, $baseDir, $namespace);
                break;
            default:
                $this->error("Invalid type provided. Available types: controller, model, migration, middleware, event, listener, provider, seeder, request, trait, helper");
                break;
        }
    }

    /**
     * Convert camelCase to kebab-case
     */
    private function camelToKebab(string $name): string
    {
        return strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $name));
    }

    /**
     * Convert camelCase to snake_case
     */
    private function camelToSnake(string $name): string
    {
        return strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $name));
    }

    /**
     * Pluralize a word
     */
    private function pluralize(string $word): string
    {
        $plural = [
            '/(quiz)$/i' => '\1zes',
            '/^(ox)$/i' => '\1en',
            '/([m|l])ouse$/i' => '\1ice',
            '/(matr|vert|ind)ix|ex$/i' => '\1ices',
            '/(x|ch|ss|sh)$/i' => '\1es',
            '/([^aeiouy]|qu)y$/i' => '\1ies',
            '/(hive)$/i' => '\1s',
            '/(?:([^f])fe|([lr])f)$/i' => '\1\2ves',
            '/sis$/i' => 'ses',
            '/([ti])um$/i' => '\1a',
            '/(buffal|tomat)o$/i' => '\1oes',
            '/(bu)s$/i' => '\1ses',
            '/(alias|status)$/i' => '\1es',
            '/(octop|vir)us$/i' => '\1i',
            '/(ax|test)is$/i' => '\1es',
            '/s$/i' => 's',
            '/$/' => 's',
        ];

        foreach ($plural as $pattern => $replacement) {
            if (preg_match($pattern, $word)) {
                return preg_replace($pattern, $replacement, $word);
            }
        }
        return $word;
    }

    // Include component creation methods from separate trait
    use ComponentCreators;
}
