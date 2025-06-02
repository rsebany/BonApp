<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('food_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('restaurant_id')->constrained();
            $table->foreignId('customer_address_id')->constrained('customer_addresses');
            $table->foreignId('order_status_id')->constrained('order_statuses');
            $table->foreignId('assigned_driver_id')->nullable()->constrained('drivers');
            $table->dateTime('order_date_time');
            $table->dateTime('requested_delivery_date_time')->nullable();
            $table->decimal('delivery_fee', 8, 2);
            $table->decimal('total_amount', 10, 2);
            $table->tinyInteger('cust_driver_rating')->nullable();
            $table->tinyInteger('cust_restaurant_rating')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_orders');
    }
};
