<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Http\Resources\MenuItemResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Services\MenuItemService;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    use AuthorizesRequests;
    public function __construct(
        protected MenuItemService $menuItemService
    ) {}

    public function index(Restaurant $restaurant)
    {
        $this->authorize('viewAny', [MenuItem::class, $restaurant]);
        
        return Inertia::render('MenuItems/Index', [
            'restaurant' => $restaurant,
            'menuItems' => $restaurant->menuItems,
            'canCreate' => auth()->user()->can('create', [MenuItem::class, $restaurant])
        ]);
    }

    public function create(Restaurant $restaurant)
    {
        $this->authorize('create', [MenuItem::class, $restaurant]);
        
        return Inertia::render('MenuItems/Create', [
            'restaurant' => $restaurant
        ]);
    }

    public function store(StoreMenuItemRequest $request, Restaurant $restaurant)
    {
        $menuItem = $this->menuItemService->createMenuItem(
            auth()->user(),
            $restaurant,
            $request->validated()
        );
        
        return redirect()->route('restaurants.menu-items.show', [$restaurant, $menuItem])
            ->with('success', 'Menu item créé avec succès');
    }

    public function show(Restaurant $restaurant, MenuItem $menuItem)
    {
        $this->authorize('view', $menuItem);
        
        return Inertia::render('MenuItems/Show', [
            'restaurant' => $restaurant,
            'menuItem' => $menuItem,
            'canUpdate' => auth()->user()->can('update', $menuItem),
            'canDelete' => auth()->user()->can('delete', $menuItem)
        ]);
    }

    public function edit(Restaurant $restaurant, MenuItem $menuItem)
    {
        $this->authorize('update', $menuItem);
        
        return Inertia::render('MenuItems/Edit', [
            'restaurant' => $restaurant,
            'menuItem' => $menuItem
        ]);
    }

    public function update(UpdateMenuItemRequest $request, Restaurant $restaurant, MenuItem $menuItem)
    {
        $this->menuItemService->updateMenuItem(
            auth()->user(),
            $menuItem,
            $request->validated()
        );
        
        return redirect()->route('restaurants.menu-items.show', [$restaurant, $menuItem])
            ->with('success', 'Menu item mis à jour avec succès');
    }

    public function destroy(Restaurant $restaurant, MenuItem $menuItem)
    {
        $this->authorize('delete', $menuItem);
        
        $this->menuItemService->deleteMenuItem(auth()->user(), $menuItem);
        
        return redirect()->route('restaurants.menu-items.index', $restaurant)
            ->with('success', 'Menu item supprimé avec succès');
    }

   public function getMenuItems(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'required|integer|exists:restaurants,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()->first()
            ], 400);
        }

        // Get menu items
        $menuItems = MenuItem::where('restaurant_id', $request->restaurant_id)
            ->select(['id', 'item_name', 'price', 'description', 'restaurant_id'])
            ->orderBy('item_name')
            ->get();

        return response()->json([
            'data' => MenuItemResource::collection($menuItems)
        ]);
    }
}
