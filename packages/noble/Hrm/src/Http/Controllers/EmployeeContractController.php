<?php

namespace Noble\Hrm\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Noble\Hrm\Models\EmployeeContract;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class EmployeeContractController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-employees')) {
            $contracts = EmployeeContract::with('employee:id,name,avatar')
                ->where('created_by', creatorId())
                ->latest()
                ->get();
            
            $employees = User::where('created_by', creatorId())
                ->where('type', '!=', 'client')
                ->select('id', 'name')
                ->get();

            return Inertia::render('Hrm/Contracts/Index', [
                'contracts' => $contracts,
                'employees' => $employees
            ]);
        } else {
            return redirect()->back()->with('error', __('Permission denied.'));
        }
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('create-employees')) {
            $validated = $request->validate([
                'employee_id' => 'required|exists:users,id',
                'contract_type' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'probation_end_date' => 'nullable|date|after_or_equal:start_date',
                'basic_salary' => 'nullable|numeric|min:0',
                'status' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            $contract = new EmployeeContract();
            $contract->fill($validated);
            $contract->created_by = creatorId();
            $contract->save();

            // Handle file attachments if any
            if ($request->hasFile('document')) {
                $file = $request->file('document');
                $contract->uploadMedia($file, 'documents', $contract->contract_type);
            }

            return redirect()->back()->with('success', __('Contract details effectively assigned.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied.'));
        }
    }

    public function update(Request $request, EmployeeContract $contract)
    {
        if (Auth::user()->can('edit-employees')) {
            $validated = $request->validate([
                'employee_id' => 'required|exists:users,id',
                'contract_type' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'probation_end_date' => 'nullable|date|after_or_equal:start_date',
                'basic_salary' => 'nullable|numeric|min:0',
                'status' => 'required|string',
                'notes' => 'nullable|string',
            ]);

            $contract->fill($validated);
            $contract->save();

            if ($request->hasFile('document')) {
                $file = $request->file('document');
                $contract->uploadMedia($file, 'documents', $contract->contract_type);
            }

            return redirect()->back()->with('success', __('Contract updated securely.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied.'));
        }
    }

    public function destroy(EmployeeContract $contract)
    {
        if (Auth::user()->can('delete-employees')) {
            $contract->delete();
            return redirect()->back()->with('success', __('Contract effectively unbound.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied.'));
        }
    }
}
