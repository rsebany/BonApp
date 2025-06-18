<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->admin()->count(3)->create();
        User::factory()->driver()->count(10)->create();
        User::factory()->customer()->count(30)->create();
    }
} 