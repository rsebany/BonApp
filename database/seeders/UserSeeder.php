<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use App\Models\User; 
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create test customer
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        // Create test driver
        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Driver',
            'email' => 'driver@example.com',
            'password' => Hash::make('password'),
            'role' => 'driver',
            'email_verified_at' => now(),
        ]);

        // Create additional random users
        User::factory()->count(10)->customer()->create();
        User::factory()->count(5)->driver()->create();
    }
}