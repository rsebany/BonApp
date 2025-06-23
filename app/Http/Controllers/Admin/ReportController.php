<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use App\Models\MenuItem;
use App\Models\OrderStatus;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Date range handling (default to last 30 days)
        $dateFrom = $request->input('date_from', Carbon::now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', Carbon::now()->format('Y-m-d'));

        // Get the completed status ID first with null check
        $completedStatus = OrderStatus::where('name', 'Delivered')->first();
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

    public function sales(Request $request)
    {
        // Date range handling (default to last 30 days)
        $dateFrom = $request->input('date_from', Carbon::now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', Carbon::now()->format('Y-m-d'));

        // Get the completed status ID first with null check
        $completedStatus = OrderStatus::where('name', 'Delivered')->first();
        $completedStatusId = $completedStatus ? $completedStatus->id : null;

        // Base query for completed orders in date range
        $query = FoodOrder::query();

        if ($completedStatusId) {
            $query->where('order_status_id', $completedStatusId);
        } else {
            // If no 'Delivered' status is found, we can assume no sales data will be available
            // so we can return empty results to avoid query errors.
            return Inertia::render('admin/Reports/sales', [
                'reports' => [
                    'total_sales' => 0,
                    'average_order_value' => 0,
                    'total_transactions' => 0,
                    'sales_over_time' => [],
                    'sales_by_restaurant' => [],
                    'top_selling_menu_items' => [],
                ],
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                ],
            ]);
        }
        
        $query->whereBetween('created_at', [$dateFrom, $dateTo]);

        // 1. Total Sales
        $totalSales = (clone $query)->sum('total_amount');

        // 2. Total Transactions
        $totalTransactions = (clone $query)->count();

        // 3. Average Order Value
        $averageOrderValue = $totalTransactions > 0 ? $totalSales / $totalTransactions : 0;

        // 4. Sales over time (daily)
        $salesOverTime = (clone $query)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as sales')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return ['date' => Carbon::parse($item->date)->format('M d'), 'sales' => (float)$item->sales];
            });

        // 5. Sales by restaurant (top 5)
        $salesByRestaurant = Restaurant::join('food_orders', 'restaurants.id', '=', 'food_orders.restaurant_id')
            ->whereBetween('food_orders.created_at', [$dateFrom, $dateTo])
            ->where('food_orders.order_status_id', $completedStatusId)
            ->selectRaw('restaurants.restaurant_name, SUM(food_orders.total_amount) as total_sales')
            ->groupBy('restaurants.id', 'restaurants.restaurant_name')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return ['name' => $item->restaurant_name, 'sales' => (float)$item->total_sales];
            });

        // 6. Top selling menu items (top 5)
        $topMenuItems = MenuItem::join('order_menu_items', 'menu_items.id', '=', 'order_menu_items.menu_item_id')
            ->join('food_orders', 'order_menu_items.order_id', '=', 'food_orders.id')
            ->whereBetween('food_orders.created_at', [$dateFrom, $dateTo])
            ->where('food_orders.order_status_id', $completedStatusId)
            ->selectRaw('menu_items.item_name, SUM(order_menu_items.qty_ordered * order_menu_items.unit_price) as total_sales')
            ->groupBy('menu_items.id', 'menu_items.item_name')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return ['name' => $item->item_name, 'sales' => (float)$item->total_sales];
            });

        return Inertia::render('admin/Reports/sales', [
            'reports' => [
                'total_sales' => (float)$totalSales,
                'average_order_value' => (float)$averageOrderValue,
                'total_transactions' => $totalTransactions,
                'sales_over_time' => $salesOverTime,
                'sales_by_restaurant' => $salesByRestaurant,
                'top_selling_menu_items' => $topMenuItems,
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->query('type', 'analytics');
        $dateFrom = $request->query('date_from', Carbon::now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->query('date_to', Carbon::now()->format('Y-m-d'));
        $completedStatus = OrderStatus::where('name', 'Delivered')->first();
        $completedStatusId = $completedStatus ? $completedStatus->id : null;

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename={$type}_report_{$dateFrom}_to_{$dateTo}.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($type, $dateFrom, $dateTo, $completedStatusId) {
            $file = fopen('php://output', 'w');

            if ($type === 'analytics') {
                // Headers
                fputcsv($file, ['Metric', 'Value']);
                // Data
                $totalOrders = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo])->count();
                fputcsv($file, ['Total Orders', $totalOrders]);

                $completedOrdersQuery = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo]);
                if ($completedStatusId) {
                    $completedOrdersQuery->where('order_status_id', $completedStatusId);
                }
                $completedOrders = $completedOrdersQuery->count();
                fputcsv($file, ['Completed Orders', $completedOrders]);
                
                $totalRevenueQuery = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo]);
                if ($completedStatusId) {
                    $totalRevenueQuery->where('order_status_id', $completedStatusId);
                }
                $totalRevenue = $totalRevenueQuery->sum('total_amount');
                fputcsv($file, ['Total Revenue', $totalRevenue]);

                $restaurantsCount = Restaurant::count();
                fputcsv($file, ['Active Restaurants', $restaurantsCount]);

                fputcsv($file, []); // Spacer
                fputcsv($file, ['Orders by Status']);
                fputcsv($file, ['Status', 'Count']);
                $ordersByStatus = OrderStatus::withCount(['orders' => fn($q) => $q->whereBetween('created_at', [$dateFrom, $dateTo])])->get();
                foreach ($ordersByStatus as $status) {
                    fputcsv($file, [$status->name, $status->orders_count]);
                }


            } elseif ($type === 'sales') {
                $query = FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo]);
                if ($completedStatusId) {
                    $query->where('order_status_id', $completedStatusId);
                }
                $totalSales = (clone $query)->sum('total_amount');
                $totalTransactions = (clone $query)->count();
                $averageOrderValue = $totalTransactions > 0 ? $totalSales / $totalTransactions : 0;

                fputcsv($file, ['Metric', 'Value']);
                fputcsv($file, ['Total Sales', $totalSales]);
                fputcsv($file, ['Average Order Value', $averageOrderValue]);
                fputcsv($file, ['Total Transactions', $totalTransactions]);
                
                fputcsv($file, []); // Spacer
                fputcsv($file, ['Sales Over Time']);
                fputcsv($file, ['Date', 'Sales']);
                $salesOverTime = (clone $query)->selectRaw('DATE(created_at) as date, SUM(total_amount) as sales')->groupBy('date')->orderBy('date')->get();
                foreach ($salesOverTime as $sale) {
                    fputcsv($file, [$sale->date, $sale->sales]);
                }
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}