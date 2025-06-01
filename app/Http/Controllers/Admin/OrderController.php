<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\FoodOrder;

use App\Services\OrderService;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
        //
    }

    public function index()
    {
        $orders = $this->orderService->getAllOrders();
        
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show(FoodOrder $order)
    {
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load([
                'restaurant', 
                'status', 
                'driver.user', 
                'orderItems.menuItem',
                'customer.user',
                'customerAddress.address'
            ])
        ]);
    }

    public function update(UpdateOrderRequest $request, FoodOrder $order)
    {
        $this->orderService->updateOrderStatus(
            auth()->user(),
            $order,
            $request->validated()['status_id']
        );
        
        if ($request->has('driver_id')) {
            $this->orderService->assignDriver(
                auth()->user(),
                $order,
                $request->validated()['driver_id']
            );
        }
        
        return redirect()->back()
            ->with('success', 'Commande mise à jour avec succès');
    }
}
