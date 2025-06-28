import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/Context/CartContext';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  restaurant_id: number;
  restaurant_name: string;
  image?: string;
}

interface AddToCartButtonProps {
  item: MenuItem;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ item, className = '' }) => {
  const { addItem, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const currentQuantity = getItemQuantity(item.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      restaurant_id: item.restaurant_id,
      restaurant_name: item.restaurant_name,
      image: item.image,
    });
    
    // Reset the adding state after a short delay
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove from cart
      return;
    }
    
    // Add the difference to cart
    const difference = newQuantity - currentQuantity;
    if (difference > 0) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurant_id: item.restaurant_id,
        restaurant_name: item.restaurant_name,
        image: item.image,
        quantity: difference,
      });
    }
  };

  if (currentQuantity > 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleQuantityChange(currentQuantity - 1)}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="text-sm font-medium w-8 text-center">{currentQuantity}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleQuantityChange(currentQuantity + 1)}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`bg-emerald-600 hover:bg-emerald-700 text-white ${className}`}
      size="sm"
    >
      {isAdding ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Adding...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </div>
      )}
    </Button>
  );
}; 