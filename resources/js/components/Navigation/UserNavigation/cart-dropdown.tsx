import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/Context/CartContext';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export const CartDropdown = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2 rounded-full hover:bg-gray-100">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          {state.itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {state.itemCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 mt-2 z-[60]" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Your Cart</span>
          <span className="text-sm text-gray-500">{state.itemCount} items</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {state.items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add some delicious items to get started!</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{item.restaurant_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-auto text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="p-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-emerald-600">
                  ${state.total.toFixed(2)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  asChild
                >
                  <Link href={route('orders.create')}>
                    Checkout
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 