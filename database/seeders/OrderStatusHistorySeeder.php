<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderStatusHistory;
use App\Models\FoodOrder;
use App\Models\User;

class OrderStatusHistorySeeder extends Seeder
{
    public function run(): void
    {
        $orders = FoodOrder::pluck('id');
        $users = User::pluck('id');
        foreach (range(1, 100) as $i) {
            OrderStatusHistory::create([
                'order_id' => $orders->random(),
                'status' => 'Delivered',
                'description' => 'Order delivered successfully',
                'updated_by_id' => $users->random(),
            ]);
        }
    }
} 