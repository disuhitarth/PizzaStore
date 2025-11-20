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
    className={`inline-flex min-w-[120px] items-center justify-center rounded-lg border px-6 py-3 text-[15px] font-medium select-none transition-colors ${
      active
        ? 'bg-brand border-brand text-white shadow-sm'
        : 'bg-white border-[#D6DADE] text-[#4B5563]'
    } ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:border-brand'
    } ${className}`}
    aria-pressed={active}
  >
    {children}
  </button>
);

export default Chip;