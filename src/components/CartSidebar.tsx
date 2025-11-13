import React, { useState } from 'react';
import { X, Flame, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const CartSidebar: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const { items, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [contactNumber, setContactNumber] = useState('');

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

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
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Your cart is empty</p>
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
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm text-foreground">
                            {item.name}
                          </h4>
                          <span className="text-sm font-semibold text-foreground ml-2 shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Choice of Size: <span className="font-medium">{item.size}</span></p>
                          {item.toppings.length > 0 && (
                            <p>
                              Choose your toppings (${(item.toppings.length * 1.59).toFixed(2)}){' '}
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
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground text-lg"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium pt-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* You May Also Like Section - Optional */}
            <div className="px-6 py-4 border-t">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                You May Also Like
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-xs text-center p-2">
                  <span className="text-muted-foreground">More items</span>
                </div>
              </div>
            </div>

            {/* Contact & Checkout */}
            <div className="px-6 py-4 border-t space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Enter a contact number before proceeding to checkout
                </label>
                <input
                  type="tel"
                  placeholder="555-555-5555"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

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
