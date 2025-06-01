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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('driver_license_number', 50);
            $table->string('vehicle_type', 50);
            $table->string('vehicle_make', 50);
            $table->string('vehicle_model', 50);
            $table->string('vehicle_year', 4);
            $table->string('vehicle_color', 30);
            $table->string('license_plate', 20);
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_available')->default(true);
            $table->decimal('current_lat', 10, 8)->nullable();
            $table->decimal('current_lng', 11, 8)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
