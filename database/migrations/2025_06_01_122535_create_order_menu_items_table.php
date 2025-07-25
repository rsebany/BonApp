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
        Schema::create('order_menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('food_orders');
            $table->foreignId('menu_item_id')->constrained();
            $table->integer('qty_ordered');
            $table->decimal('unit_price', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_menu_items');
    }
};
