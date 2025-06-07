<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
     public function index()
    {
        // Return the Inertia view for reports
        return Inertia::render('admin/Reports/analytics', [
        'stats' => [
            'orders_by_status' => [
                'labels' => ['Pending', 'Processing', 'Completed', 'Cancelled'],
                'values' => [10, 20, 50, 5],
            ],
            'monthly_revenue' => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'data' => [1000, 1500, 2000, 1800, 2500, 3000],
            ],
            'total_orders' => 100,
            'total_revenue' => 5000.00,
            'active_restaurants' => 25,
        ],
    ]);

    }
}
