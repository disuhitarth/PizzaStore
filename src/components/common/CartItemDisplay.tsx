import React from 'react';
import { CartItem } from '@/contexts/CartContext';
import { QuantityControl, PriceDisplay } from '@/components/common';
import { pizzaConfig } from '@/pizzaConfig';

interface CartItemDisplayProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
}

const CartItemDisplay: React.FC<CartItemDisplayProps> = ({ item, onUpdateQuantity }) => {
  const isMakeYourOwn = item.name.startsWith(pizzaConfig.pizza.name);

  return (
    <div className="flex gap-4 pb-4 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
          <PriceDisplay 
            price={item.price * item.quantity} 
            variant="small"
            className="ml-2 shrink-0"
          />
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          {!isMakeYourOwn && (
            <p>
              Choice of Size: <span className="font-medium">{item.size}</span>
            </p>
          )}
          {item.toppings.length > 0 && (
            <p>
              Choose your toppings (${(item.toppings.length * 1.59).toFixed(2)}) 
              <span className="block mt-1 text-muted-foreground">
                {item.toppings.join(', ')}
              </span>
            </p>
          )}
          {item.specialInstructions && (
            <p className="text-muted-foreground italic">
              Note: {item.specialInstructions}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-start gap-2 pt-1">
        <QuantityControl
          quantity={item.quantity}
          onQuantityChange={(qty) => onUpdateQuantity(item.id, qty)}
          compact
        />
      </div>
    </div>
  );
};

export default CartItemDisplay;