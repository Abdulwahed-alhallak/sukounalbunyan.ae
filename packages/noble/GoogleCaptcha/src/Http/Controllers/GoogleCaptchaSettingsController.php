<?php

namespace Noble\GoogleCaptcha\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GoogleCaptchaSettingsController extends Controller
{
    public function index()
    {
        if (!Auth::user()->can('manage-google-captcha-settings')) {
            return redirect()->route('dashboard')->with('error', __('Permission denied'));
        }

        return Inertia::render('GoogleCaptcha/Settings/Index', [
            'globalSettings' => getCompanyAllSetting(),
        ]);
    }

    public function update(Request $request)
    {
        if (!Auth::user()->can('edit-google-captcha-settings')) {
            return redirect()->route('dashboard')->with('error', __('Permission denied'));
        }

        $request->validate([
            'settings.recaptcha_version' => 'required|in:v2,v3',
            'settings.recaptcha_site_key' => 'required_if:settings.recaptcha_enabled,on|string|max:255',
            'settings.recaptcha_secret_key' => 'required_if:settings.recaptcha_enabled,on|string|max:255',
            'settings.recaptcha_enabled' => 'required|in:on,off',
        ], [
            'settings.recaptcha_version.required' => __('reCAPTCHA version is required.'),
            'settings.recaptcha_version.in' => __('reCAPTCHA version must be either v2 or v3.'),
            'settings.recaptcha_site_key.required_if' => __('Site key is required when reCAPTCHA is enabled.'),
            'settings.recaptcha_site_key.string' => __('Site key must be a valid text.'),
            'settings.recaptcha_site_key.max' => __('Site key cannot exceed 255 characters.'),
            'settings.recaptcha_secret_key.required_if' => __('Secret key is required when reCAPTCHA is enabled.'),
            'settings.recaptcha_secret_key.string' => __('Secret key must be a valid text.'),
            'settings.recaptcha_secret_key.max' => __('Secret key cannot exceed 255 characters.'),
            'settings.recaptcha_enabled.required' => __('reCAPTCHA status is required.'),
            'settings.recaptcha_enabled.in' => __('reCAPTCHA status must be either enabled or disabled.'),
        ]);

        try {
            $settings = $request->input('settings', []);

            foreach ($settings as $key => $value) {
                setSetting($key, $value);
            }

            return redirect()->back()->with('success', __('Google reCAPTCHA settings updated successfully.'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update Google reCAPTCHA settings.'));
        }
    }
}
