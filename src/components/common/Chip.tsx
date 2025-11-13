import React from 'react';

interface ChipProps {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ 
  active, 
  onClick, 
  disabled = false, 
  children,
  className = ''
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 rounded-full border text-sm transition select-none ${
      active ? 'bg-[#FFF7F2] border-[#C35413] text-[#C35413]' : 'bg-white border-[#D6DADE] text-[#36424e]'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'} ${className}`}
    aria-pressed={active}
  >
    {children}
  </button>
);

export default Chip;