import React, { useState } from 'react';
import { X, Flame, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CartItemDisplay, ContactInput } from '@/components/common';

const CartSidebar: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const { items, addItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [contactNumber, setContactNumber] = useState('');

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const suggestions = [
    {
      id: 'suggestion-creamy-garlic',
      name: 'Creamy Garlic',
      price: 1.49,
      size: 'Dip',
      image:
        'https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Ff468cd8bcc9f4b8988ac867690c9aadb',
    },
    {
      id: 'suggestion-591ml-pepsi',
      name: '591 ML BTL Pepsi',
      price: 2.99,
      size: '591 ml bottle',
      image:
        'https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Ff4ad7732db884bb893e8e3c6e554dcff',
    },
  ] as const;

  const handleAddSuggestion = (suggestion: (typeof suggestions)[number]) => {
    addItem({
      id: `${suggestion.id}-${Date.now()}`,
      name: suggestion.name,
      price: suggestion.price,
      quantity: 1,
      size: suggestion.size,
      toppings: [],
      specialInstructions: '',
      image: suggestion.image,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full md:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Your Order ({totalItems})</SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center text-muted-foreground">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl">
              🛒
            </div>
            <p className="text-base font-medium text-foreground">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              Start your order by choosing a pizza or special from the menu.
            </p>
            <Button
              className="mt-4 rounded-full px-6"
              variant="default"
              onClick={() => {
                onOpenChange(false);
                if (typeof window !== 'undefined') {
                  const target = document.querySelector('[data-start-order="true"]') as HTMLElement | null;
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
            >
              Start your order
            </Button>
          </div>
        ) : (
          <>
            {/* Flames Section */}
            <div className="px-6 py-4 bg-muted/50">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                <Flame className="w-4 h-4 inline mr-2 text-orange-500" />
                You have 0 Flames
              </p>
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <p className="font-semibold text-sm">10 bonus Flames</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-orange-500 font-medium cursor-pointer hover:underline">
                        Sign up
                      </span>{' '}
                      to apply this reward
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Your Items
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemDisplay
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* You May Also Like Section */}
            <div className="px-6 py-4 border-t">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                You May Also Like
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="flex items-center gap-3 p-2 rounded-lg border bg-white hover:bg-muted/60 text-left transition"
                  >
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={suggestion.image}
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {suggestion.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {suggestion.size}
                      </p>
                      <p className="text-xs font-semibold mt-1">
                        {formatPrice(suggestion.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Add a drink and creamy garlic to make it a combo.
              </p>
            </div>

            {/* Contact & Checkout */}
            <div className="px-6 py-4 border-t space-y-3">
              <ContactInput
                value={contactNumber}
                onChange={setContactNumber}
              />

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Request utensils, etc.</span>
                <input
                  type="checkbox"
                  className="ml-auto w-4 h-4"
                />
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please <a href="#" className="text-primary underline">select a location</a> to continue.
                </p>
              </div>

              <Button
                disabled={totalItems === 0 || !contactNumber}
                className="w-full bg-black hover:bg-black/90 text-white h-12 text-base font-semibold"
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
