<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Restaurant::all()->each(function ($restaurant) {
            \App\Models\MenuItem::factory(7)->create(['restaurant_id' => $restaurant->id]);
        });
    }
} 