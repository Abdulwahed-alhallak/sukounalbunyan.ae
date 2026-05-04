<?php

namespace Noble\Rental\Console\Commands;

use Illuminate\Console\Command;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Services\RentalBillingService;

class ProcessRentalBilling extends Command
{
    protected $signature = 'rental:process-billing
                            {--dry-run : Preview what would be invoiced without creating any records}
                            {--contract= : Process a specific contract by ID}';

    protected $description = 'Automate generation of rental invoices based on accrued rent and custody.';

    public function handle(RentalBillingService $billingService): int
    {
        $dryRun     = $this->option('dry-run');
        $contractId = $this->option('contract');

        if ($dryRun) {
            $this->warn('⚠  DRY RUN — no invoices will be created.');
        }

        $query = RentalContract::with(['customer', 'items.product', 'returns'])
            ->where('status', 'active');

        if ($contractId) {
            $query->where('id', $contractId);
        }

        $contracts = $query->get();

        if ($contracts->isEmpty()) {
            $this->info('No active contracts to process.');
            return 0;
        }

        $this->info("Found {$contracts->count()} active contract(s). Processing...");

        $rows      = [];
        $generated = 0;
        $skipped   = 0;

        foreach ($contracts as $contract) {
            $accrued     = $billingService->calculateAccruedRent($contract);
            $damageFees  = (float)$contract->total_damage_fees - (float)$contract->invoiced_damage_fees;
            $totalToInvoice = $accrued + $damageFees;

            if ($totalToInvoice <= 0) {
                $rows[] = [
                    $contract->contract_number,
                    $contract->customer->name ?? '—',
                    number_format($accrued, 2),
                    number_format($damageFees, 2),
                    'SKIP — nothing to invoice',
                ];
                $skipped++;
                continue;
            }

            if (!$dryRun) {
                try {
                    $invoice = $billingService->createInvoice($contract);
                    $rows[] = [
                        $contract->contract_number,
                        $contract->customer->name ?? '—',
                        number_format($accrued, 2),
                        number_format($damageFees, 2),
                        "✓ Invoice #{$invoice->invoice_number} — {$invoice->total_amount}",
                    ];
                    $generated++;
                } catch (\Throwable $e) {
                    $rows[] = [
                        $contract->contract_number,
                        $contract->customer->name ?? '—',
                        number_format($accrued, 2),
                        number_format($damageFees, 2),
                        '✗ ERROR: ' . $e->getMessage(),
                    ];
                }
            } else {
                $rows[] = [
                    $contract->contract_number,
                    $contract->customer->name ?? '—',
                    number_format($accrued, 2),
                    number_format($damageFees, 2),
                    "[DRY RUN] Would invoice: " . number_format($totalToInvoice, 2),
                ];
                $generated++;
            }
        }

        $this->table(
            ['Contract', 'Customer', 'Accrued Rent', 'Damage Fees', 'Result'],
            $rows
        );

        $label = $dryRun ? 'Would generate' : 'Generated';
        $this->info("{$label}: {$generated} invoice(s). Skipped: {$skipped}.");

        return 0;
    }
}
