<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\Order;
use App\Models\SalesInvoice;
use App\Models\PurchaseInvoice;
use App\Models\UserNotification;
use App\Services\DashboardAggregationService;
use App\Services\SubscriptionService;
use App\Services\ReportingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * BusinessApiController
 *
 * RESTful API for DionONE modules — provides read/write access
 * to core business data, secured via Sanctum.
 */
class BusinessApiController extends Controller
{
    // ═════════════════════════════════════
    // DASHBOARD
    // ═════════════════════════════════════

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;
        $service = new DashboardAggregationService($companyId);

        return response()->json([
            'dashboard' => $service->companyDashboard(),
            'subscription' => SubscriptionService::getStatus($companyId),
        ]);
    }

    // ═════════════════════════════════════
    // SALES INVOICES
    // ═════════════════════════════════════

    public function salesInvoices(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        $invoices = SalesInvoice::where('created_by', $companyId)
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->from, fn($q, $d) => $q->where('invoice_date', '>=', $d))
            ->when($request->to, fn($q, $d) => $q->where('invoice_date', '<=', $d))
            ->orderByDesc('invoice_date')
            ->paginate($request->per_page ?? 15);

        return response()->json($invoices);
    }

    public function salesInvoice(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        $invoice = SalesInvoice::where('created_by', $companyId)->findOrFail($id);
        return response()->json($invoice);
    }

    // ═════════════════════════════════════
    // PURCHASE INVOICES
    // ═════════════════════════════════════

    public function purchaseInvoices(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        $invoices = PurchaseInvoice::where('created_by', $companyId)
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->orderByDesc('invoice_date')
            ->paginate($request->per_page ?? 15);

        return response()->json($invoices);
    }

    // ═════════════════════════════════════
    // EMPLOYEES (HRM)
    // ═════════════════════════════════════

    public function employees(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        if (!class_exists(\DionONE\Hrm\Models\Employee::class)) {
            return response()->json(['message' => 'HRM module not active'], 404);
        }

        $employees = \DionONE\Hrm\Models\Employee::where('created_by', $companyId)
            ->when($request->department, fn($q, $d) => $q->where('department_id', $d))
            ->orderBy('name')
            ->paginate($request->per_page ?? 15);

        return response()->json($employees);
    }

    // ═════════════════════════════════════
    // LEADS (CRM)
    // ═════════════════════════════════════

    public function leads(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        if (!class_exists(\DionONE\Lead\Models\Lead::class)) {
            return response()->json(['message' => 'CRM module not active'], 404);
        }

        $leads = \DionONE\Lead\Models\Lead::where('created_by', $companyId)
            ->when($request->stage, fn($q, $s) => $q->where('stage_id', $s))
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($leads);
    }

    // ═════════════════════════════════════
    // PROJECTS (Taskly)
    // ═════════════════════════════════════

    public function projects(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        if (!class_exists(\DionONE\Taskly\Models\Project::class)) {
            return response()->json(['message' => 'Taskly module not active'], 404);
        }

        $projects = \DionONE\Taskly\Models\Project::where('created_by', $companyId)
            ->withCount(['tasks'])
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 15);

        return response()->json($projects);
    }

    // ═════════════════════════════════════
    // NOTIFICATIONS
    // ═════════════════════════════════════

    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = UserNotification::where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderByDesc('created_at')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => UserNotification::where('user_id', $user->id)->where('is_read', false)->count(),
        ]);
    }

    public function markNotificationRead(Request $request, int $id): JsonResponse
    {
        $notification = UserNotification::where('user_id', $request->user()->id)->findOrFail($id);
        $notification->markAsRead();
        return response()->json(['success' => true]);
    }

    // ═════════════════════════════════════
    // REPORTS
    // ═════════════════════════════════════

    public function report(Request $request, string $type): JsonResponse
    {
        $user = $request->user();
        $reportService = new ReportingService($user->id, $user->type);

        $dateFrom = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo = $request->date_to ?? now()->toDateString();

        $data = $reportService->generate($type, $dateFrom, $dateTo, $request->filters ?? []);
        return response()->json($data);
    }

    // ═════════════════════════════════════
    // SUBSCRIPTION
    // ═════════════════════════════════════

    public function subscription(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        return response()->json([
            'status' => SubscriptionService::getStatus($companyId),
            'recommendations' => SubscriptionService::getUpgradeRecommendations($companyId),
        ]);
    }

    // ═════════════════════════════════════
    // PLANS (Public)
    // ═════════════════════════════════════

    public static function availablePlans(): JsonResponse
    {
        $plans = Plan::active()->get(['id', 'name', 'description', 'number_of_users', 'package_price_monthly', 'package_price_yearly', 'storage_limit', 'modules', 'trial', 'trial_days']);
        return response()->json($plans);
    }
}
