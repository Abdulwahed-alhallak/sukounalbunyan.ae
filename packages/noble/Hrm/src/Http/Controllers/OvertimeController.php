<?php

namespace Noble\Hrm\Http\Controllers;

use Noble\Hrm\Models\Overtime;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Http\Requests\StoreOvertimeRequest;
use Noble\Hrm\Http\Requests\UpdateOvertimeRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Noble\Hrm\Events\CreateOverTime;
use Noble\Hrm\Events\UpdateOverTime;
use Noble\Hrm\Events\DestroyOverTime;

class OvertimeController extends Controller
{
    public function store(StoreOvertimeRequest $request)
    {
        if (Auth::user()->can('create-overtimes')) {
            $validated = $request->validated();
            
            $employee = Employee::find($validated['employee_id']);

            if ($employee) {
                $overtime = new Overtime();
                $overtime->title = $validated['title'];
                $overtime->employee_id = $employee->user_id;
                $overtime->total_days = $validated['total_days'];
                $overtime->hours = $validated['hours'];
                $overtime->rate = $validated['rate'];
                $overtime->start_date = $validated['start_date'];
                $overtime->end_date = $validated['end_date'];
                $overtime->notes = $validated['notes'];
                $overtime->status = $validated['status'];
                $overtime->creator_id = Auth::id();
                $overtime->created_by = creatorId();
                $overtime->save();

                CreateOverTime::dispatch($request, $overtime);

                return redirect()->back()->with('success', __('The overtime has been created successfully.'))->with('timestamp', time());
            } else {
                return redirect()->back()->with('error', __('Employee Not Found.'));
            }
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateOvertimeRequest $request, Overtime $overtime)
    {
        if (Auth::user()->can('edit-overtimes')) {

            $validated = $request->validated();

            $overtime->title = $validated['title'];
            $overtime->total_days = $validated['total_days'];
            $overtime->hours = $validated['hours'];
            $overtime->rate = $validated['rate'];
            $overtime->start_date = $validated['start_date'];
            $overtime->end_date = $validated['end_date'];
            $overtime->notes = $validated['notes'];
            $overtime->status = $validated['status'];
            $overtime->save();

            UpdateOverTime::dispatch($request, $overtime);

            return redirect()->back()->with('success', __('The overtime has been updated successfully.'))->with('timestamp', time());
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function destroy(Overtime $overtime, Employee $employee)
    {
        if (Auth::user()->can('delete-overtimes')) {
            DestroyOverTime::dispatch($overtime);
            $overtime->delete();

            return redirect()->back()->with('success', __('The overtime has been deleted.'))->with('timestamp', time());
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }
}