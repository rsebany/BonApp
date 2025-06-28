<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        // Get notifications for the current user (filter by user_id in data if needed)
        $notifications = Notification::latest()
            ->limit(10)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'time' => $notification->time_ago,
                    'read' => $notification->is_read,
                    'icon' => $this->getNotificationIcon($notification->type),
                ];
            });

        $unreadCount = Notification::unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::unread()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function getUnreadCount(): JsonResponse
    {
        $count = Notification::unread()->count();
        return response()->json(['count' => $count]);
    }

    private function getNotificationIcon($type): string
    {
        switch ($type) {
            case 'order':
                return 'shopping-bag';
            case 'promotion':
                return 'gift';
            case 'system':
                return 'settings';
            default:
                return 'bell';
        }
    }
} 