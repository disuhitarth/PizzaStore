import React, { useState } from 'react';
import { X, Flame, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CartItemDisplay, ContactInput } from '@/components/common';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';

const CartSidebar: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const { items, addItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const [contactNumber, setContactNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    street: '',
    unit: '',
    city: '',
    postalCode: '',
    instructions: '',
  });
  const navigate = useNavigate();
  const {
    serviceType,
    setServiceType,
    selectedStore,
    isLocating,
    locationError,
    locateStores,
    userLocationLabel,
  } = useStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const isDeliveryAddressRequired = serviceType === 'delivery';
  const isDeliveryAddressValid = !isDeliveryAddressRequired || Boolean(
    deliveryAddress.street &&
      deliveryAddress.city &&
      deliveryAddress.postalCode,
  );

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

              {serviceType === 'delivery' && (
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">Delivery address</span>
                    {userLocationLabel && (
                      <span className="text-[11px] text-muted-foreground truncate max-w-[180px] text-right">
                        Based on your area: {userLocationLabel}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full name (optional)"
                    value={deliveryAddress.name}
                    onChange={(e) =>
                      setDeliveryAddress((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Street address"
                    value={deliveryAddress.street}
                    onChange={(e) =>
                      setDeliveryAddress((prev) => ({ ...prev, street: e.target.value }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Apt / Unit (optional)"
                      value={deliveryAddress.unit}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, unit: e.target.value }))
                      }
                    />
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Postal / ZIP code"
                    value={deliveryAddress.postalCode}
                    onChange={(e) =>
                      setDeliveryAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                    }
                  />
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-y"
                    placeholder="Delivery notes (gate code, buzzer, etc.)"
                    value={deliveryAddress.instructions}
                    onChange={(e) =>
                      setDeliveryAddress((prev) => ({ ...prev, instructions: e.target.value }))
                    }
                  />
                  {!isDeliveryAddressValid && (
                    <p className="text-[11px] text-destructive">
                      Please enter your street, city, and postal / ZIP code for delivery.
                    </p>
                  )}
                </div>
              )}

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
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground">Order type</span>
                    <div className="inline-flex items-center rounded-full border border-[#D6DADE] bg-[#F9FAFB] p-0.5 text-[11px] font-medium text-[#374151]">
                      <button
                        type="button"
                        onClick={() => setServiceType('pickup')}
                        className={`px-2.5 py-1 rounded-full transition ${
                          serviceType === 'pickup'
                            ? 'bg-white shadow-sm text-[#111827]'
                            : 'text-[#6B7280] hover:bg-white'
                        }`}
                      >
                        Pickup
                      </button>
                      <button
                        type="button"
                        onClick={() => setServiceType('delivery')}
                        className={`px-2.5 py-1 rounded-full transition ${
                          serviceType === 'delivery'
                            ? 'bg-white shadow-sm text-[#111827]'
                            : 'text-[#6B7280] hover:bg-white'
                        }`}
                      >
                        Delivery
                      </button>
                    </div>
                  </div>
                  <p>
                    {selectedStore ? (
                      <>
                        {serviceType === 'pickup'
                          ? `Pickup at ${selectedStore.StoreName} (${selectedStore.City})${
                              userLocationLabel ? ` · Your location: ${userLocationLabel}.` : '.'
                            }`
                          : `Delivering from ${selectedStore.StoreName}${
                              userLocationLabel ? ` · Your area: ${userLocationLabel}` : ''
                            }. We'll use the delivery address you enter below.`}{' '}
                        <a href="/locations" className="text-primary underline">
                          Change store
                        </a>
                        .
                      </>
                    ) : isLocating ? (
                      <>Finding your nearest store…</>
                    ) : locationError ? (
                      <>
                        We couldn&apos;t detect your location.{" "}
                        <button
                          type="button"
                          onClick={() => locateStores()}
                          className="text-primary underline"
                        >
                          Try again
                        </button>
                        .
                      </>
                    ) : (
                      <>
                        We&apos;ll use your nearest store based on your location.{" "}
                        <button
                          type="button"
                          onClick={() => locateStores()}
                          className="text-primary underline"
                        >
                          Use my location
                        </button>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>

              <Button
                disabled={
                  totalItems === 0 ||
                  !contactNumber ||
                  !selectedStore ||
                  isLocating ||
                  !isDeliveryAddressValid
                }
                className="w-full bg-black hover:bg-black/90 text-white h-12 text-base font-semibold"
                onClick={() => {
                  navigate('/order-status', {
                    state: {
                      deliveryAddress: serviceType === 'delivery' ? deliveryAddress : null,
                      contactNumber,
                    },
                  });
                  onOpenChange(false);
                }}
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
