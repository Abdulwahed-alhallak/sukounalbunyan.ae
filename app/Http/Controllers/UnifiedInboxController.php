<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UnifiedInboxController extends Controller
{
    /**
     * Display the Omnichannel Unified Inbox.
     */
    public function index()
    {
        $companyId = Auth::user()->creatorId();
        
        // Pass configurations down to the interface so it knows what platforms are active
        $settings = getCompanyAllSetting($companyId);
        
        $activeChannels = [
            'whatsapp' => !empty($settings['twilio_sid']),
            'email'    => !empty($settings['imap_host']),
            'internal' => true // Always active
        ];

        return Inertia::render('MissionCommand/UnifiedInbox/Index', [
            'activeChannels' => $activeChannels
        ]);
    }

    /**
     * Send a message through the Omnichannel Service API.
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|in:whatsapp,email,internal',
            'to'       => 'required|string',
            'content'  => 'required|string'
        ]);

        $companyId = Auth::user()->creatorId();
        $service = new \App\Services\UnifiedInboxService($companyId);

        $result = $service->sendMessage($validated['platform'], $validated['to'], $validated['content']);

        if ($result) {
            return response()->json(['success' => true, 'message' => 'Message delivered successfully.']);
        }

        return response()->json(['success' => false, 'message' => 'Failed to deliver message check system logs.'], 500);
    }
}
