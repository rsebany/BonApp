<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\User;
use App\Models\DeliveryDriver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DeliveryDriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drivers = [
            [
                'name' => 'John Smith',
                'email' => 'john.driver@example.com',
                'phone' => '+1234567890',
                'vehicle_type' => 'motorcycle',
                'license_plate' => 'ABC123',
                'is_active' => true,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.driver@example.com',
                'phone' => '+1234567891',
                'vehicle_type' => 'car',
                'license_plate' => 'XYZ789',
                'is_active' => true,
            ],
            [
                'name' => 'Mike Wilson',
                'email' => 'mike.driver@example.com',
                'phone' => '+1234567892',
                'vehicle_type' => 'bicycle',
                'license_plate' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Lisa Brown',
                'email' => 'lisa.driver@example.com',
                'phone' => '+1234567893',
                'vehicle_type' => 'scooter',
                'license_plate' => 'DEF456',
                'is_active' => false,
            ],
            [
                'name' => 'David Garcia',
                'email' => 'david.driver@example.com',
                'phone' => '+1234567894',
                'vehicle_type' => 'car',
                'license_plate' => 'GHI789',
                'is_active' => true,
            ],
        ];

        foreach ($drivers as $driverData) {
            // Create user account for driver
            $user = User::create([
                'name' => $driverData['name'],
                'email' => $driverData['email'],
                'password' => Hash::make('password123'),
                'role' => 'driver',
                'email_verified_at' => now(),
            ]);

            // Create driver profile
            Driver::create([
                'user_id' => $user->id,
                'phone' => $driverData['phone'],
                'vehicle_type' => $driverData['vehicle_type'],
                'license_plate' => $driverData['license_plate'],
                'is_active' => $driverData['is_active'],
                'status' => $driverData['is_active'] ? 'available' : 'offline',
                'rating' => rand(40, 50) / 10, // Random rating 4.0-5.0
                'total_deliveries' => rand(50, 500),
            ]);
        }

        $this->command->info('Created ' . count($drivers) . ' delivery drivers');
    }
}