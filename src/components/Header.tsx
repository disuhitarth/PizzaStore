import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface HeaderProps {
  onCartClick?: () => void;
  totalItems?: number;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, totalItems = 0 }) => {
  const reduceMotion = useReducedMotion();

  const buttonVariants = {
    rest: { scale: 1, boxShadow: '0 2px 6px rgba(15,23,42,0.06)' },
    hover: reduceMotion
      ? { }
      : { scale: 1.03, boxShadow: '0 10px 24px rgba(15,23,42,0.18)' },
    tap: reduceMotion ? { } : { scale: 0.97 },
  } as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F2F4F5]">
      <div className="relative flex items-center justify-center min-h-[100px] px-[49px] py-5 max-md:px-5">
        {/* Logo */}
        <div className="flex-shrink-0 flex justify-center">
          <img
            className="h-8 w-auto object-contain"
            src="https://cdn.builder.io/api/v1/image/assets%2F5497bee253214f7fa692ffe091e0dd84%2Fa41905418d4741659ddbf033a32ed4a1"
            alt="Pizza Depot Logo"
          />
        </div>

        {/* Cart icon in header (top right) */}
        <div className="absolute right-[49px] max-md:right-5 flex items-center justify-end">
          <motion.button
            type="button"
            onClick={onCartClick}
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className="group relative inline-flex items-center gap-2 rounded-full border border-[#D6DADE] bg-white text-[#111827] px-4 py-2 text-xs font-medium shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827] transition-colors"
            aria-label="View cart"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#111827] text-white group-hover:bg-black">
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-[11px] tracking-wide">Cart</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
