import React from 'react';
import { DietaryType } from '../types';

interface VegIndicatorProps {
  dietary: DietaryType;
  showLabel?: boolean;
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ dietary, showLabel = true }) => {
  const isVeg = dietary === 'Veg';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#56635B] whitespace-nowrap shrink-0">
      <span
        className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border ${
          isVeg ? 'border-[#1B6B44]' : 'border-[#B83B24]'
        }`}
        aria-hidden="true"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isVeg ? 'bg-[#1B6B44]' : 'bg-[#B83B24]'
          }`}
        />
      </span>
      {showLabel && <span>{isVeg ? 'Veg' : 'Non-Veg'}</span>}
    </span>
  );
};
