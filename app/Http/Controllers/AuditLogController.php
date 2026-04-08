<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\SecurityAuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    /**
     * Display list of audit logs
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = AuditLog::query()->with('user:id,name,email,type');

        // Company users see only their company's logs
        if ($user->type === 'company') {
            $query->forCompany($user->id);
        } elseif ($user->type !== 'superadmin') {
            abort(403);
        }

        // Filters
        if ($request->filled('event')) {
            $query->ofEvent($request->event);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('model_type')) {
            $query->forModel($request->model_type);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->dateRange($request->date_from, $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('auditable_label', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate(25)
            ->appends($request->query());

        // Get available model types for filter dropdown
        $modelTypes = AuditLog::query()
            ->when($user->type === 'company', fn($q) => $q->forCompany($user->id))
            ->distinct()
            ->pluck('auditable_type')
            ->filter()
            ->map(fn($type) => ['value' => $type, 'label' => class_basename($type)])
            ->values();

        // Available event types
        $eventTypes = AuditLog::query()
            ->when($user->type === 'company', fn($q) => $q->forCompany($user->id))
            ->distinct()
            ->pluck('event')
            ->filter()
            ->values();

        return Inertia::render('audit-logs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['event', 'user_id', 'model_type', 'date_from', 'date_to', 'search']),
            'modelTypes' => $modelTypes,
            'eventTypes' => $eventTypes,
        ]);
    }

    /**
     * Display security audit logs
     */
    public function security(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->type, ['superadmin', 'company'])) {
            abort(403);
        }

        $query = SecurityAuditLog::query()->with('user:id,name,email,type');

        // Filters
        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('suspicious_only')) {
            $query->suspicious();
        }

        if ($request->filled('user_id')) {
            $query->forUser($request->user_id);
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate(25)
            ->appends($request->query());

        $eventTypes = SecurityAuditLog::distinct()->pluck('event')->filter()->values();

        return Inertia::render('audit-logs/Security', [
            'logs' => $logs,
            'filters' => $request->only(['event', 'suspicious_only', 'user_id']),
            'eventTypes' => $eventTypes,
        ]);
    }

    /**
     * Show details of a specific audit log entry
     */
    public function show(AuditLog $auditLog)
    {
        $user = Auth::user();

        // Authorization
        if ($user->type === 'company' && $auditLog->company_id !== $user->id) {
            abort(403);
        } elseif (!in_array($user->type, ['superadmin', 'company'])) {
            abort(403);
        }

        $auditLog->load('user:id,name,email,type');

        return Inertia::render('audit-logs/Show', [
            'auditLog' => $auditLog,
        ]);
    }

    /**
     * Export audit logs as CSV
     */
    public function export(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->type, ['superadmin', 'company'])) {
            abort(403);
        }

        $query = AuditLog::query();

        if ($user->type === 'company') {
            $query->forCompany($user->id);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->dateRange($request->date_from, $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->limit(5000)->get();

        $csv = "Date,User,Event,Model,Label,IP Address,Changed Fields\n";
        foreach ($logs as $log) {
            $changedFields = $log->changed_fields ? implode('; ', $log->changed_fields) : '';
            $csv .= sprintf(
                '"%s","%s","%s","%s","%s","%s","%s"' . "\n",
                $log->created_at->format('Y-m-d H:i:s'),
                $log->user_name ?? 'System',
                $log->event,
                $log->auditable_type ? class_basename($log->auditable_type) : '',
                str_replace('"', '""', $log->auditable_label ?? ''),
                $log->ip_address ?? '',
                str_replace('"', '""', $changedFields)
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="audit_logs_' . now()->format('Y-m-d') . '.csv"');
    }
}
