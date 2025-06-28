<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\Notification;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function index()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        // Get system statistics
        $stats = $this->getSystemStats();
        $recentActivities = $this->getRecentActivities();
        $systemInfo = $this->getSystemInfo();
        $systemSettings = $this->getSystemSettings();

        return Inertia::render('admin/Settings/index', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'systemInfo' => $systemInfo,
            'systemSettings' => $systemSettings,
        ]);
    }

    protected function getSystemStats(): array
    {
        // Get delivered status ID
        $deliveredStatus = OrderStatus::where('name', 'Delivered')->first();
        $deliveredStatusId = $deliveredStatus ? $deliveredStatus->id : 6;

        return [
            'totalUsers' => User::count(),
            'activeRestaurants' => Restaurant::count(),
            'pendingOrders' => FoodOrder::where('order_status_id', '!=', $deliveredStatusId)->count(),
            'systemHealth' => $this->calculateSystemHealth(),
        ];
    }

    protected function getRecentActivities(): array
    {
        $activities = [];

        // Recent orders
        $recentOrders = FoodOrder::with(['customer:id,first_name,last_name', 'restaurant:id,restaurant_name'])
            ->latest()
            ->limit(3)
            ->get();

        foreach ($recentOrders as $order) {
            $activities[] = [
                'id' => $order->id,
                'action' => "Order #{$order->id} " . strtolower($order->status->name ?? 'created'),
                'time' => $order->created_at->diffForHumans(),
                'type' => $this->getOrderActivityType($order->order_status_id),
            ];
        }

        // Recent user registrations
        $recentUsers = User::latest()->limit(2)->get();
        foreach ($recentUsers as $user) {
            $activities[] = [
                'id' => 'user_' . $user->id,
                'action' => "User account created: {$user->first_name} {$user->last_name}",
                'time' => $user->created_at->diffForHumans(),
                'type' => 'info',
            ];
        }

        // Recent restaurant registrations
        $recentRestaurants = Restaurant::latest()->limit(2)->get();
        foreach ($recentRestaurants as $restaurant) {
            $activities[] = [
                'id' => 'restaurant_' . $restaurant->id,
                'action' => "New restaurant registered: {$restaurant->restaurant_name}",
                'time' => $restaurant->created_at->diffForHumans(),
                'type' => 'info',
            ];
        }

        // Sort by creation time and limit to 10
        usort($activities, function ($a, $b) {
            return strtotime($b['time']) - strtotime($a['time']);
        });

        return array_slice($activities, 0, 10);
    }

    protected function getSystemInfo(): array
    {
        // Get database size (approximate)
        $dbSize = $this->getDatabaseSize();
        
        // Get system uptime (mock data for now)
        $uptime = '99.9%';
        
        // Get response time (mock data for now)
        $responseTime = '120ms';
        
        // Get active sessions
        $activeSessions = Cache::get('active_sessions', rand(100, 200));

        return [
            'version' => '1.2.0',
            'lastUpdated' => Carbon::now()->subDays(2)->diffForHumans(),
            'databaseSize' => $dbSize,
            'uptime' => $uptime,
            'responseTime' => $responseTime,
            'activeSessions' => $activeSessions,
        ];
    }

    protected function getSystemSettings(): array
    {
        // In a real application, these would be stored in a settings table
        // For now, we'll return mock data
        return [
            'maintenanceMode' => false,
            'emailNotifications' => true,
            'autoBackup' => true,
        ];
    }

    protected function calculateSystemHealth(): string
    {
        // Simple health calculation based on various metrics
        $healthScore = 100;

        // Check for pending orders (if too many, reduce health)
        $pendingOrders = FoodOrder::where('order_status_id', '!=', 6)->count();
        if ($pendingOrders > 50) {
            $healthScore -= 20;
        }

        // Check for recent errors (mock)
        $recentErrors = 0; // In real app, check error logs
        if ($recentErrors > 10) {
            $healthScore -= 30;
        }

        // Check database performance (mock)
        $dbPerformance = 'good'; // In real app, check query performance
        if ($dbPerformance !== 'good') {
            $healthScore -= 15;
        }

        if ($healthScore >= 90) {
            return 'Excellent';
        } elseif ($healthScore >= 75) {
            return 'Good';
        } elseif ($healthScore >= 60) {
            return 'Fair';
        } else {
            return 'Poor';
        }
    }

    protected function getOrderActivityType($statusId): string
    {
        // Map order status to activity type
        $statusMap = [
            1 => 'info',    // Pending
            2 => 'info',    // Confirmed
            3 => 'info',    // Preparing
            4 => 'info',    // Ready
            5 => 'info',    // Out for delivery
            6 => 'success', // Delivered
            7 => 'warning', // Cancelled
        ];

        return $statusMap[$statusId] ?? 'info';
    }

    protected function getDatabaseSize(): string
    {
        try {
            // Get database size from information_schema
            $result = DB::select("
                SELECT 
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS 'size_mb'
                FROM information_schema.tables 
                WHERE table_schema = DATABASE()
            ");

            if (!empty($result)) {
                $sizeMB = $result[0]->size_mb;
                if ($sizeMB >= 1024) {
                    return round($sizeMB / 1024, 1) . ' GB';
                }
                return $sizeMB . ' MB';
            }
        } catch (\Exception $e) {
            // Fallback to mock data
        }

        return '2.4 GB'; // Fallback
    }

    public function updateSettings(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'maintenanceMode' => 'boolean',
            'emailNotifications' => 'boolean',
            'autoBackup' => 'boolean',
        ]);

        // In a real application, you would save these to a settings table
        // For now, we'll just return success
        Cache::put('system_settings', $validated, 3600);

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $validated,
        ]);
    }

    public function getSystemMetrics()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $metrics = [
            'cpu_usage' => rand(20, 80), // Mock data
            'memory_usage' => rand(40, 90), // Mock data
            'disk_usage' => rand(30, 70), // Mock data
            'active_connections' => rand(50, 150), // Mock data
            'requests_per_minute' => rand(100, 500), // Mock data
        ];

        return response()->json($metrics);
    }

    public function toggleMaintenanceMode(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $maintenanceMode = $request->boolean('maintenanceMode');
        
        // In a real application, you would:
        // 1. Update the maintenance mode setting
        // 2. Clear application cache
        // 3. Notify users if going into maintenance mode
        
        Cache::put('maintenance_mode', $maintenanceMode, 3600);

        return response()->json([
            'message' => $maintenanceMode ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
            'maintenanceMode' => $maintenanceMode,
        ]);
    }
} 