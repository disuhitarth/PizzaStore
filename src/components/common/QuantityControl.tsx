import React from 'react';
import { Button } from '@/components/ui/button';

interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
  compact?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity = Infinity,
  compact = false
}) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={quantity <= minQuantity}
          className="h-8 w-8 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="h-8 w-8 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleDecrease}
        disabled={quantity <= minQuantity}
      >
        -
      </Button>
      <span className="w-6 text-center">{quantity}</span>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityControl;