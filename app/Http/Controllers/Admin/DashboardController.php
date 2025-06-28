<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\MenuItem;
use App\Models\OrderStatus;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        // Get time range from request, default to 7d
        $timeRange = $request->get('timeRange', '7d');
        
        // Get delivered status ID
        $deliveredStatus = OrderStatus::where('name', 'Delivered')->first();
        $deliveredStatusId = $deliveredStatus ? $deliveredStatus->id : 6; // Fallback to 6 based on seeder

        // Get statistics based on time range
        $stats = $this->getBasicStatistics($timeRange, $deliveredStatusId);
        $todayStats = $this->getTodayStatistics($deliveredStatusId);
        $weeklyRevenue = $this->getWeeklyRevenueData($deliveredStatusId);
        $monthlyOrders = $this->getMonthlyOrdersData();
        $orderStatusDistribution = $this->getOrderStatusDistribution();
        $topRestaurants = $this->getTopRestaurants($deliveredStatusId);
        $recentOrders = $this->getRecentOrders();
        $growthMetrics = $this->getGrowthMetrics($timeRange, $deliveredStatusId);

        // Get recent notifications
        $recentNotifications = Notification::latest()
            ->limit(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'time' => $notification->time_ago,
                    'is_read' => $notification->is_read,
                ];
            });

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'todayStats' => $todayStats,
            'weeklyRevenue' => $weeklyRevenue,
            'monthlyOrders' => $monthlyOrders,
            'orderStatusDistribution' => $orderStatusDistribution,
            'topRestaurants' => $topRestaurants,
            'recentOrders' => $recentOrders,
            'growthMetrics' => $growthMetrics,
            'recentNotifications' => $recentNotifications,
            'timeRange' => $timeRange,
        ]);
    }

    protected function getBasicStatistics(string $timeRange = '7d', int $deliveredStatusId = 6): array
    {
        $dateRange = $this->getDateRange($timeRange);
        
        return [
            'total_orders' => FoodOrder::whereBetween('created_at', $dateRange)->count(),
            'total_restaurants' => Restaurant::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_revenue' => FoodOrder::whereBetween('created_at', $dateRange)
                ->where('order_status_id', $deliveredStatusId)
                ->sum('total_amount'),
        ];
    }

    protected function getTodayStatistics(int $deliveredStatusId = 6): array
    {
        $today = Carbon::today();
        
        return [
            'orders' => FoodOrder::whereDate('created_at', $today)->count(),
            'revenue' => FoodOrder::whereDate('created_at', $today)
                ->where('order_status_id', $deliveredStatusId)
                ->sum('total_amount'),
            'new_customers' => User::whereDate('created_at', $today)
                ->where('role', 'customer')
                ->count(),
        ];
    }

    protected function getWeeklyRevenueData(int $deliveredStatusId = 6): array
    {
        $thisWeek = Carbon::now()->startOfWeek();
        
        return FoodOrder::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->where('created_at', '>=', $thisWeek)
            ->where('order_status_id', $deliveredStatusId)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue
                ];
            })->toArray();
    }

    protected function getMonthlyOrdersData(): array
    {
        $thisMonth = Carbon::now()->startOfMonth();
        
        return FoodOrder::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders')
            )
            ->where('created_at', '>=', $thisMonth)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'orders' => $item->orders
                ];
            })->toArray();
    }

    protected function getOrderStatusDistribution(): array
    {
        return FoodOrder::select(
                'order_statuses.name as status',
                DB::raw('COUNT(*) as count')
            )
            ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
            ->groupBy('order_statuses.id', 'order_statuses.name')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count
                ];
            })->toArray();
    }

    protected function getTopRestaurants(int $deliveredStatusId = 6): array
    {
        return Restaurant::select(
                'restaurants.id',
                'restaurants.restaurant_name',
                DB::raw('COUNT(food_orders.id) as total_orders'),
                DB::raw('SUM(food_orders.total_amount) as total_revenue'),
                DB::raw('AVG(food_orders.cust_restaurant_rating) as avg_rating')
            )
            ->leftJoin('food_orders', 'restaurants.id', '=', 'food_orders.restaurant_id')
            ->where('food_orders.order_status_id', $deliveredStatusId)
            ->groupBy('restaurants.id', 'restaurants.restaurant_name')
            ->orderBy('total_revenue', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'name' => $restaurant->restaurant_name,
                    'total_orders' => $restaurant->total_orders,
                    'total_revenue' => (float) $restaurant->total_revenue,
                    'avg_rating' => $restaurant->avg_rating ? round($restaurant->avg_rating, 1) : 0
                ];
            })->toArray();
    }

    protected function getRecentOrders(): array
    {
        return FoodOrder::with(['customer:id,first_name,last_name', 'restaurant:id,restaurant_name', 'orderStatus:id,name'])
            ->select('id', 'customer_id', 'restaurant_id', 'order_status_id', 'total_amount', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer->first_name . ' ' . $order->customer->last_name,
                    'restaurant_name' => $order->restaurant->restaurant_name,
                    'status' => $order->orderStatus->name,
                    'total_amount' => (float) $order->total_amount,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ];
            })->toArray();
    }

    protected function getGrowthMetrics(string $timeRange = '7d', int $deliveredStatusId = 6): array
    {
        $dateRange = $this->getDateRange($timeRange);
        $previousDateRange = $this->getPreviousDateRange($timeRange);

        // Current period metrics
        $currentOrders = FoodOrder::whereBetween('created_at', $dateRange)->count();
        $currentRevenue = FoodOrder::whereBetween('created_at', $dateRange)
            ->where('order_status_id', $deliveredStatusId)
            ->sum('total_amount');

        // Previous period metrics
        $previousOrders = FoodOrder::whereBetween('created_at', $previousDateRange)->count();
        $previousRevenue = FoodOrder::whereBetween('created_at', $previousDateRange)
            ->where('order_status_id', $deliveredStatusId)
            ->sum('total_amount');

        return [
            'orders_growth' => $previousOrders > 0 
                ? round((($currentOrders - $previousOrders) / $previousOrders) * 100, 1)
                : ($currentOrders > 0 ? 100 : 0),
            'revenue_growth' => $previousRevenue > 0 
                ? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
                : ($currentRevenue > 0 ? 100 : 0),
        ];
    }

    protected function getDateRange(string $timeRange): array
    {
        $now = Carbon::now();
        
        switch ($timeRange) {
            case '24h':
                return [$now->copy()->subDay(), $now];
            case '7d':
                return [$now->copy()->subWeek(), $now];
            case '30d':
                return [$now->copy()->subMonth(), $now];
            case '90d':
                return [$now->copy()->subMonths(3), $now];
            default:
                return [$now->copy()->subWeek(), $now];
        }
    }

    protected function getPreviousDateRange(string $timeRange): array
    {
        $now = Carbon::now();
        
        switch ($timeRange) {
            case '24h':
                $start = $now->copy()->subDays(2);
                $end = $now->copy()->subDay();
                break;
            case '7d':
                $start = $now->copy()->subWeeks(2);
                $end = $now->copy()->subWeek();
                break;
            case '30d':
                $start = $now->copy()->subMonths(2);
                $end = $now->copy()->subMonth();
                break;
            case '90d':
                $start = $now->copy()->subMonths(6);
                $end = $now->copy()->subMonths(3);
                break;
            default:
                $start = $now->copy()->subWeeks(2);
                $end = $now->copy()->subWeek();
        }
        
        return [$start, $end];
    }

    protected function getStatusColor($status)
    {
        $colors = [
            'Delivered' => '#10B981',
            'Out for Delivery' => '#F59E0B',
            'Preparing' => '#3B82F6',
            'Ready' => '#8B5CF6',
            'Confirmed' => '#06B6D4',
            'Pending' => '#F97316',
            'Cancelled' => '#EF4444',
        ];

        return $colors[$status] ?? '#9CA3AF';
    }
}