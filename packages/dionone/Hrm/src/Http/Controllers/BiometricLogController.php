<?php

namespace DionONE\Hrm\Http\Controllers;

use App\Models\User;
use DionONE\Hrm\Models\BiometricLog;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

class BiometricLogController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-attendances')) {
            $logs = BiometricLog::query()
                ->where('created_by', creatorId())
                ->when(request('search'), function ($q) {
                    $q->where('emp_id', 'like', '%' . request('search') . '%');
                })
                ->when(request('status') !== null && request('status') !== '', function ($q) {
                    $q->where('is_processed', request('status') === 'processed');
                })
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('Hrm/BiometricLogs/Index', [
                'logs' => $logs,
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function process()
    {
        if (Auth::user()->can('manage-attendances')) {
            Artisan::call('hrm:process-biometrics');
            return back()->with('success', __('Biometric logs processed successfully.'));
        }
        return back()->with('error', __('Permission denied'));
    }
}
