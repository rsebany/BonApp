<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notifications = [
            [
                'type' => 'order',
                'title' => 'New Order Received',
                'message' => 'Order #1234 has been placed by John Doe',
                'data' => ['order_id' => 1234, 'customer_name' => 'John Doe'],
                'is_read' => false,
                'created_at' => now()->subMinutes(5),
            ],
            [
                'type' => 'user',
                'title' => 'New User Registration',
                'message' => 'Jane Smith has registered as a new customer',
                'data' => ['user_id' => 456, 'user_name' => 'Jane Smith'],
                'is_read' => false,
                'created_at' => now()->subHours(1),
            ],
            [
                'type' => 'restaurant',
                'title' => 'Restaurant Status Update',
                'message' => 'Pizza Palace has updated their menu',
                'data' => ['restaurant_id' => 789, 'restaurant_name' => 'Pizza Palace'],
                'is_read' => true,
                'read_at' => now()->subHours(2),
                'created_at' => now()->subHours(3),
            ],
            [
                'type' => 'system',
                'title' => 'System Maintenance',
                'message' => 'Scheduled maintenance completed successfully',
                'data' => ['maintenance_type' => 'routine'],
                'is_read' => false,
                'created_at' => now()->subHours(4),
            ],
            [
                'type' => 'order',
                'title' => 'Order Delivered',
                'message' => 'Order #1230 has been successfully delivered',
                'data' => ['order_id' => 1230, 'delivery_time' => now()->subMinutes(30)],
                'is_read' => true,
                'read_at' => now()->subMinutes(25),
                'created_at' => now()->subMinutes(30),
            ],
            [
                'type' => 'order',
                'title' => 'Order Cancelled',
                'message' => 'Order #1225 has been cancelled by customer',
                'data' => ['order_id' => 1225, 'cancellation_reason' => 'Customer request'],
                'is_read' => false,
                'created_at' => now()->subHours(6),
            ],
            [
                'type' => 'user',
                'title' => 'Email Verified',
                'message' => 'Mike Johnson has verified their email address',
                'data' => ['user_id' => 789, 'user_name' => 'Mike Johnson'],
                'is_read' => true,
                'read_at' => now()->subHours(8),
                'created_at' => now()->subHours(8),
            ],
            [
                'type' => 'restaurant',
                'title' => 'New Restaurant Added',
                'message' => 'Burger House has been added to the platform',
                'data' => ['restaurant_id' => 999, 'restaurant_name' => 'Burger House'],
                'is_read' => false,
                'created_at' => now()->subHours(12),
            ],
            [
                'type' => 'system',
                'title' => 'Database Backup',
                'message' => 'Daily database backup completed successfully',
                'data' => ['backup_size' => '2.5GB', 'backup_time' => now()],
                'is_read' => true,
                'read_at' => now()->subHours(24),
                'created_at' => now()->subHours(24),
            ],
            [
                'type' => 'order',
                'title' => 'High Value Order',
                'message' => 'Order #1235 has a total value of $150.00',
                'data' => ['order_id' => 1235, 'total_amount' => 150.00],
                'is_read' => false,
                'created_at' => now()->subHours(36),
            ],
            [
                'type' => 'user',
                'title' => 'Driver Registration',
                'message' => 'Alex Wilson has registered as a new driver',
                'data' => ['user_id' => 101, 'user_name' => 'Alex Wilson'],
                'is_read' => true,
                'read_at' => now()->subDays(1),
                'created_at' => now()->subDays(1),
            ],
            [
                'type' => 'restaurant',
                'title' => 'Menu Update',
                'message' => 'Sushi Master has updated their menu with 5 new items',
                'data' => ['restaurant_id' => 555, 'restaurant_name' => 'Sushi Master', 'new_items' => 5],
                'is_read' => false,
                'created_at' => now()->subDays(2),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create($notification);
        }
    }
}
