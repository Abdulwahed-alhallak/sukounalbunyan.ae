<?php
namespace App\Traits;

trait CrmReportingTrait
{
    private function leadFunnelReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Lead\Models\Lead::class)) return $this->emptyReport('Lead Funnel');

        $data = \Noble\Lead\Models\Lead::where('leads.created_by', $this->companyId)
            ->leftJoin('lead_stages', 'leads.stage_id', '=', 'lead_stages.id')
            ->selectRaw('lead_stages.name as stage, COUNT(leads.id) as count')
            ->groupBy('lead_stages.name')->get();

        $totalLeads = $data->sum('count');

        return [
            'title' => 'Lead Funnel Analysis',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'stage', 'label' => 'Stage', 'type' => 'text'],
                ['key' => 'count', 'label' => 'Leads', 'type' => 'number'],
                ['key' => 'percentage', 'label' => '% of Total', 'type' => 'percentage'],
            ],
            'rows' => $data->map(fn($d) => [
                'stage' => $d->stage ?? 'Unknown',
                'count' => $d->count,
                'percentage' => $totalLeads > 0 ? round(($d->count / $totalLeads) * 100, 1) : 0,
            ])->toArray(),
            'summary' => [
                ['label' => 'Total Leads', 'value' => $totalLeads, 'type' => 'number', 'highlight' => true],
            ],
            'chartData' => $data->map(fn($d) => ['name' => $d->stage ?? 'Unknown', 'value' => $d->count])->toArray(),
            'chartType' => 'bar',
        ];
    }

    private function dealPipelineReport(): array
    {
        if (!class_exists(\Noble\Lead\Models\Deal::class)) return $this->emptyReport('Deal Pipeline');

        $data = \Noble\Lead\Models\Deal::where('deals.created_by', $this->companyId)
            ->selectRaw('status, COUNT(*) as count, SUM(price) as total_value')
            ->groupBy('status')->get();

        return [
            'title' => 'Deal Pipeline Report',
            'columns' => [
                ['key' => 'status', 'label' => 'Status', 'type' => 'badge'],
                ['key' => 'count', 'label' => 'Deals', 'type' => 'number'],
                ['key' => 'total_value', 'label' => 'Total Value', 'type' => 'currency'],
            ],
            'rows' => $data->map(fn($d) => ['status' => $d->status, 'count' => $d->count, 'total_value' => (float) $d->total_value])->toArray(),
            'summary' => [
                ['label' => 'Total Deals', 'value' => $data->sum('count'), 'type' => 'number'],
                ['label' => 'Pipeline Value', 'value' => (float) $data->sum('total_value'), 'type' => 'currency', 'highlight' => true],
            ],
        ];
    }

    private function leadSourceReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Lead\Models\Lead::class)) return $this->emptyReport('Lead Source');

        $data = \Noble\Lead\Models\Lead::where('leads.created_by', $this->companyId)
            ->leftJoin('sources', 'leads.source_id', '=', 'sources.id')
            ->selectRaw('sources.name as source, COUNT(leads.id) as count')
            ->groupBy('sources.name')->get();

        return [
            'title' => 'Lead Source Analysis',
            'columns' => [
                ['key' => 'source', 'label' => 'Source', 'type' => 'text'],
                ['key' => 'count', 'label' => 'Leads', 'type' => 'number'],
            ],
            'rows' => $data->map(fn($d) => ['source' => $d->source ?? 'Unknown', 'count' => $d->count])->toArray(),
            'summary' => [
                ['label' => 'Total Sources', 'value' => $data->count(), 'type' => 'number'],
                ['label' => 'Total Leads', 'value' => $data->sum('count'), 'type' => 'number', 'highlight' => true],
            ],
            'chartData' => $data->map(fn($d) => ['name' => $d->source ?? 'Unknown', 'value' => $d->count])->toArray(),
            'chartType' => 'pie',
        ];
    }
}
