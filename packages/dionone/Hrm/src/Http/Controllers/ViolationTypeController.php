<?php

namespace DionONE\Hrm\Http\Controllers;

use DionONE\Hrm\Models\ViolationType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ViolationTypeController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-hrm-setup')) {
            $violationTypes = ViolationType::where('created_by', creatorId())->get();
            return Inertia::render('Hrm/SystemSetup/ViolationTypes/Index', [
                'violationTypes' => $violationTypes
            ]);
        }
        return redirect()->back()->with('error', __('Permission denied'));
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('manage-hrm-setup')) {
            $validated = $request->validate([
                'name' => 'required|string',
                'severity' => 'required|string',
                'default_deduction_amount' => 'required|numeric'
            ]);
            $validated['created_by'] = creatorId();
            
            ViolationType::create($validated);
            return redirect()->back()->with('success', __('Violation type created successfully.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function update(Request $request, ViolationType $violationType)
    {
        if (Auth::user()->can('manage-hrm-setup')) {
            $validated = $request->validate([
                'name' => 'required|string',
                'severity' => 'required|string',
                'default_deduction_amount' => 'required|numeric'
            ]);
            
            $violationType->update($validated);
            return redirect()->back()->with('success', __('Violation type updated successfully.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function destroy(ViolationType $violationType)
    {
        if (Auth::user()->can('manage-hrm-setup')) {
            $violationType->delete();
            return redirect()->back()->with('success', __('Violation type deleted successfully.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }
}
