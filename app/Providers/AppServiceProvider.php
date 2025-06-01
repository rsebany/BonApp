<?php

namespace App\Providers;

use App\Models\CustomerAddress;
use App\Models\FoodOrder;
use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Policies\AddressPolicy;
use App\Policies\MenuItemPolicy;
use App\Policies\OrderPolicy;
use App\Policies\RestaurantPolicy;
use App\Services\AddressService;
use App\Services\MenuItemService;
use App\Services\OrderService;
use App\Services\RestaurantService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(RestaurantService::class);
        $this->app->singleton(MenuItemService::class);
        $this->app->singleton(OrderService::class);
        $this->app->singleton(AddressService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enregistrement des policies
        Gate::policy(Restaurant::class, RestaurantPolicy::class);
        Gate::policy(MenuItem::class, MenuItemPolicy::class);
        Gate::policy(FoodOrder::class, OrderPolicy::class);
        Gate::policy(CustomerAddress::class, AddressPolicy::class);
    }
}
