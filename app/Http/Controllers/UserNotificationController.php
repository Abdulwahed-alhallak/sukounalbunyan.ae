<?php

namespace App\Http\Controllers;

use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserNotificationController extends Controller
{
    /**
     * Get notification center page
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = UserNotification::forUser($user->id)
            ->notArchived()
            ->with('triggeredBy:id,name')
            ->orderByDesc('created_at');

        // Filter by type
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        // Filter by read status
        if ($request->filter === 'unread') {
            $query->unread();
        } elseif ($request->filter === 'read') {
            $query->read();
        }

        $notifications = $query->paginate(20)->appends($request->query());

        // Notification types for filter
        $types = UserNotification::forUser($user->id)
            ->notArchived()
            ->distinct()
            ->pluck('type')
            ->filter()
            ->values();

        $unreadCount = UserNotification::unreadCount($user->id);

        return Inertia::render('notifications/Index', [
            'notifications' => $notifications,
            'filters' => $request->only(['type', 'filter']),
            'types' => $types,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Get unread count (API-ready, also shared via Inertia)
     */
    public function unreadCount()
    {
        return response()->json([
            'count' => UserNotification::unreadCount(Auth::id()),
        ]);
    }

    /**
     * Mark a single notification as read
     */
    public function markAsRead(UserNotification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $notification->markAsRead();

        // If there's an action URL, redirect to it
        if ($notification->action_url) {
            return redirect($notification->action_url);
        }

        return back();
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        UserNotification::forUser(Auth::id())
            ->unread()
            ->update(['read_at' => now()]);

        return back()->with('success', 'All notifications marked as read.');
    }

    /**
     * Archive a notification (soft-hide)
     */
    public function archive(UserNotification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $notification->archive();

        return back();
    }

    /**
     * Archive all read notifications
     */
    public function archiveAllRead()
    {
        UserNotification::forUser(Auth::id())
            ->read()
            ->update(['archived_at' => now()]);

        return back()->with('success', 'Read notifications archived.');
    }
}
