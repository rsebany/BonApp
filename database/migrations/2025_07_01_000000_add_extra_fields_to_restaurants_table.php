<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->float('rating')->nullable()->default(0);
            $table->string('price_range')->nullable();
            $table->string('image')->nullable();
            $table->json('tags')->nullable();
            $table->string('featured_dish')->nullable();
        });
    }

    public function down()
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['rating', 'price_range', 'image', 'tags', 'featured_dish']);
        });
    }
}; 