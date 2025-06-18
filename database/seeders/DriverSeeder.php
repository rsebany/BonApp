<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
use App\Models\User;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = User::where('role', 'driver')->get();
        foreach ($drivers as $user) {
            Driver::factory()->create(['user_id' => $user->id]);
        }
    }
} 