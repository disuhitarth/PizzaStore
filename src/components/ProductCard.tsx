import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/contexts/CartContext';
import { motion, useReducedMotion } from 'framer-motion';
import { Chip, QuantityControl, ToppingGroup } from '@/components/common';
import { pizzaConfig } from '@/pizzaConfig';

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
  const pizzaCfg = pizzaConfig.pizza;
  // Treat any variant like "Make Your Own (Small)" as Make Your Own
  const isMakeYourOwn = name.startsWith(pizzaCfg.name);
  const crustCfg = pizzaCfg.customization.crust;
  const sauceCfg = pizzaCfg.customization.sauce;
  const pizzaOptionsCfg = pizzaCfg.customization.pizzaOptions;
  const toppingsCfg = pizzaCfg.customization.toppings;

  const [open, setOpen] = useState(false);
  const { addItem } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizationPrice, setCustomizationPrice] = useState(0);
  const [currentId] = useState(Math.random().toString(36).substr(2, 9));
  // Store initial state for customizations
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'11"' | 'Large'>('11"');

  // Crust (single choice)
  const [crust, setCrust] = useState<string>(() => {
    if (isMakeYourOwn) {
      const defaultOpt = crustCfg.options.find((o) => o.id === crustCfg.default);
      return defaultOpt?.name ?? 'Regular Crust';
    }
    return 'Regular';
  });
  const [crustOpen, setCrustOpen] = useState(true);
  const crustOptions: string[] = isMakeYourOwn
    ? crustCfg.options.map((o) =>
        o.price && o.price > 0 ? `${o.name} (+$${o.price.toFixed(2)})` : o.name
      )
    : ['Regular', 'Thin', 'Thick', 'Whole Wheat'];

  // Sauce (single choice)
  const [sauce, setSauce] = useState<string>(() => {
    if (isMakeYourOwn) {
      const defaultOpt = sauceCfg.options.find((o) => o.id === sauceCfg.default);
      return defaultOpt?.name ?? 'Regular Sauce';
    }
    return 'Regular Sauce';
  });
  const [sauceOpen, setSauceOpen] = useState(true);
  const sauceOptions: string[] = isMakeYourOwn
    ? sauceCfg.options.map((o) =>
        o.price && o.price > 0 ? `${o.name} (+$${o.price.toFixed(2)})` : o.name
      )
    : ['Regular Sauce', 'Easy Sauce', 'No Sauce', 'Extra Sauce'];

  // Pizza options (multiple choice, optional)
  const [pizzaOptionsSelected, setPizzaOptionsSelected] = useState<Record<string, boolean>>({});

  // "More Options" (only for Make Your Own)
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(isMakeYourOwn);
  const [bakeOption, setBakeOption] = useState<'Normal Bake' | 'Well Done'>('Normal Bake');
  const [cheeseAmount, setCheeseAmount] = useState<'No Cheese' | 'Light Cheese' | 'Cheese'>('Cheese');
  const [sauceAmount, setSauceAmount] = useState<'No Sauce' | 'Light Sauce' | 'Normal Sauce' | 'Extra Sauce'>(
    'Normal Sauce'
  );
  const [cutOption, setCutOption] = useState<'No Cut' | 'Standard Cut'>('Standard Cut');

  // Toppings selection
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

  const defaultToppingGroups: { title: string; items: string[] }[] = [
    { title: 'Meats', items: ['Pepperoni', 'Meatballs', 'Ham', 'Chicken'] },
    { title: 'Veggies', items: ['Mushrooms', 'Onions', 'Green Peppers', 'Olives', 'Jalapeño', 'Tomatoes', 'Arugula'] },
    { title: 'Cheese', items: ['Mozzarella', 'Parmesan', 'Vegan Cheese'] },
    { title: 'Sauce', items: ['Red Sauce', 'White Sauce', 'BBQ Sauce'] },
  ];

  const makeYourOwnToppingGroups: { title: string; items: string[] }[] = [
    {
      title: toppingsCfg.categories.meat.displayName,
      items: toppingsCfg.categories.meat.items.map((i) => i.name),
    },
    {
      title: toppingsCfg.categories.halal.displayName,
      items: toppingsCfg.categories.halal.items.map((i) => i.name),
    },
    {
      title: toppingsCfg.categories.veggie.displayName,
      items: toppingsCfg.categories.veggie.items.map((i) => i.name),
    },
    {
      title: toppingsCfg.categories.cheese.displayName,
      items: toppingsCfg.categories.cheese.items.map((i) => i.name),
    },
    {
      title: toppingsCfg.categories.free.displayName,
      items: toppingsCfg.categories.free.items.map((i) => i.name),
    },
  ];

  const toppingGroups: { title: string; items: string[] }[] = isMakeYourOwn
    ? makeYourOwnToppingGroups
    : defaultToppingGroups;

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

  const resetState = () => {
    setQuantity(1);
    setSize('11"');
    setCrust(() => {
      if (isMakeYourOwn) {
        const defaultOpt = crustCfg.options.find((o) => o.id === crustCfg.default);
        return defaultOpt?.name ?? 'Regular Crust';
      }
      return 'Regular';
    });
    setSauce(() => {
      if (isMakeYourOwn) {
        const defaultOpt = sauceCfg.options.find((o) => o.id === sauceCfg.default);
        return defaultOpt?.name ?? 'Regular Sauce';
      }
      return 'Regular Sauce';
    });
    setPizzaOptionsSelected({});
    setMoreOptionsOpen(isMakeYourOwn);
    setBakeOption('Normal Bake');
    setCheeseAmount('Cheese');
    setSauceAmount('Normal Sauce');
    setCutOption('Standard Cut');
    setSelected({});
    setSpecialInstructions('');
  };

  const handleAdd = () => {
    const selectedToppings = Object.entries(selected)
      .filter(([_, isSelected]) => isSelected)
      .map(([topping]) => topping);

    const selectedPizzaOptions = Object.entries(pizzaOptionsSelected)
      .filter(([_, isSelected]) => isSelected)
      .map(([opt]) => opt);

    const extrasTotal = selectedToppings.length * TOPPING_SURCHARGE;
    const itemTotal = (basePrice + extrasTotal) * quantity;

    const crustNote = crust ? `Crust: ${crust}` : '';
    const sauceNote = sauce ? `Sauce: ${sauce}` : '';
    const pizzaOptionsNote = selectedPizzaOptions.length
      ? `Pizza options: ${selectedPizzaOptions.join(', ')}`
      : '';
    const bakeNote = isMakeYourOwn ? `Bake: ${bakeOption}` : '';
    const cheeseNote = isMakeYourOwn ? `Cheese: ${cheeseAmount}` : '';
    const sauceAmountNote = isMakeYourOwn ? `Sauce amount: ${sauceAmount}` : '';
    const cutNote = isMakeYourOwn ? `Cut: ${cutOption}` : '';

    const combinedInstructions = [
      crustNote,
      sauceNote,
      pizzaOptionsNote,
      bakeNote,
      cheeseNote,
      sauceAmountNote,
      cutNote,
      specialInstructions,
    ]
      .filter(Boolean)
      .join(' | ');

    addItem({
      id: currentId,
      name: displayName,
      price: basePrice + extrasTotal,
      quantity,
      size,
      toppings: selectedToppings,
      specialInstructions: combinedInstructions,
      image,
    });

    toast.success(`${displayName} added to cart`);
    setOpen(false);
    resetState();
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
                {/* Choice of Crust */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Label className="text-sm">Choice of Crust</Label>
                      <p className="mt-1 text-xs text-muted-foreground">Choose 1</p>
                    </div>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#e7f5ed] px-2.5 py-1">
                      <Check className="w-3.5 h-3.5 text-[#15803d]" />
                      <span className="text-[11px] font-medium text-[#15803d] leading-none">Required</span>
                    </div>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label="Choice of Crust"
                    className="mt-3 rounded-xl border border-[#E5E7EB] overflow-hidden bg-white"
                  >
                    {crustOpen
                      ? crustOptions.map((option, index) => {
                          const isActive = crust === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              role="radio"
                              aria-checked={isActive}
                              onClick={() => {
                                setCrust(option);
                                setCrustOpen(false);
                              }}
                              className={[
                                'flex w-full items-center justify-between px-4 py-3 text-sm text-[#111827] focus:outline-none',
                                index > 0 ? 'border-t border-[#E5E7EB]' : '',
                                'hover:bg-gray-50',
                              ].join(' ')}
                            >
                              <span>{option}</span>
                              <span
                                className={[
                                  'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors',
                                  isActive ? 'border-black' : 'border-gray-400',
                                ].join(' ')}
                              >
                                {isActive && <span className="w-2.5 h-2.5 rounded-full bg-black" />}
                              </span>
                            </button>
                          );
                        })
                      : (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={true}
                          onClick={() => setCrustOpen(true)}
                          className="flex w-full items-center justify-between px-4 py-3 text-sm text-[#111827] focus:outline-none hover:bg-gray-50"
                        >
                          <span>{crust}</span>
                          <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-black" />
                          </span>
                        </button>
                      )}
                  </div>
                </div>

                <Separator />

                {/* Choice of Sauce */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Label className="text-sm">Choice of Sauce</Label>
                      <p className="mt-1 text-xs text-muted-foreground">Choose 1</p>
                    </div>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#e7f5ed] px-2.5 py-1">
                      <Check className="w-3.5 h-3.5 text-[#15803d]" />
                      <span className="text-[11px] font-medium text-[#15803d] leading-none">Required</span>
                    </div>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label="Choice of Sauce"
                    className="mt-3 rounded-xl border border-[#E5E7EB] overflow-hidden bg-white"
                  >
                    {sauceOpen
                      ? sauceOptions.map((option, index) => {
                          const isActive = sauce === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              role="radio"
                              aria-checked={isActive}
                              onClick={() => {
                                setSauce(option);
                                setSauceOpen(false);
                              }}
                              className={[
                                'flex w-full items-center justify-between px-4 py-3 text-sm text-[#111827] focus:outline-none',
                                index > 0 ? 'border-t border-[#E5E7EB]' : '',
                                'hover:bg-gray-50',
                              ].join(' ')}
                            >
                              <span>{option}</span>
                              <span
                                className={[
                                  'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors',
                                  isActive ? 'border-black' : 'border-gray-400',
                                ].join(' ')}
                              >
                                {isActive && <span className="w-2.5 h-2.5 rounded-full bg-black" />}
                              </span>
                            </button>
                          );
                        })
                      : (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={true}
                          onClick={() => setSauceOpen(true)}
                          className="flex w-full items-center justify-between px-4 py-3 text-sm text-[#111827] focus:outline-none hover:bg-gray-50"
                        >
                          <span>{sauce}</span>
                          <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-black">
                            <span className="w-2.5 h-2.5 rounded-full bg-black" />
                          </span>
                        </button>
                      )}
                  </div>
                </div>

                <Separator />

                {/* Pizza Options */}
                {isMakeYourOwn && (
                  <>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Label className="text-sm">Pizza Options</Label>
                          <p className="mt-1 text-xs text-muted-foreground">Optional</p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
                        {pizzaOptionsCfg.options.map((option, index) => {
                          const isActive = !!pizzaOptionsSelected[option.name];
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                setPizzaOptionsSelected((prev) => ({
                                  ...prev,
                                  [option.name]: !prev[option.name],
                                }))
                              }
                              className={[
                                'flex w-full items-center justify-between px-4 py-3 text-sm text-[#111827] focus:outline-none',
                                index > 0 ? 'border-t border-[#E5E7EB]' : '',
                                'hover:bg-gray-50',
                              ].join(' ')}
                            >
                              <span>{option.name}</span>
                              <span
                                className={[
                                  'flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors',
                                  isActive ? 'border-black bg-black' : 'border-gray-400 bg-white',
                                ].join(' ')}
                              >
                                {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* More Options (Bake/Cheese/Sauce amount/Cut) */}
                    <div>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-sm font-medium text-[#111827] py-1"
                        onClick={() => setMoreOptionsOpen((prev) => !prev)}
                      >
                        <span className="flex items-center gap-1">
                          <span>More Options</span>
                          {moreOptionsOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#f97316]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#f97316]" />
                          )}
                        </span>
                      </button>

                      {moreOptionsOpen && (
                        <div className="mt-3 space-y-4">
                          {/* Bake */}
                          <div>
                            <Label className="text-sm">Bake</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Chip
                                active={bakeOption === 'Normal Bake'}
                                onClick={() => setBakeOption('Normal Bake')}
                              >
                                Normal Bake
                              </Chip>
                              <Chip
                                active={bakeOption === 'Well Done'}
                                onClick={() => setBakeOption('Well Done')}
                              >
                                Well Done
                              </Chip>
                            </div>
                          </div>

                          {/* Cheese amount */}
                          <div>
                            <Label className="text-sm">Cheese</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Chip
                                active={cheeseAmount === 'No Cheese'}
                                onClick={() => setCheeseAmount('No Cheese')}
                              >
                                No Cheese
                              </Chip>
                              <Chip
                                active={cheeseAmount === 'Light Cheese'}
                                onClick={() => setCheeseAmount('Light Cheese')}
                              >
                                Light Cheese
                              </Chip>
                              <Chip
                                active={cheeseAmount === 'Cheese'}
                                onClick={() => setCheeseAmount('Cheese')}
                              >
                                Cheese
                              </Chip>
                            </div>
                          </div>

                          {/* Sauce amount */}
                          <div>
                            <Label className="text-sm">Sauce</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Chip
                                active={sauceAmount === 'No Sauce'}
                                onClick={() => setSauceAmount('No Sauce')}
                              >
                                No Sauce
                              </Chip>
                              <Chip
                                active={sauceAmount === 'Light Sauce'}
                                onClick={() => setSauceAmount('Light Sauce')}
                              >
                                Light Sauce
                              </Chip>
                              <Chip
                                active={sauceAmount === 'Normal Sauce'}
                                onClick={() => setSauceAmount('Normal Sauce')}
                              >
                                Normal Sauce
                              </Chip>
                              <Chip
                                active={sauceAmount === 'Extra Sauce'}
                                onClick={() => setSauceAmount('Extra Sauce')}
                              >
                                Extra Sauce
                              </Chip>
                            </div>
                          </div>

                          {/* Cut Option */}
                          <div>
                            <Label className="text-sm">Cut Option</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Chip
                                active={cutOption === 'No Cut'}
                                onClick={() => setCutOption('No Cut')}
                              >
                                No Cut
                              </Chip>
                              <Chip
                                active={cutOption === 'Standard Cut'}
                                onClick={() => setCutOption('Standard Cut')}
                              >
                                Standard Cut
                              </Chip>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />
                  </>
                )}

                {/* Size (only for non Build Your Own pizzas) */}
                {!isMakeYourOwn && (
                  <>
                    <div>
                      <Label className="text-sm">Size</Label>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <Chip active={size === '11"'} onClick={() => setSize('11"')}>11-inch</Chip>
                        <Chip active={size === 'Large'} onClick={() => setSize('Large')}>Large</Chip>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {toppingGroups.map((group, index) => (
                  <ToppingGroup
                    key={group.title}
                    title={group.title}
                    items={group.items}
                    selected={selected}
                    onToggle={toggleTopping}
                    selectedCount={selectedCount}
                    limit={TOPPING_LIMIT}
                    showSeparator={index < toppingGroups.length - 1}
                  />
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
                  <QuantityControl
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-[10002] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t p-4 pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <QuantityControl
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="flex-none rounded-full px-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    resetState();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 md:flex-none rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd();
                  }}
                >
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
