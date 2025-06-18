<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderStatus;

class OrderStatusSeeder extends Seeder
{
    public function run(): void
    {
        OrderStatus::factory()->pending()->create();
        OrderStatus::factory()->confirmed()->create();
        OrderStatus::factory()->preparing()->create();
        OrderStatus::factory()->ready()->create();
        OrderStatus::factory()->outForDelivery()->create();
        OrderStatus::factory()->delivered()->create();
        OrderStatus::factory()->cancelled()->create();
    }
} 