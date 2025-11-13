import React from 'react';

interface PriceDisplayProps {
  price: number;
  variant?: 'normal' | 'large' | 'small';
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  variant = 'normal',
  className = ''
}) => {
  const sizes = {
    normal: 'text-base font-semibold',
    large: 'text-lg font-bold',
    small: 'text-sm font-medium'
  };

  return (
    <span className={`text-foreground ${sizes[variant]} ${className}`}>
      ${price.toFixed(2)}
    </span>
  );
};

export default PriceDisplay;