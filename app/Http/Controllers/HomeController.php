<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserNotification;
use App\Services\DashboardAggregationService;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

/** @psalm-suppress UndefinedClass */
use Noble\Hrm\Models\PaySlip;

class HomeController extends Controller
{
    public function Dashboard(Request $request)
    {
        if (Auth::user()->type === 'superadmin') {
            return $this->superAdminDashboard();
        }

        return $this->regularDashboard();
    }

    private function superAdminDashboard()
    {
        $data = DashboardAggregationService::superAdmin();

        return Inertia::render('SuperAdminDashboard', $data);
    }

    private function regularDashboard()
    {
        $user = Auth::user();

        if ($user->type === 'company') {
            return $this->companyDashboard($user);
        } elseif ($user->type === 'staff') {
            return $this->staffDashboard($user);
        } elseif ($user->type === 'client') {
            return redirect()->route('portal.dashboard');
        } elseif ($user->type === 'vendor') {
            return redirect()->route('portal.dashboard');
        }

        return Inertia::render('dashboard');
    }

    /**
     * Company owner dashboard — full KPIs across all modules
     */
    private function companyDashboard(User $user)
    {
        $service = new DashboardAggregationService($user->id);
        $dashboardData = $service->companyDashboard();

        // Add subscription status
        $dashboardData['subscription'] = SubscriptionService::getStatus($user->id);
        $dashboardData['upgradeRecommendations'] = SubscriptionService::getUpgradeRecommendations($user->id);

        return Inertia::render('CompanyDashboard', $dashboardData);
    }

    /**
     * Staff/Employee dashboard — personal KPIs
     */
    private function staffDashboard(User $user)
    {
        $companyId = $user->created_by;

        $personalData = [
            'user' => [
                'name' => $user->name,
                'type' => $user->type,
            ],
        ];

        // Personal tasks (Taskly)
        if (function_exists('Module_is_active') && Module_is_active('Taskly', $companyId)) {
            if (class_exists(\Noble\Taskly\Models\ProjectTask::class)) {
                $userTasks = \Noble\Taskly\Models\ProjectTask::whereHas('project', function ($q) use ($companyId) {
                    $q->where('created_by', $companyId);
                })->where(function ($q) use ($user) {
                    $q->where('assign_to', $user->id);
                })->get();

                $personalData['tasks'] = [
                    'total' => $userTasks->count(),
                    'completed' => 0, // is_complete and end_date columns don't exist
                    'overdue' => 0,
                    'in_progress' => 0,
                ];
            }
        }

        // Personal attendance (Hrm)
        if (function_exists('Module_is_active') && Module_is_active('Hrm', $companyId)) {
            if (class_exists(\Noble\Hrm\Models\Employee::class)) {
                $employee = \Noble\Hrm\Models\Employee::where('user_id', $user->id)->first();
                if ($employee) {
                    $personalData['employee'] = [
                        'id' => $employee->id,
                        'department' => $employee->department?->name,
                        'designation' => $employee->designation?->name,
                    ];

                    if (class_exists(\Noble\Hrm\Models\Attendance::class)) {
                        $todayAttendance = \Noble\Hrm\Models\Attendance::where('employee_id', $employee->id)
                            ->where('date', today()->toDateString())
                            ->first();

                        $monthlyAttendance = \Noble\Hrm\Models\Attendance::where('employee_id', $employee->id)
                            ->whereYear('date', now()->year)
                            ->whereMonth('date', now()->month)
                            ->get();

                        $personalData['attendance'] = [
                            'clocked_in' => $todayAttendance?->clock_in ?? null,
                            'clocked_out' => $todayAttendance?->clock_out ?? null,
                            'status' => $todayAttendance?->status ?? 'not_marked',
                            'monthly_present' => $monthlyAttendance->where('status', 'Present')->count(),
                            'monthly_absent' => $monthlyAttendance->where('status', 'Absent')->count(),
                            'monthly_late' => $monthlyAttendance->where('late', '!=', '00:00:00')->count(),
                        ];
                    }

                    // Pending leaves
                    if (class_exists(\Noble\Hrm\Models\LeaveApplication::class)) {
                        $personalData['leaves'] = [
                            'pending' => \Noble\Hrm\Models\LeaveApplication::where('employee_id', $employee->id)
                                ->where('status', 'Pending')->count(),
                            'approved_this_month' => \Noble\Hrm\Models\LeaveApplication::where('employee_id', $employee->id)
                                ->where('status', 'Approved')
                                ->whereMonth('created_at', now()->month)
                                ->count(),
                        ];
                    }
                }
            }
        }

        // Personal helpdesk tickets
        $personalData['tickets'] = [
            'open' => \App\Models\HelpdeskTicket::where('created_by', $user->id)
                ->where('status', 'open')->count(),
            'total' => \App\Models\HelpdeskTicket::where('created_by', $user->id)->count(),
        ];

        // Recent notifications (activity feed)
        $personalData['recentActivity'] = UserNotification::where('user_id', $user->id)
            ->where('is_archived', false)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'module', 'title', 'message', 'category', 'is_read', 'created_at'])
            ->map(fn($n) => [
                'id' => $n->id,
                'module' => $n->module,
                'title' => $n->title,
                'message' => $n->message,
                'category' => $n->category,
                'is_read' => $n->is_read,
                'time' => $n->created_at->diffForHumans(),
            ])->toArray();

        // Upcoming deadlines (next 7 days tasks)
        if (isset($personalData['tasks'])) {
            try {
                $personalData['upcomingDeadlines'] = []; // No end_date or is_complete available in project_tasks schema
            } catch (\Exception $e) {
                $personalData['upcomingDeadlines'] = [];
            }
        }

        // Salary info (last payslip)
        if (isset($personalData['employee'])) {
            try {
                $paySlipClass = 'Noble\Hrm\Models\PaySlip';
                if (class_exists($paySlipClass)) {
                    /** @var mixed $lastPayslip */
                    $lastPayslip = $paySlipClass::where('employee_id', $personalData['employee']['id'])
                        ->where('status', 'Paid')
                        ->orderByDesc('created_at')
                        ->first();
                    if ($lastPayslip) {
                        $personalData['lastPayslip'] = [
                            'net_salary' => (float) $lastPayslip->net_payble,
                            'basic_salary' => (float) $lastPayslip->basic_salary,
                            'month' => $lastPayslip->salary_month ?? null,
                        ];
                    }
                }
            } catch (\Exception $e) {
                // PaySlip model may not exist
            }
        }

        // Quick links
        $personalData['quickLinks'] = $this->getStaffQuickLinks($companyId);

        return Inertia::render('StaffDashboard', $personalData);
    }

    /**
     * Get available quick action links for staff based on active modules
     */
    private function getStaffQuickLinks(int $companyId): array
    {
        $links = [];

        $links[] = ['label' => 'Report Center', 'url' => '/reports', 'icon' => 'BarChart3', 'color' => 'violet'];
        $links[] = ['label' => 'Notifications', 'url' => '/notifications', 'icon' => 'Bell', 'color' => 'blue'];

        if (function_exists('Module_is_active')) {
            if (Module_is_active('Hrm', $companyId)) {
                $links[] = ['label' => 'My Attendance', 'url' => '/hrm/attendance', 'icon' => 'CalendarCheck', 'color' => 'emerald'];
                $links[] = ['label' => 'Apply Leave', 'url' => '/hrm/leave-applications', 'icon' => 'CalendarOff', 'color' => 'amber'];
            }
            if (Module_is_active('Taskly', $companyId)) {
                $links[] = ['label' => 'My Projects', 'url' => '/project', 'icon' => 'Briefcase', 'color' => 'indigo'];
            }
            if (Module_is_active('Lead', $companyId)) {
                $links[] = ['label' => 'CRM Leads', 'url' => '/crm/leads', 'icon' => 'Target', 'color' => 'purple'];
            }
        }

        $links[] = ['label' => 'Helpdesk', 'url' => '/helpdesk-tickets', 'icon' => 'Headphones', 'color' => 'cyan'];

        return $links;
    }

    /**
     * Clear dashboard cache (useful for admin)
     */
    public function clearDashboardCache()
    {
        $user = Auth::user();

        if ($user->type === 'superadmin') {
            Cache::forget('dashboard_superadmin');
        } else {
            $companyId = $user->type === 'company' ? $user->id : $user->created_by;
            Cache::forget("dashboard_company_{$companyId}");
        }

        return back()->with('success', 'Dashboard cache cleared.');
    }
}
