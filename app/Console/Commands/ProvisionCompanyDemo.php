<?php

namespace App\Console\Commands;

use App\Services\CompanyProvisioningService;
use Illuminate\Console\Command;

class ProvisionCompanyDemo extends Command
{
    protected $signature = 'noble:provision-company-demo {--company= : Company user ID to provision}';

    protected $description = 'Provision the current company with operational roles, real demo data, and an employee CSV export';

    public function handle(CompanyProvisioningService $service): int
    {
        try {
            $result = $service->provision($this->option('company') ? (int) $this->option('company') : null);

            $this->info('Company demo provisioning completed successfully.');
            $this->line('Company: ' . $result['company']->email);
            $this->line('CSV: ' . $result['csv_path']);
            $this->line('Staff users: ' . $result['audit']['users']['staff']);
            $this->line('Client users: ' . $result['audit']['users']['clients']);
            $this->line('Vendor users: ' . $result['audit']['users']['vendors']);
            $this->line('Employees: ' . $result['audit']['hrm']['employees']);
            $this->line('Active modules: ' . $result['audit']['modules']['active']);

            return self::SUCCESS;
        } catch (\Throwable $throwable) {
            $this->error($throwable->getMessage());
            return self::FAILURE;
        }
    }
}
