import React, { useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/contexts/CartContext';
import { motion, useReducedMotion } from 'framer-motion';

interface ProductCardProps {
  name: string;
  price: string;
  description?: string;
  image: string;
  overlayImage?: string;
  isUnavailable?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  description,
  image,
  overlayImage,
  isUnavailable = false,
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizationPrice, setCustomizationPrice] = useState(0);
  const [currentId] = useState(Math.random().toString(36).substr(2, 9));
  // Store initial state for customizations
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'11"' | 'Large'>('11"');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Motion config
  const reduceMotion = useReducedMotion();
  const cardVariants = {
    rest: { y: 0, scale: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    hover: reduceMotion ? { } : { y: -2, scale: 1.01, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { type: 'spring', stiffness: 300, damping: 22 } },
    tap: reduceMotion ? { } : { scale: 0.985, transition: { type: 'spring', stiffness: 400, damping: 30 } },
  } as const;
  const mediaVariants = {
    rest: { scale: 1 },
    hover: reduceMotion ? { } : { scale: 1.03 },
  } as const;
  const buttonVariants = {
    rest: { scale: 1 },
    hover: reduceMotion ? { } : { scale: 1.04 },
    tap: reduceMotion ? { } : { scale: 0.96 },
  } as const;

  const displayName = name?.trim() || 'Item';
  const displayPrice = price || '';
  const hasImage = Boolean(image);
  const basePrice = Number((displayPrice.match(/[0-9]+(?:\.[0-9]{1,2})?/) ?? ["0"])![0]);
  const TOPPING_SURCHARGE = 1.59; // simple flat surcharge per topping (adjust as needed)
  const TOPPING_LIMIT = 7;

  const toppingGroups: { title: string; items: string[] }[] = [
    { title: 'Meats', items: ['Pepperoni', 'Meatballs', 'Ham', 'Chicken'] },
    { title: 'Veggies', items: ['Mushrooms', 'Onions', 'Green Peppers', 'Olives', 'Jalapeño', 'Tomatoes', 'Arugula'] },
    { title: 'Cheese', items: ['Mozzarella', 'Parmesan', 'Vegan Cheese'] },
    { title: 'Sauce', items: ['Red Sauce', 'White Sauce', 'BBQ Sauce'] },
  ];

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const toggleTopping = (name: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      const willSelect = !next[name];
      if (willSelect && selectedCount >= TOPPING_LIMIT) return prev; // enforce limit
      next[name] = willSelect;
      return next;
    });
  };

  const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }> = ({ active, onClick, children, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-full border text-sm transition select-none ${
        active ? 'bg-[#FFF7F2] border-[#C35413] text-[#C35413]' : 'bg-white border-[#D6DADE] text-[#36424e]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );

  const handleAdd = () => {
    const selectedToppings = Object.entries(selected)
      .filter(([_, isSelected]) => isSelected)
      .map(([topping]) => topping);
    
    const extrasTotal = selectedToppings.length * TOPPING_SURCHARGE;
    const itemTotal = (basePrice + extrasTotal) * quantity;

    addItem({
      id: currentId,
      name: displayName,
      price: basePrice + extrasTotal,
      quantity,
      size,
      toppings: selectedToppings,
      specialInstructions,
      image,
    });

    toast.success(`${displayName} added to cart`);
    setOpen(false);
    // Reset form
    setQuantity(1);
    setSize('11"');
    setSelected({});
    setSpecialInstructions('');
  };

  const extrasTotal = selectedCount * TOPPING_SURCHARGE;
  const total = (basePrice + extrasTotal) * quantity;

  const openDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpen(true);
  };

  return (
    // UberEats-like card on mobile (horizontal), classic card on desktop (vertical)
    <motion.article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? openDialog() : null)}
      onClick={openDialog}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      className={`group cursor-pointer border bg-white rounded-2xl border-[#D6DADE] shadow-sm transition-shadow duration-200 overflow-hidden will-change-transform transform-gpu ${
        className
      }`}
    >
      {/* Mobile: horizontal layout */}
      <div className="flex md:hidden gap-4 p-4">
        <motion.div variants={mediaVariants} className="relative shrink-0 w-32 h-24 rounded-xl overflow-hidden will-change-transform transform-gpu">
          {hasImage ? (
            <>
              <img src={image} alt={displayName} className="w-full h-full object-cover" />
              {overlayImage && (
                <img src={overlayImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-muted/40 text-muted-foreground">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          {!isUnavailable && (
            <motion.button
              type="button"
              aria-label={`Add ${name}`}
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              variants={buttonVariants}
              className="absolute bottom-1.5 right-1.5 z-10 grid place-items-center w-9 h-9 rounded-full bg-white border border-[#D6DADE] shadow-md text-[#36424e] transition will-change-transform transform-gpu"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
          {isUnavailable && <div className="absolute inset-0 bg-white/60" />}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-medium text-[#36424e] truncate">{displayName}</h3>
            {displayPrice && <span className="text-sm text-[#6a747f] whitespace-nowrap">{displayPrice}</span>}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-[#6a747f] overflow-hidden max-h-10">{description}</p>
          ) : (
            <p className="mt-1 text-sm text-[#6a747f]">Customize in the next step</p>
          )}
          {isUnavailable && (
            <p className="mt-1 text-sm text-[#6a747f]">Not available at this time</p>
          )}
        </div>
      </div>

      {/* Desktop: vertical card */}
      <div className="hidden md:block">
        {/* Use an aspect-ratio container to prevent any overflow */}
        <motion.div variants={mediaVariants} className="relative w-full aspect-[4/3] overflow-hidden will-change-transform transform-gpu">
          {hasImage ? (
            <>
              <img
                src={image}
                alt={displayName}
                className="absolute inset-0 w-full h-full object-cover block"
              />
              {overlayImage && (
                <img
                  src={overlayImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover block"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-muted/40 text-muted-foreground">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
          {!isUnavailable && (
            <motion.button
              type="button"
              aria-label={`Add ${name}`}
              onClick={(e) => { e.stopPropagation(); setOpen(true); }}
              variants={buttonVariants}
              className="absolute bottom-3 right-3 z-10 grid place-items-center w-11 h-11 rounded-full bg-white border border-[#D6DADE] shadow-md text-[#36424e] transition will-change-transform transform-gpu"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
          {isUnavailable && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center" />
          )}
        </motion.div>

        <div className="px-4 pt-3 pb-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium text-[#36424e]">{displayName}</h3>
            {displayPrice && <span className="text-sm text-[#6a747f] whitespace-nowrap">{displayPrice}</span>}
          </div>
          {description ? (
            <p className="mt-1 text-sm text-[#6a747f]">{description}</p>
          ) : (
            <p className="mt-1 text-sm text-[#6a747f]">Customize in the next step</p>
          )}
          {isUnavailable && (
            <p className="mt-1 text-sm text-[#6a747f]">Not available at this time</p>
          )}
        </div>
      </div>
      {/* Quick Add Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-screen md:max-w-3xl flex flex-col h-[100dvh] md:max-h-[85vh] rounded-none md:rounded-lg p-0 md:p-6">
          <DialogHeader className="px-4 pt-4 md:px-0 md:pt-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{displayName}</span>
              {displayPrice && <span className="text-sm text-muted-foreground">{displayPrice}</span>}
            </DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              <DialogDescription>Choose size and toppings below.</DialogDescription>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-auto pr-0 md:pr-0">
            <div className="px-4 md:px-6 space-y-6">
              {/* Top hero image (Uber-style) */}
              <div className="relative w-full overflow-hidden rounded-lg border bg-muted/40 aspect-[4/3] md:aspect-[16/9]">
                {hasImage ? (
                  <>
                    <img src={image} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
                    {overlayImage && (
                      <img src={overlayImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-5 pb-40 md:pb-6">
                <div>
                  <Label className="text-sm">Size</Label>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Chip active={size === '11"'} onClick={() => setSize('11"')}>11-inch</Chip>
                    <Chip active={size === 'Large'} onClick={() => setSize('Large')}>Large</Chip>
                  </div>
                </div>

                <Separator />

                {toppingGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">{group.title}</Label>
                      <span className="text-xs text-muted-foreground">{selectedCount}/{TOPPING_LIMIT}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((t) => {
                        const checked = !!selected[t];
                        const disabled = !checked && selectedCount >= TOPPING_LIMIT;
                        return (
                          <Chip key={t} active={checked} onClick={() => toggleTopping(t)} disabled={disabled}>
                            {t}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm">Special instructions</Label>
                  <Textarea 
                    placeholder="Add a note"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <span className="w-6 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>+</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>+</Button>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="secondary" className="hidden md:inline-flex" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="flex-1 md:flex-none" onClick={handleAdd}>
                  {`Add to order • $${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
};

export default ProductCard;
