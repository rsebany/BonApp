<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Requests\RateOrderRequest;
use App\Models\FoodOrder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Restaurant;
use App\Services\OrderService;
use Inertia\Inertia;

class OrderController extends Controller
{
    use AuthorizesRequests;
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function index()
    {
        $orders = $this->orderService->getCustomerOrders(auth()->user());
        
        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'canCreate' => auth()->user()->can('create', FoodOrder::class)
        ]);
    }

    public function create()
    {
        $this->authorize('create', FoodOrder::class);
        
        return Inertia::render('Orders/Create', [
            'restaurants' => Restaurant::with('menuItems')->get(),
            'addresses' => auth()->user()->customerAddresses()->with('address')->get()
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $order = $this->orderService->createOrder(
            auth()->user(),
            $request->validated()
        );
        
        return redirect()->route('orders.show', $order)
            ->with('success', 'Commande passée avec succès');
    }

    public function show(FoodOrder $order)
    {
        $this->authorize('view', $order);
        
        return Inertia::render('Orders/Show', [
            'order' => $order->load([
                'restaurant', 
                'status', 
                'driver.user', 
                'orderItems.menuItem',
                'customerAddress.address'
            ]),
            'canCancel' => auth()->user()->can('delete', $order),
            'canRate' => auth()->user()->can('rate', $order)
        ]);
    }

    public function update(UpdateOrderRequest $request, FoodOrder $order)
    {
        $this->orderService->updateOrderStatus(
            auth()->user(),
            $order,
            $request->validated()['status_id']
        );
        
        return redirect()->back()
            ->with('success', 'Statut de la commande mis à jour');
    }

    public function destroy(FoodOrder $order)
    {
        $this->authorize('delete', $order);
        
        $this->orderService->cancelOrder(auth()->user(), $order);
        
        return redirect()->route('orders.index')
            ->with('success', 'Commande annulée avec succès');
    }

    public function rate(RateOrderRequest $request, FoodOrder $order)
    {
        $this->orderService->rateOrder(
            auth()->user(),
            $order,
            $request->validated()
        );
        
        return redirect()->back()
            ->with('success', 'Merci pour votre évaluation');
    }
}