<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use App\Models\OrderStatus;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Date range handling (default to last 30 days)
        $dateFrom = $request->input('date_from', Carbon::now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', Carbon::now()->format('Y-m-d'));

        // Get the completed status ID first with null check
        $completedStatus = OrderStatus::where('name', 'completed')->first();
        $completedStatusId = $completedStatus ? $completedStatus->id : null;

        // Orders by status data
        $ordersByStatus = OrderStatus::withCount([
            'orders' => function ($query) use ($dateFrom, $dateTo) {
                $query->whereBetween('created_at', [$dateFrom, $dateTo]);
            }
        ])->get()->map(function ($status) {
            return [
                'name' => $status->name,
                'count' => $status->orders_count
            ];
        });

        // Monthly revenue data (last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $revenueQuery = FoodOrder::whereBetween('created_at', [$start, $end]);
            
            if ($completedStatusId) {
                $revenueQuery->where('order_status_id', $completedStatusId);
            }

            $revenue = $revenueQuery->sum('total_amount');

            $monthlyRevenue[] = [
                'month' => $date->format('M Y'),
                'revenue' => $revenue
            ];
        }

        // Top restaurants by order count
        $topRestaurants = Restaurant::withCount(['orders' => function ($query) use ($dateFrom, $dateTo) {
            $query->whereBetween('created_at', [$dateFrom, $dateTo]);
        }])
            ->orderByDesc('orders_count')
            ->limit(5)
            ->get()
            ->map(function ($restaurant) {
                return [
                    'name' => $restaurant->restaurant_name,
                    'orders' => $restaurant->orders_count
                ];
            });

        // Total metrics
        $totalOrders = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        
        $completedOrdersQuery = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo]);
        if ($completedStatusId) {
            $completedOrdersQuery->where('order_status_id', $completedStatusId);
        }
        $completedOrders = $completedOrdersQuery->count();

        $totalRevenueQuery = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo]);
        if ($completedStatusId) {
            $totalRevenueQuery->where('order_status_id', $completedStatusId);
        }
        $totalRevenue = $totalRevenueQuery->sum('total_amount');

        // Count all restaurants (since we don't have is_active column)
        $restaurantsCount = Restaurant::count();

        return Inertia::render('admin/Reports/analytics', [
            'reports' => [
                'orders_by_status' => $ordersByStatus,
                'monthly_revenue' => $monthlyRevenue,
                'top_restaurants' => $topRestaurants,
                'total_metrics' => [
                    'orders' => $totalOrders,
                    'completed_orders' => $completedOrders,
                    'revenue' => (float)$totalRevenue,
                    'active_restaurants' => $restaurantsCount, // Changed from active to total count
                ],
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}