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
        Schema::create('order_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('status_name');
            $table->timestamps();
        });

        // Seed default statuses
        \App\Models\OrderStatus::insert([
            ['status_name' => 'Pending'],
            ['status_name' => 'Processing'],
            ['status_name' => 'Out for Delivery'],
            ['status_name' => 'Delivered'],
            ['status_name' => 'Cancelled'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_statuses');
    }
};
