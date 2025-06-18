<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FoodOrder;

class FoodOrderSeeder extends Seeder
{
    public function run(): void
    {
        FoodOrder::factory(50)->create();
    }
} 