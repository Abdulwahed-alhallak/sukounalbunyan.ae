<?php
namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait CrmDashboardTrait
{
    private function getCrmKPIs(): ?array
    {
        if (!$this->moduleActive('Lead')) return null;
        if (!class_exists(\Noble\Lead\Models\Lead::class)) return null;

        $currentMonth = now()->startOfMonth();
        $totalLeads = \Noble\Lead\Models\Lead::where('created_by', $this->companyId)->count();
        $newLeadsThisMonth = \Noble\Lead\Models\Lead::where('created_by', $this->companyId)
            ->where('created_at', '>=', $currentMonth)->count();
        $convertedLeads = \Noble\Lead\Models\Lead::where('created_by', $this->companyId)
            ->where('is_converted', true)->count();
        $activeLeads = \Noble\Lead\Models\Lead::where('created_by', $this->companyId)
            ->where('is_active', true)->count();

        $totalDeals = 0; $dealsValue = 0;
        if (class_exists(\Noble\Lead\Models\Deal::class) && Schema::hasTable('deals')) {
            $totalDeals = \Noble\Lead\Models\Deal::where('created_by', $this->companyId)->count();
            $dealsValue = \Noble\Lead\Models\Deal::where('created_by', $this->companyId)->sum('price');
        }

        $pipelineData = [];
        if (class_exists(\Noble\Lead\Models\LeadStage::class) && Schema::hasTable('lead_stages')) {
            $pipelineData = \Noble\Lead\Models\Lead::where('leads.created_by', $this->companyId)
                ->join('lead_stages', 'leads.stage_id', '=', 'lead_stages.id')
                ->select('lead_stages.name', DB::raw('COUNT(leads.id) as count'))
                ->groupBy('lead_stages.name')->get()->toArray();
        }

        return [
            'total_leads' => $totalLeads,
            'new_leads_this_month' => $newLeadsThisMonth,
            'converted_leads' => $convertedLeads,
            'active_leads' => $activeLeads,
            'conversion_rate' => $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0,
            'total_deals' => $totalDeals,
            'deals_value' => (float) $dealsValue,
            'pipeline' => $pipelineData,
        ];
    }
}
