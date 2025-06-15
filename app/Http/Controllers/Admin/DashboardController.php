<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        // Get statistics
        $stats = $this->getBasicStatistics();
        $todayStats = $this->getTodayStatistics();
        $weeklyRevenue = $this->getWeeklyRevenueData();
        $monthlyOrders = $this->getMonthlyOrdersData();
        $orderStatusDistribution = $this->getOrderStatusDistribution();
        $topRestaurants = $this->getTopRestaurants();
        $recentOrders = $this->getRecentOrders();
        $growthMetrics = $this->getGrowthMetrics();

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'todayStats' => $todayStats,
            'weeklyRevenue' => $weeklyRevenue,
            'monthlyOrders' => $monthlyOrders,
            'orderStatusDistribution' => $orderStatusDistribution,
            'topRestaurants' => $topRestaurants,
            'recentOrders' => $recentOrders,
            'growthMetrics' => $growthMetrics,
        ]);
    }

    protected function getBasicStatistics(): array
    {
        return [
            'total_orders' => FoodOrder::count(),
            'total_restaurants' => Restaurant::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_revenue' => FoodOrder::where('order_status_id', 4)->sum('total_amount'),
        ];
    }

    protected function getTodayStatistics(): array
    {
        $today = Carbon::today();
        
        return [
            'orders' => FoodOrder::whereDate('created_at', $today)->count(),
            'revenue' => FoodOrder::whereDate('created_at', $today)
                ->where('order_status_id', 4)
                ->sum('total_amount'),
            'new_customers' => User::whereDate('created_at', $today)
                ->where('role', 'customer')
                ->count(),
        ];
    }

    protected function getWeeklyRevenueData(): array
    {
        $thisWeek = Carbon::now()->startOfWeek();
        
        return FoodOrder::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->where('created_at', '>=', $thisWeek)
            ->where('order_status_id', 4)
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
                'order_statuses.status_value as status',
                DB::raw('COUNT(*) as count')
            )
            ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
            ->groupBy('order_statuses.id', 'order_statuses.status_value')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count
                ];
            })->toArray();
    }

    protected function getTopRestaurants(): array
    {
        return Restaurant::select(
                'restaurants.id',
                'restaurants.restaurant_name',
                DB::raw('COUNT(food_orders.id) as total_orders'),
                DB::raw('SUM(food_orders.total_amount) as total_revenue'),
                DB::raw('AVG(food_orders.cust_restaurant_rating) as avg_rating')
            )
            ->leftJoin('food_orders', 'restaurants.id', '=', 'food_orders.restaurant_id')
            ->where('food_orders.order_status_id', 4)
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
        return FoodOrder::with(['customer:id,first_name,last_name', 'restaurant:id,restaurant_name', 'orderStatus:id,status_value'])
            ->select('id', 'customer_id', 'restaurant_id', 'order_status_id', 'total_amount', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer->first_name . ' ' . $order->customer->last_name,
                    'restaurant_name' => $order->restaurant->restaurant_name,
                    'status' => $order->orderStatus->status_value,
                    'total_amount' => (float) $order->total_amount,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ];
            })->toArray();
    }

    protected function getGrowthMetrics(): array
    {
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth();

        $currentMonthOrders = FoodOrder::where('created_at', '>=', $thisMonth)->count();
        $previousMonthOrders = FoodOrder::whereBetween('created_at', [
            $lastMonth->startOfMonth(),
            $lastMonth->endOfMonth()
        ])->count();

        $currentMonthRevenue = FoodOrder::where('created_at', '>=', $thisMonth)
            ->where('order_status_id', 4)
            ->sum('total_amount');
        $previousMonthRevenue = FoodOrder::whereBetween('created_at', [
            $lastMonth->startOfMonth(),
            $lastMonth->endOfMonth()
        ])->where('order_status_id', 4)->sum('total_amount');

        return [
            'orders_growth' => $previousMonthOrders > 0 
                ? round((($currentMonthOrders - $previousMonthOrders) / $previousMonthOrders) * 100, 1)
                : 0,
            'revenue_growth' => $previousMonthRevenue > 0 
                ? round((($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 1)
                : 0,
        ];
    }

    protected function getStatusColor($status)
    {
        $colors = [
            'Delivered' => '#10B981',
            'In Transit' => '#F59E0B',
            'Preparing' => '#3B82F6',
            'Cancelled' => '#EF4444',
        ];

        return $colors[$status] ?? '#9CA3AF';
    }
}