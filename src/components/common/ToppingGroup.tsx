import React from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Chip from './Chip';

interface ToppingGroupProps {
  title: string;
  items: string[];
  selected: Record<string, boolean>;
  onToggle: (name: string) => void;
  selectedCount: number;
  limit: number;
  showSeparator?: boolean;
}

const ToppingGroup: React.FC<ToppingGroupProps> = ({
  title,
  items,
  selected,
  onToggle,
  selectedCount,
  limit,
  showSeparator = true
}) => {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">{title}</Label>
          <span className="text-xs text-muted-foreground">{selectedCount}/{limit}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((t) => {
            const checked = !!selected[t];
            const disabled = !checked && selectedCount >= limit;
            return (
              <Chip 
                key={t} 
                active={checked} 
                onClick={() => onToggle(t)} 
                disabled={disabled}
              >
                {t}
              </Chip>
            );
          })}
        </div>
      </div>
      {showSeparator && <Separator />}
    </>
  );
};

export default ToppingGroup;