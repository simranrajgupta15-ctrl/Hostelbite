import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { MealItem } from '../types';
import { formatINR, useApp } from '../context/AppContext';
import { FoodImage } from './FoodImage';
import { VegIndicator } from './VegIndicator';

interface MealCardProps {
  meal: MealItem;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const { providers, addToCart, navigate } = useApp();
  const provider = providers.find((p) => p.id === meal.providerId);

  return (
    <article className="group flex flex-col bg-white border border-[#E5E1D6] rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => navigate('meal-detail', { mealId: meal.id })}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F0E6] text-left focus-visible:outline-2 focus-visible:outline-[#1B6B44]"
      >
        <FoodImage
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {!meal.available && (
          <div className="absolute inset-0 bg-[#17231C]/55 flex items-center justify-center">
            <span className="text-xs font-semibold text-white tracking-wide px-3 py-1.5 bg-[#17231C]/85 rounded-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </button>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#56635B] mb-2">
          <VegIndicator dietary={meal.dietary} />
          <span aria-hidden="true">·</span>
          <span>{meal.timings.join(' / ')}</span>
          <span aria-hidden="true">·</span>
          <span className={meal.available ? 'text-[#1B6B44] font-medium' : 'text-[#B83B24] font-medium'}>
            {meal.available ? 'Available' : 'Sold Out'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('meal-detail', { mealId: meal.id })}
          className="text-left group-hover:text-[#1B6B44] transition-colors"
        >
          <h3 className="font-display text-lg font-semibold text-[#17231C] leading-snug mb-1.5">
            {meal.name}
          </h3>
        </button>

        <p className="text-sm text-[#56635B] leading-relaxed line-clamp-2 mb-3 flex-1">
          {meal.shortDescription}
        </p>

        <div className="text-xs text-[#56635B] pb-4 mb-4 border-b border-[#E5E1D6] flex items-center justify-between gap-2">
          <span className="truncate">{provider?.businessName ?? 'Local Home Kitchen (Demo)'}</span>
          <span className="shrink-0 tabular-nums text-[#56635B]">{meal.prepEstimate}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono tabular-nums text-lg font-semibold text-[#17231C]">
              {formatINR(meal.price)}
            </div>
            <div className="text-[11px] text-[#56635B]">Demo menu price</div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('meal-detail', { mealId: meal.id })}
              className="px-3 py-2 text-xs font-medium text-[#17231C] border border-[#E5E1D6] rounded-lg hover:bg-[#F3F0E6] transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={!meal.available}
              onClick={() => addToCart(meal.id, 1, meal.timings[0])}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1B6B44] rounded-lg hover:bg-[#135233] disabled:bg-[#56635B]/40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
