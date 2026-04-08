<?php

namespace DionONE\Hrm\Http\Controllers;

use App\Models\User;
use DionONE\Hrm\Models\CompanyAsset;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompanyAssetController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-hrm')) {
            $assets = CompanyAsset::with(['assignedEmployee:id,name'])
                ->where('created_by', creatorId())
                ->when(request('search'), function ($q) {
                    $q->where('asset_name', 'like', '%' . request('search') . '%')
                        ->orWhere('serial_number', 'like', '%' . request('search') . '%');
                })
                ->when(request('asset_type'), fn($q) => $q->where('asset_type', request('asset_type')))
                ->when(request('status'), fn($q) => $q->where('status', request('status')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 15))
                ->withQueryString();

            $employees = User::where('created_by', creatorId())
                ->where('type', 'staff')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return Inertia::render('Hrm/Assets/Index', [
                'assets' => $assets,
                'employees' => $employees,
            ]);
        }
        return back()->with('error', __('Permission denied'));
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'asset_name' => 'required|string|max:255',
                'asset_type' => 'required|string|max:100',
                'serial_number' => 'nullable|string|max:255',
                'purchase_date' => 'nullable|date',
                'purchase_cost' => 'nullable|numeric|min:0',
                'status' => 'required|string|in:Available,Assigned,Under Maintenance,Retired',
                'assigned_to' => 'nullable|exists:users,id',
                'assigned_date' => 'nullable|date',
                'condition' => 'required|string|in:New,Good,Fair,Poor',
                'notes' => 'nullable|string',
            ]);

            $validated['created_by'] = creatorId();

            CompanyAsset::create($validated);

            return redirect()->route('hrm.assets.index')->with('success', __('Asset created successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function update(Request $request, CompanyAsset $asset)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'asset_name' => 'required|string|max:255',
                'asset_type' => 'required|string|max:100',
                'serial_number' => 'nullable|string|max:255',
                'purchase_date' => 'nullable|date',
                'purchase_cost' => 'nullable|numeric|min:0',
                'status' => 'required|string|in:Available,Assigned,Under Maintenance,Retired',
                'assigned_to' => 'nullable|exists:users,id',
                'assigned_date' => 'nullable|date',
                'return_date' => 'nullable|date',
                'condition' => 'required|string|in:New,Good,Fair,Poor',
                'notes' => 'nullable|string',
            ]);

            $asset->update($validated);

            return redirect()->route('hrm.assets.index')->with('success', __('Asset updated successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function destroy(CompanyAsset $asset)
    {
        if (Auth::user()->can('manage-hrm')) {
            $asset->delete();
            return redirect()->route('hrm.assets.index')->with('success', __('Asset deleted successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }
}
