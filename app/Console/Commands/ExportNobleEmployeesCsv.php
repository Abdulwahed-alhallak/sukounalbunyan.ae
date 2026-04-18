<?php

namespace App\Console\Commands;

use App\Services\CompanyProvisioningService;
use Illuminate\Console\Command;

class ExportNobleEmployeesCsv extends Command
{
    protected $signature = 'noble:export-employees {--company= : Company user ID to export} {--path= : Relative path under storage/app/public}';

    protected $description = 'Export company employees from the database to a NOBLE CSV file';

    public function handle(CompanyProvisioningService $service): int
    {
        try {
            $company = $service->resolveCompany($this->option('company') ? (int) $this->option('company') : null);
            $path = $service->exportEmployeesCsv($company, $this->option('path'));

            $this->info('Employee CSV exported successfully.');
            $this->line($path);

            return self::SUCCESS;
        } catch (\Throwable $throwable) {
            $this->error($throwable->getMessage());
            return self::FAILURE;
        }
    }
}
