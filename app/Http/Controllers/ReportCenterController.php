<?php

namespace App\Http\Controllers;

use App\Services\ReportingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportCenterController extends Controller
{
    /**
     * Report Center — main dashboard showing all available reports
     */
    public function index()
    {
        $user = Auth::user();
        /** @var \App\Services\ReportingService $reportingService */
        $reportingService = new \App\Services\ReportingService($user->id, $user->type);
        $availableReports = $reportingService->getAvailableReports();

        return Inertia::render('reports/Index', [
            'reports' => $availableReports,
        ]);
    }

    /**
     * Generate specific report
     */
    public function generate(Request $request, string $reportType)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'filters' => 'nullable|array',
        ]);

        $user = Auth::user();
        /** @var \App\Services\ReportingService $reportingService */
        $reportingService = new \App\Services\ReportingService($user->id, $user->type);

        $dateFrom = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo = $request->date_to ?? now()->toDateString();
        $filters = $request->filters ?? [];

        $data = $reportingService->generate($reportType, $dateFrom, $dateTo, $filters);

        if ($request->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('reports/View', [
            'report' => $data,
            'reportType' => $reportType,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'filters' => $filters,
        ]);
    }

    /**
     * Export report as CSV
     */
    public function exportCsv(Request $request, string $reportType)
    {
        $user = Auth::user();
        /** @var \App\Services\ReportingService $reportingService */
        $reportingService = new \App\Services\ReportingService($user->id, $user->type);

        $dateFrom = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo = $request->date_to ?? now()->toDateString();
        $filters = $request->filters ?? [];

        $data = $reportingService->generate($reportType, $dateFrom, $dateTo, $filters);

        // Build CSV
        $csv = '';
        if (!empty($data['columns'])) {
            $csv .= implode(',', array_map(fn($c) => '"' . str_replace('"', '""', $c['label']) . '"', $data['columns'])) . "\n";
        }

        foreach ($data['rows'] ?? [] as $row) {
            $line = [];
            foreach ($data['columns'] ?? [] as $col) {
                $val = $row[$col['key']] ?? '';
                $line[] = '"' . str_replace('"', '""', (string) $val) . '"';
            }
            $csv .= implode(',', $line) . "\n";
        }

        $filename = $reportType . '_' . $dateFrom . '_to_' . $dateTo . '.csv';

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
