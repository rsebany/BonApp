<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderMenuItem;

class OrderMenuItemSeeder extends Seeder
{
    public function run(): void
    {
        OrderMenuItem::factory(200)->create();
    }
} 