<?php

namespace Database\Seeders;

use App\Models\OrderStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Pending',
                'color' => 'yellow',
                'sort_order' => 1,
                'is_default' => true,
                'description' => 'Order has been placed but not yet processed'
            ],
            [
                'name' => 'Processing',
                'color' => 'blue',
                'sort_order' => 2,
                'description' => 'Restaurant is preparing the order'
            ],
            [
                'name' => 'Ready for Pickup',
                'color' => 'green',
                'sort_order' => 3,
                'description' => 'Order is ready for driver pickup'
            ],
            [
                'name' => 'On the Way',
                'color' => 'purple',
                'sort_order' => 4,
                'description' => 'Driver is delivering the order'
            ],
            [
                'name' => 'Delivered',
                'color' => 'green',
                'sort_order' => 5,
                'description' => 'Order has been delivered'
            ],
            [
                'name' => 'Cancelled',
                'color' => 'red',
                'sort_order' => 6,
                'description' => 'Order has been cancelled'
            ],
            [
                'name' => 'Failed',
                'color' => 'red',
                'sort_order' => 7,
                'description' => 'Order delivery failed'
            ]
        ];

        foreach ($statuses as $status) {
            OrderStatus::create($status);
        }
    }
}
