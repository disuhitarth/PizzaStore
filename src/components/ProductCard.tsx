import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/contexts/CartContext';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Chip, QuantityControl, ToppingGroup } from '@/components/common';
import { pizzaConfig } from '@/pizzaConfig';
import { cn } from '@/lib/utils';

interface SizeOption {
  label: string;
  price: number;
}

interface ProductCardProps {
  name: string;
  price: string;
  description?: string;
  image: string;
  overlayImage?: string;
  isUnavailable?: boolean;
  className?: string;
  sizeOptions?: SizeOption[];
  /** Visual badges like "Best seller", "New", "Vegan", etc. */
  badges?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  description,
  image,
  overlayImage,
  isUnavailable = false,
  className = "",
  sizeOptions,
  badges = [],
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
  const [size, setSize] = useState<string>('11"');

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

  type PlacementCode = 'N' | 'L' | 'W' | 'R' | 'D';
  type ToppingCategoryKey = 'meat' | 'halal' | 'veggie' | 'free' | 'cheese';

  const [toppingPlacement, setToppingPlacement] = useState<Record<string, PlacementCode>>({});
  const [activeToppingCategory, setActiveToppingCategory] = useState<ToppingCategoryKey>('meat');

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

  const optionContainerMotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.18 },
      } as const;

  const dialogMotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: 'spring', stiffness: 260, damping: 26 },
      } as const;

  const dialogHeroMotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: 'spring', stiffness: 220, damping: 28, delay: 0.04 },
      } as const;

  const displayName = name?.trim() || 'Item';
  const displayPrice = price || '';
  const hasImage = Boolean(image);
  const displayBadges = badges.filter(Boolean);

  // Determine the currently selected base price based on size options (for non build-your-own)
  const selectedSizePrice = React.useMemo(() => {
    if (sizeOptions && sizeOptions.length > 0) {
      const match = sizeOptions.find((opt) => opt.label === size) ?? sizeOptions[0];
      return match.price;
    }
    const rawPrice = price || '';
    return Number((rawPrice.match(/[0-9]+(?:\.[0-9]{1,2})?/) ?? ["0"])![0]);
  }, [price, size, sizeOptions]);

  const basePrice = selectedSizePrice;
  const TOPPING_SURCHARGE = 1.59; // simple flat surcharge per topping (adjust as needed)
  const TOPPING_LIMIT = 7;

  const categoryOrder: ToppingCategoryKey[] = ['meat', 'halal', 'veggie', 'free', 'cheese'];

  const idToNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    const categories = toppingsCfg.categories as Record<string, { items: { id: string; name: string }[] }>;
    Object.values(categories).forEach((cat) => {
      cat.items.forEach((item) => {
        map[item.id] = item.name;
      });
    });
    return map;
  }, [toppingsCfg]);

  const pizzaOptionIdToName = React.useMemo(() => {
    const map: Record<string, string> = {};
    pizzaOptionsCfg.options.forEach((opt) => {
      map[opt.id] = opt.name;
    });
    return map;
  }, [pizzaOptionsCfg]);

  const specialtyPizza = React.useMemo(() => {
    const baseName = (displayName || '').replace(/ Pizza$/i, '').trim();
    return pizzaCfg.specialtyPizzas?.find(
      (p) => p.name.toLowerCase() === baseName.toLowerCase()
    );
  }, [displayName, pizzaCfg.specialtyPizzas]);

  const isSpecialtyPizza = !isMakeYourOwn && !!specialtyPizza;

  const nameToIdMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(idToNameMap).forEach(([id, name]) => {
      map[name] = id;
    });
    return map;
  }, [idToNameMap]);

  // Map of topping name -> isFree, based on pizzaConfig metadata
  const freeToppingNames = React.useMemo(() => {
    const freeNames: Record<string, boolean> = {};
    const categories = toppingsCfg.categories as Record<
      string,
      { items: { name: string; free?: boolean }[] }
    >;

    Object.values(categories).forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.free) {
          freeNames[item.name] = true;
        }
      });
    });

    return freeNames;
  }, [toppingsCfg]);

  const computeSelectedUnits = (
    sel: Record<string, boolean>,
    placement: Record<string, PlacementCode>
  ): number => {
    return Object.entries(sel).reduce((sum, [name, isOn]) => {
      if (!isOn) return sum;
      const code = placement[name];
      if (code === 'L' || code === 'R') return sum + 0.5;
      if (code === 'W') return sum + 1;
      if (code === 'D') return sum + 2;
      return sum + 1; // default full topping when selected but no explicit placement
    }, 0);
  };

  // Only count non-free toppings towards the extra price surcharge
  const computeChargeableUnits = (
    sel: Record<string, boolean>,
    placement: Record<string, PlacementCode>,
    freeNames: Record<string, boolean>
  ): number => {
    return Object.entries(sel).reduce((sum, [name, isOn]) => {
      if (!isOn) return sum;
      if (freeNames[name]) return sum;
      const code = placement[name];
      if (code === 'L' || code === 'R') return sum + 0.5;
      if (code === 'W') return sum + 1;
      if (code === 'D') return sum + 2;
      return sum + 1;
    }, 0);
  };

  const selectedCount = React.useMemo(
    () => computeSelectedUnits(selected, toppingPlacement),
    [selected, toppingPlacement]
  );

  const chargeableUnits = React.useMemo(
    () => computeChargeableUnits(selected, toppingPlacement, freeToppingNames),
    [selected, toppingPlacement, freeToppingNames]
  );

  const isUsingRecommendedRecipe = React.useMemo(() => {
    if (!isSpecialtyPizza || !specialtyPizza) return false;
    const meta = specialtyPizza as any;
    const defaultIds = meta?.toppings as string[] | undefined;
    if (!defaultIds || defaultIds.length === 0) return false;

    const currentIds = Object.entries(selected)
      .filter(([, isOn]) => isOn)
      .map(([name]) => nameToIdMap[name])
      .filter(Boolean) as string[];

    if (defaultIds.length !== currentIds.length) return false;
    const sortedDefault = [...defaultIds].sort();
    const sortedCurrent = [...currentIds].sort();
    return sortedDefault.every((id, idx) => id === sortedCurrent[idx]);
  }, [isSpecialtyPizza, specialtyPizza, selected, nameToIdMap]);

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
    // Default to the first defined size option when available; otherwise fall back.
    setSize(sizeOptions && sizeOptions.length > 0 ? sizeOptions[0].label : isMakeYourOwn ? 'Large' : '11"');
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

    // Base: no extra pizza options selected by default
    setPizzaOptionsSelected({});
    setMoreOptionsOpen(isMakeYourOwn);
    setBakeOption('Normal Bake');
    setCheeseAmount('Cheese');
    setSauceAmount('Normal Sauce');
    setCutOption('Standard Cut');

    if (isSpecialtyPizza && specialtyPizza) {
      const nextSelected: Record<string, boolean> = {};
      const nextPlacement: Record<string, PlacementCode> = {};
      (specialtyPizza as any).toppings?.forEach((id: string) => {
        const name = idToNameMap[id];
        if (name) {
          nextSelected[name] = true;
          // Default specialty toppings to whole pizza placement
          nextPlacement[name] = 'W';
        }
      });
      setSelected(nextSelected);
      setToppingPlacement(nextPlacement);

      // Optional future hooks: if specialtyPizza defines crustId/sauceId/pizzaOptionIds,
      // we can preselect those too without breaking current data.
      const meta = specialtyPizza as any;
      const crustId = meta?.crustId as string | undefined;
      if (crustId) {
        const crustOpt = crustCfg.options.find((o) => o.id === crustId);
        if (crustOpt) {
          setCrust(crustOpt.name);
        }
      }
      const sauceId = meta?.sauceId as string | undefined;
      if (sauceId) {
        const sauceOpt = sauceCfg.options.find((o) => o.id === sauceId);
        if (sauceOpt) {
          setSauce(sauceOpt.name);
        }
      }
      const pizzaOptionIds = meta?.pizzaOptionIds as string[] | undefined;
      if (pizzaOptionIds && pizzaOptionIds.length > 0) {
        const nextOpts: Record<string, boolean> = {};
        pizzaOptionIds.forEach((id) => {
          const name = pizzaOptionIdToName[id];
          if (name) {
            nextOpts[name] = true;
          }
        });
        setPizzaOptionsSelected(nextOpts);
      }
    } else {
      setSelected({});
      setToppingPlacement({});
    }

    setSpecialInstructions('');
  };

  // For non "Make Your Own" pizzas that have a specialty definition,
  // preselect toppings based on their configured topping IDs on first render.
  React.useEffect(() => {
    if (isSpecialtyPizza) {
      resetState();
    }
    // We intentionally only depend on isSpecialtyPizza so this runs once per pizza type
    // and does not overwrite user customizations afterwards.
  }, [isSpecialtyPizza]);

  const extrasTotal = chargeableUnits * TOPPING_SURCHARGE;
  const total = (basePrice + extrasTotal) * quantity;

  const persistRecentlyViewed = () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('recentlyViewedItems');
      const existing: any[] = raw ? JSON.parse(raw) : [];
      const nextItem = {
        name: displayName,
        price: `$${basePrice.toFixed(2)}`,
        description,
        image,
      };
      const withoutDupes = existing.filter((item) => item.name !== nextItem.name);
      const next = [nextItem, ...withoutDupes].slice(0, 12);
      window.localStorage.setItem('recentlyViewedItems', JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  };

  const handleAdd = () => {
    const selectedToppings = Object.entries(selected)
      .filter(([_, isSelected]) => isSelected)
      .map(([topping]) => topping);

    const selectedPizzaOptions = Object.entries(pizzaOptionsSelected)
      .filter(([_, isSelected]) => isSelected)
      .map(([opt]) => opt);

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

    persistRecentlyViewed();
    toast.success(`${displayName} added to cart`);
    setOpen(false);
    resetState();
  };

  const openDialog = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isSpecialtyPizza) {
      resetState();
    }
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
              onClick={openDialog}
              variants={buttonVariants}
              className="absolute bottom-1.5 right-1.5 z-10 grid place-items-center w-9 h-9 rounded-full bg-white border border-[#D6DADE] shadow-md text-[#36424e] transition will-change-transform transform-gpu"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
          {isUnavailable && <div className="absolute inset-0 bg-white/60" />}
        </motion.div>
        <div className="flex-1 min-w-0">
          {displayBadges.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1">
              {displayBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full bg-[#FFF3E8] text-[#C05621] border border-[#FED7AA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
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
              onClick={openDialog}
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
          {displayBadges.length > 0 && (
            <div className="mb-1 flex flex-wrap gap-1">
              {displayBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full bg-[#FFF3E8] text-[#C05621] border border-[#FED7AA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
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
          <motion.div className="flex flex-col h-full" {...dialogMotionProps}>
            <DialogHeader className="px-4 pt-4 md:px-0 md:pt-0">
              <DialogTitle className="flex items-center justify-between">
                <span>{displayName}</span>
                <span className="text-sm text-muted-foreground">${selectedSizePrice.toFixed(2)}</span>
              </DialogTitle>
              {description ? (
                <DialogDescription>{description}</DialogDescription>
              ) : (
                <DialogDescription>Choose size and toppings below.</DialogDescription>
              )}
              {isSpecialtyPizza && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {isUsingRecommendedRecipe
                    ? 'Using recommended recipe toppings'
                    : 'Customized from the recommended recipe'}
                </p>
              )}
              {isSpecialtyPizza && !isUsingRecommendedRecipe && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetState();
                  }}
                  className="mt-2 inline-flex items-center text-xs font-medium text-[#f97316] hover:underline"
                >
                  Reset to {specialtyPizza?.name} recipe
                </button>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-auto pr-0 md:pr-0">
              <div className="px-4 md:px-6 space-y-6">
              {/* Top hero image (Uber-style) */}
              <motion.div
                className="relative w-full overflow-hidden rounded-lg border bg-muted/40 aspect-[4/3] md:aspect-[16/9]"
                {...dialogHeroMotionProps}
              >
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
              </motion.div>

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

                {/* Size options for non build-your-own pizzas and other items with sizes */}
                {!isMakeYourOwn && sizeOptions && sizeOptions.length > 0 && (
                  <>
                    <div>
                      <Label className="text-sm">Size</Label>
                      <div className="mt-3 rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
                        {sizeOptions.map((option, index) => {
                          const isActive = size === option.label;
                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => setSize(option.label)}
                              className={[
                                'flex w-full items-center justify-between px-4 py-3 text-sm text-[#111827] focus:outline-none',
                                index > 0 ? 'border-t border-[#E5E7EB]' : '',
                                'hover:bg-gray-50',
                              ].join(' ')}
                            >
                              <span>{`${option.label} - $${option.price.toFixed(2)}`}</span>
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
                        })}
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* Toppings tabs + placement controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] pb-1">
                    <div className="flex gap-6 overflow-x-auto whitespace-nowrap pr-6">
                      {categoryOrder.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveToppingCategory(key)}
                          className={cn(
                            'relative -mb-px pb-2 text-sm font-medium border-b-2 transition-colors',
                            activeToppingCategory === key
                              ? 'border-[#FF6A00] text-[#FF6A00]'
                              : 'border-transparent text-[#4B5563] hover:text-[#111827]'
                          )}
                        >
                          {toppingsCfg.categories[key].displayName}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E5E7EB] bg-white divide-y">
                    {toppingsCfg.categories[activeToppingCategory].items.map((item) => {
                      const name = item.name;
                      const placement = toppingPlacement[name] ?? 'N';
                      const isNone = placement === 'N';
                      const isLeft = placement === 'L';
                      const isWhole = placement === 'W';
                      const isRight = placement === 'R';
                      const isDouble = placement === 'D';
                      const canDouble = !item.noDouble;

                      const updatePlacement = (code: PlacementCode) => {
                        setToppingPlacement((prevPlacement) => {
                          const prevCode = prevPlacement[name] ?? 'N';
                          let nextCode: PlacementCode = code;
                          // Clicking the same option toggles it off (None)
                          if (prevCode === code) {
                            nextCode = 'N';
                          }

                          const newPlacement = { ...prevPlacement, [name]: nextCode };
                          const newSelected = {
                            ...selected,
                            [name]: nextCode !== 'N',
                          };

                          const units = computeSelectedUnits(newSelected, newPlacement);
                          if (units > TOPPING_LIMIT) {
                            // Reject change if it would exceed limit
                            return prevPlacement;
                          }

                          setSelected(newSelected);
                          return newPlacement;
                        });
                      };

                      const baseCircle =
                        'inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#D1D5DB] text-[#9CA3AF] bg-white';
                      const activeCircle = 'border-[#FF6A00] text-[#FF6A00] bg-[#FFF3E8]';

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-3 py-2"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm text-[#111827]">{name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* No topping */}
                            <button
                              type="button"
                              onClick={() => updatePlacement('N')}
                              className={cn(baseCircle, isNone && activeCircle)}
                              aria-label="No topping"
                            >
                              <span className="text-[11px] font-medium">No</span>
                            </button>
                            {/* Left half */}
                            <button
                              type="button"
                              onClick={() => updatePlacement('L')}
                              className={cn(baseCircle, isLeft && activeCircle)}
                              aria-label="Left half"
                            >
                              <span className="relative w-4 h-4 rounded-full border border-current overflow-hidden">
                                <span className="absolute inset-y-0 left-0 w-1/2 bg-current" />
                              </span>
                            </button>
                            {/* Whole */}
                            <button
                              type="button"
                              onClick={() => updatePlacement('W')}
                              className={cn(baseCircle, isWhole && activeCircle)}
                              aria-label="Whole"
                            >
                              <span className="w-4 h-4 rounded-full bg-current" />
                            </button>
                            {/* Right half */}
                            <button
                              type="button"
                              onClick={() => updatePlacement('R')}
                              className={cn(baseCircle, isRight && activeCircle)}
                              aria-label="Right half"
                            >
                              <span className="relative w-4 h-4 rounded-full border border-current overflow-hidden">
                                <span className="absolute inset-y-0 right-0 w-1/2 bg-current" />
                              </span>
                            </button>
                            {/* Double (2x) */}
                            {canDouble && (
                              <button
                                type="button"
                                onClick={() => updatePlacement('D')}
                                className={cn(baseCircle, isDouble && activeCircle)}
                                aria-label="Double topping"
                              >
                                <span className="text-[11px] font-semibold">2x</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {selectedCount.toFixed(1)} / {TOPPING_LIMIT} toppings
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Tip: use the circles to choose left half, whole pizza, right half, or 2x toppings.
                  </p>
                </div>

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
            <div className="mb-3 flex flex-col gap-1 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:text-sm">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  Base: <span className="font-medium text-foreground">${basePrice.toFixed(2)}</span>
                </span>
                <span>
                  Extras: <span className="font-medium text-foreground">+${extrasTotal.toFixed(2)}</span>
                </span>
                <span>
                  Qty: <span className="font-medium text-foreground">{quantity}</span>
                </span>
              </div>
              <div>
                <span className="uppercase tracking-wide text-[10px] md:text-xs">Estimated total</span>{' '}
                <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
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
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.article>
  );
};

export default ProductCard;
