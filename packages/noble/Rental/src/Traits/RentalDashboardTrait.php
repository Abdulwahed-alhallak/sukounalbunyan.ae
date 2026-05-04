<?php

namespace Noble\Rental\Traits;

use Noble\Rental\Models\RentalContract;
use Noble\Rental\Services\RentalBillingService;

trait RentalDashboardTrait
{
    protected function getRentalKPIs(): ?array
    {
        // Manual check for module presence since we are now inside the module or called by the app hub
        if (!class_exists(RentalContract::class)) {
            return null;
        }

        $billingService = new RentalBillingService();

        $activeContracts = RentalContract::where('created_by', $this->companyId)
            ->where('status', 'active')
            ->get();

        $totalAccrued = $activeContracts->sum(function ($contract) use ($billingService) {
            return $billingService->calculateAccruedRent($contract);
        });

        $totalDeposits = RentalContract::where('created_by', $this->companyId)
            ->where('deposit_status', 'held')
            ->sum('security_deposit');

        $totalBalanceDue = RentalContract::where('created_by', $this->companyId)
            ->get()
            ->sum('balance_due');

        $totalDamageFees = RentalContract::where('created_by', $this->companyId)->sum('total_damage_fees');
        $expiringSoon = RentalContract::where('created_by', $this->companyId)
            ->where('status', 'active')
            ->where('end_date', '<=', now()->addDays(7))
            ->count();

        $pendingLogistics = RentalContract::where('created_by', $this->companyId)
            ->whereIn('logistics_status', ['pending_delivery', 'pending_pickup'])
            ->count();

        $pendingInstallments = 0;
        if (class_exists(\Noble\Rental\Models\RentalInstallment::class)) {
            $pendingInstallments = \Noble\Rental\Models\RentalInstallment::whereHas('contract', function ($q) {
                $q->where('created_by', $this->companyId);
            })
            ->where('status', 'pending')
            ->where('due_date', '<=', now()->addDays(7))
            ->count();
        }

        return [
            'active_contracts'     => $activeContracts->count(),
            'total_accrued'        => $totalAccrued,
            'total_deposits'       => $totalDeposits,
            'total_balance_due'    => $totalBalanceDue,
            'total_damage_fees'    => $totalDamageFees,
            'expiring_soon'        => $expiringSoon,
            'pending_logistics'    => $pendingLogistics,
            'pending_installments' => $pendingInstallments,
        ];
    }
}
