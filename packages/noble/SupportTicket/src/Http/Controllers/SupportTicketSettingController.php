<?php

namespace Noble\SupportTicket\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Noble\SupportTicket\Models\SupportTicketSetting;
use Noble\SupportTicket\Http\Requests\StoreBrandSettingsRequest;
use Noble\SupportTicket\Events\UpdateBrandSettings;

class SupportTicketSettingController extends Controller
{
    public function brandSettings()
    {
        if(Auth::user()->can('manage-support-ticket-brand-settings')){
            $supportTicketSettings = SupportTicketSetting::getAllByCompany(creatorId());

            return Inertia::render('SupportTicket/SystemSetup/BrandSettings/Index', [
                'settings' => $supportTicketSettings
            ]);
        }
        return back()->with('error', __('Permission denied'));
    }

    public function updateBrandSettings(StoreBrandSettingsRequest $request)
    {
        if(Auth::user()->can('edit-support-ticket-brand-settings')){
            $settings = $request->all();

            if (isset($settings['logo_dark'])) {
                $settings['logo_dark'] = basename($settings['logo_dark']);
            }

            if (isset($settings['favicon'])) {
                $settings['favicon'] = basename($settings['favicon']);
            }

            foreach ($settings as $key => $value) {
                if (in_array($key, ['logo_dark', 'favicon', 'titleText', 'footerText'])) {
                    SupportTicketSetting::set($key, $value);
                }
            }

            return redirect()->back()->with('success', __('The brand setting details are saved successfully.'));
        }
        else{
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }


}