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
        Schema::table('restaurants', function (Blueprint $table) {
            $table->string('image_url')->nullable();
            $table->string('special_offer')->nullable();
            $table->boolean('is_open')->default(false);
            $table->decimal('min_order', 8, 2)->nullable();
            $table->decimal('distance_km', 8, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['image_url', 'special_offer', 'is_open', 'min_order', 'distance_km']);
        });
    }
};
