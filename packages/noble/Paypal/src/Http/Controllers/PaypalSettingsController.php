<?php

namespace Noble\Paypal\Http\Controllers;

use App\Http\Controllers\Controller;
use Noble\Paypal\Http\Requests\UpdatePaypalSettingsRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaypalSettingsController extends Controller
{
    public function index()
    {
        if (!Auth::user()->can('manage-paypal-settings')) {
            return redirect()->route('dashboard')->with('error', __('Permission denied'));
        }

        return Inertia::render('Paypal/Settings/Index', [
            'globalSettings' => getCompanyAllSetting(),
        ]);
    }

    public function update(UpdatePaypalSettingsRequest $request)
    {
        if (Auth::user()->can('edit-paypal-settings')) {
            $validated = $request->validated();

            $settings = $validated['settings'];
            try {
                foreach ($settings as $key => $value) {
                    setSetting($key, $value, creatorId());
                }

                return redirect()->back()->with('success', __('PayPal settings save successfully.'));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', __('Failed to update PayPal settings: ') . $e->getMessage());
            }           
        }
        return back()->with('error', __('Permission denied'));
    }
}
