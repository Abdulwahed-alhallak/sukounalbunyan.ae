<?php

namespace Noble\Hrm\Http\Controllers;

use Noble\Hrm\Models\Loan;
use Noble\Hrm\Models\LoanType;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Http\Requests\StoreLoanRequest;
use Noble\Hrm\Http\Requests\UpdateLoanRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Noble\Hrm\Events\CreateLoan;
use Noble\Hrm\Events\UpdateLoan;
use Noble\Hrm\Events\DestroyLoan;

class LoanController extends Controller
{
    public function store(StoreLoanRequest $request)
    {
        if (Auth::user()->can('create-loans')) {
            $validated = $request->validated();

            $employee = Employee::find($validated['employee_id']);

            if ($employee) {
                // Check if employee already has a loan
                $existingLoan = Loan::where('employee_id', $employee->user_id)
                    ->where('loan_type_id', $validated['loan_type_id'])
                    ->first();

                if ($existingLoan) {
                    return redirect()->back()->with('error', __('Employee already has a loan.'));
                }

                $loan = new Loan();
                $loan->title = $validated['title'];
                $loan->employee_id = $employee->user_id;
                $loan->loan_type_id = $validated['loan_type_id'];
                $loan->type = $validated['type'];
                $loan->amount = $validated['amount'];
                $loan->start_date = $validated['start_date'];
                $loan->end_date = $validated['end_date'];
                $loan->reason = $validated['reason'];
                $loan->status = 'pending';
                $loan->manager_status = 'pending';
                $loan->creator_id = Auth::id();
                $loan->created_by = creatorId();
                $loan->save();

                CreateLoan::dispatch($request, $loan);

                return redirect()->back()->with('success', __('The loan has been created successfully.'))->with('timestamp', time());
            } else {
                return redirect()->back()->with('error', __('Employee Not Found.'));
            }
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        if (Auth::user()->can('edit-loans')) {

            $validated = $request->validated();

            // Check if another employee already has a loan (excluding current loan)
            $existingLoan = Loan::where('employee_id', $loan->employee_id)
                ->where('loan_type_id', $validated['loan_type_id'])
                ->where('id', '!=', $loan->id)
                ->first();

            if ($existingLoan) {
                return redirect()->back()->with('error', __('Employee already has a loan.'));
            }

            $loan->title = $validated['title'];
            $loan->loan_type_id = $validated['loan_type_id'];
            $loan->type = $validated['type'];
            $loan->amount = $validated['amount'];
            $loan->start_date = $validated['start_date'];
            $loan->end_date = $validated['end_date'];
            $loan->reason = $validated['reason'];
            $loan->save();

            UpdateLoan::dispatch($request, $loan);

            return redirect()->back()->with('success', __('The loan has been updated successfully.'))->with('timestamp', time());
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function destroy(Loan $loan, Employee $employee)
    {
        if (Auth::user()->can('delete-loans')) {
            DestroyLoan::dispatch($loan);
            $loan->delete();

            return redirect()->back()->with('success', __('The loan has been deleted.'))->with('timestamp', time());
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function updateStatus(\Illuminate\Http\Request $request, Loan $loan)
    {
        $request->validate([
            'status' => 'nullable|in:pending,approved,rejected',
            'manager_status' => 'nullable|in:pending,approved,rejected',
            'approver_comment' => 'nullable|string',
        ]);

        $isMultiTierEnabled = getCompanyAllSetting(creatorId())['enable_multi_tier_approval'] ?? 'on';

        // Manager Approval Flow
        if ($request->has('manager_status')) {
            $employee = Employee::where('user_id', $loan->employee_id)->first();
            
            // Check if auth user is the line manager OR a superadmin/admin bypassing
            if (Auth::user()->can('manage-any-leaves') || ($employee && $employee->line_manager == Auth::id())) {
                $loan->manager_status = $request->manager_status;
                $loan->manager_id = Auth::id();
                $loan->manager_comment = $request->has('status') ? $loan->manager_comment : $request->approver_comment;
                
                // If manager rejects, auto-reject the final status
                if ($request->manager_status === 'rejected') {
                    $loan->status = 'rejected';
                }
            } else {
                return redirect()->back()->with('error', __('Only line manager can update manager status.'));
            }
        }

        // HR Final Approval Flow
        if ($request->has('status')) {
            if (!Auth::user()->can('edit-loans')) {
                return redirect()->back()->with('error', __('Permission denied'));
            }

            if ($isMultiTierEnabled === 'on' && $loan->manager_status !== 'approved' && $request->status === 'approved') {
                return redirect()->back()->with('error', __('Loan must be approved by the line manager first.'));
            }

            $loan->status = $request->status;
        }

        $loan->save();

        return redirect()->back()->with('success', __('Loan status updated successfully.'));
    }
}
