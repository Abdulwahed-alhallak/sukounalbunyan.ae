<?php

namespace Noble\Hrm\Http\Controllers;

use App\Models\User;
use Noble\Hrm\Models\VacationSettlement;
use Noble\Hrm\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VacationSettlementController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-hrm')) {
            $settlements = VacationSettlement::with(['employee:id,name'])
                ->where('created_by', creatorId())
                ->when(request('search'), function ($q) {
                    $q->whereHas('employee', function ($query) {
                        $query->where('name', 'like', '%' . request('search') . '%');
                    });
                })
                ->when(request('status'), fn($q) => $q->where('status', request('status')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 15))
                ->withQueryString();

            $employees = User::where('created_by', creatorId())
                ->where('type', 'staff')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return Inertia::render('Hrm/VacationSettlement/Index', [
                'settlements' => $settlements,
                'employees' => $employees,
            ]);
        }
        return back()->with('error', __('Permission denied'));
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'employee_id' => 'required|exists:users,id',
                'vacation_start_date' => 'required|date',
                'vacation_days' => 'required|integer|min:1',
                'basic_salary' => 'required|numeric|min:0',
                'allowances_total' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $validated['created_by'] = creatorId();
            $validated['status'] = 'Open';
            $validated['allowances_total'] = $validated['allowances_total'] ?? 0;

            // Calculate total: (basic + allowances) / 30 * vacation_days
            $dailyRate = ($validated['basic_salary'] + $validated['allowances_total']) / 30;
            $validated['total_amount'] = round($dailyRate * $validated['vacation_days'], 2);

            VacationSettlement::create($validated);

            return redirect()->route('hrm.vacation-settlement.index')->with('success', __('Vacation settlement created successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function update(Request $request, VacationSettlement $vacationSettlement)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'status' => 'required|string|in:Open,Processing,Paid,Cancelled',
                'notes' => 'nullable|string',
            ]);

            $vacationSettlement->update($validated);

            return redirect()->route('hrm.vacation-settlement.index')->with('success', __('Settlement updated successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function destroy(VacationSettlement $vacationSettlement)
    {
        if (Auth::user()->can('manage-hrm')) {
            $vacationSettlement->delete();
            return redirect()->route('hrm.vacation-settlement.index')->with('success', __('Settlement deleted successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }
}
