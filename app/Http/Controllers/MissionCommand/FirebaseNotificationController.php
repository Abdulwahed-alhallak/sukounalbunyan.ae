<?php

namespace App\Http\Controllers\MissionCommand;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class FirebaseNotificationController extends Controller
{
    /**
     * Store and broadcast the push notification via FCM.
     */
    public function send(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'target_audience' => 'required|string|in:all,students,instructors,companies',
            'image_url' => 'nullable|url',
        ]);

        $serverKey = env('FCM_SERVER_KEY');
        if (empty($serverKey)) {
            return back()->with('error', 'Firebase FCM Server Key is not configured in .env.');
        }

        $title = $request->input('title');
        $body = $request->input('body');
        $imageUrl = $request->input('image_url');
        $topic = $request->input('target_audience'); // In a real FCM scale, users subscribe to topics.

        try {
            $response = Http::withHeaders([
                'Authorization' => 'key=' . $serverKey,
                'Content-Type' => 'application/json',
            ])->post('https://fcm.googleapis.com/fcm/send', [
                'to' => '/topics/' . $topic,
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'image' => $imageUrl,
                ],
                // Add data payload if necessary for background processing on devices
                'data' => [
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                    'id' => '1',
                    'status' => 'done'
                ]
            ]);

            if ($response->successful()) {
                // Log it in our database for audit
                \App\Models\UserNotification::sendToSuperAdmins(
                    'system',
                    'Mass Push Notification Sent',
                    "Sent '{$title}' to target: {$topic}",
                    ['icon' => 'Radio']
                );
                
                return back()->with('success', 'Push Notification broadcasted successfully to topic: ' . $topic);
            } else {
                return back()->with('error', 'FCM Response Error: ' . $response->body());
            }

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to dispatch Push Notification: ' . $e->getMessage());
        }
    }
}
