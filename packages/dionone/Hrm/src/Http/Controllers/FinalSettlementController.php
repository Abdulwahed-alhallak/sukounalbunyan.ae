<?php

namespace DionONE\Hrm\Http\Controllers;

use App\Models\User;
use DionONE\Hrm\Models\FinalSettlement;
use DionONE\Hrm\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FinalSettlementController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-hrm')) {
            $settlements = FinalSettlement::with(['employee:id,name'])
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

            return Inertia::render('Hrm/FinalSettlement/Index', [
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
                'last_working_day' => 'required|date',
                'basic_salary' => 'required|numeric|min:0',
                'leave_encashment' => 'nullable|numeric|min:0',
                'gratuity' => 'nullable|numeric|min:0',
                'other_earnings' => 'nullable|numeric|min:0',
                'deductions' => 'nullable|numeric|min:0',
                'separation_reason' => 'nullable|string|in:Resignation,Termination,Contract End,Retirement',
                'notes' => 'nullable|string',
            ]);

            $validated['created_by'] = creatorId();
            $validated['status'] = 'Open';
            $validated['leave_encashment'] = $validated['leave_encashment'] ?? 0;
            $validated['gratuity'] = $validated['gratuity'] ?? 0;
            $validated['other_earnings'] = $validated['other_earnings'] ?? 0;
            $validated['deductions'] = $validated['deductions'] ?? 0;

            // Total = basic + leave_encashment + gratuity + other_earnings - deductions
            $validated['total_amount'] = round(
                $validated['basic_salary'] +
                $validated['leave_encashment'] +
                $validated['gratuity'] +
                $validated['other_earnings'] -
                $validated['deductions'],
                2
            );

            FinalSettlement::create($validated);

            return redirect()->route('hrm.final-settlement.index')->with('success', __('Final settlement created successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function update(Request $request, FinalSettlement $finalSettlement)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'status' => 'required|string|in:Open,Processing,Paid',
                'notes' => 'nullable|string',
            ]);

            $finalSettlement->update($validated);

            return redirect()->route('hrm.final-settlement.index')->with('success', __('Settlement updated successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function destroy(FinalSettlement $finalSettlement)
    {
        if (Auth::user()->can('manage-hrm')) {
            $finalSettlement->delete();
            return redirect()->route('hrm.final-settlement.index')->with('success', __('Settlement deleted successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }
}
