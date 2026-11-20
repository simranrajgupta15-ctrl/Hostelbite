import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Check,
} from 'lucide-react';
import { formatINR, useApp } from '../context/AppContext';
import { MealTiming } from '../types';
import { FoodImage } from '../components/FoodImage';
import { VegIndicator } from '../components/VegIndicator';
import { MealCard } from '../components/MealCard';

export const MealDetailPage: React.FC = () => {
  const { selectedMealId, meals, providers, addToCart, navigate } = useApp();
  const meal = meals.find((m) => m.id === selectedMealId) ?? meals[0];
  const provider = providers.find((p) => p.id === meal?.providerId);

  const [quantity, setQuantity] = useState(1);
  const [selectedTiming, setSelectedTiming] = useState<MealTiming>(
    meal?.timings[0] ?? 'Lunch'
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (meal) {
      setQuantity(1);
      setSelectedTiming(meal.timings[0] ?? 'Lunch');
      setSpecialInstructions('');
    }
  }, [meal?.id]);

  if (!meal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-semibold text-[#17231C]">Meal not found</h1>
        <button
          type="button"
          onClick={() => navigate('explore')}
          className="px-5 py-2.5 bg-[#1B6B44] text-white text-sm font-semibold rounded-xl"
        >
          Back to Explore Meals
        </button>
      </div>
    );
  }

  const relatedMeals = meals
    .filter((m) => m.id !== meal.id && m.available)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(meal.id, quantity, selectedTiming, specialInstructions.trim());
  };

  const handleBuyNow = () => {
    addToCart(meal.id, quantity, selectedTiming, specialInstructions.trim());
    navigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <button
        type="button"
        onClick={() => navigate('explore')}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#56635B] hover:text-[#17231C] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore Meals</span>
      </button>

      {/* Main Contiguous PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Large Photo, Ingredients, Provider Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#E5E1D6] bg-[#F3F0E6]">
            <FoodImage
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              What&apos;s Included &amp; Ingredients
            </h2>
            <p className="text-sm sm:text-base text-[#56635B] leading-relaxed">
              {meal.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {meal.ingredients.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-[#17231C] bg-white border border-[#E5E1D6] rounded-xl px-4 py-2.5"
                >
                  <Check className="w-4 h-4 text-[#1B6B44] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {provider && (
            <div className="bg-[#F3F0E6] border border-[#E5E1D6] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#56635B]">
                <Store className="w-4 h-4 text-[#1B6B44]" />
                <span>Food Provider Details · Demonstration Vendor Profile</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[#17231C]">
                {provider.businessName}
              </h3>
              <p className="text-sm text-[#56635B] leading-relaxed">{provider.description}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#17231C] pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#1B6B44]" />
                  <span>{provider.area}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D96B27]" />
                  <span>Estimated prep &amp; delivery: {meal.prepEstimate}</span>
                </span>
                <span>Prepared by: {provider.ownerName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-[#56635B]">
              <VegIndicator dietary={meal.dietary} />
              <span aria-hidden="true">·</span>
              <span>{meal.categories.slice(0, 2).join(' / ')}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  meal.available ? 'text-[#1B6B44] font-medium' : 'text-[#B83B24] font-medium'
                }
              >
                {meal.available ? 'Available Today' : 'Currently Unavailable'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C] leading-tight">
              {meal.name}
            </h1>

            <div className="flex items-baseline gap-2.5 pt-1">
              <span className="font-mono tabular-nums text-3xl font-semibold text-[#17231C]">
                {formatINR(meal.price)}
              </span>
              <span className="text-xs text-[#56635B]">per meal (demo menu price)</span>
            </div>
          </div>

          <div className="border-t border-[#E5E1D6] pt-5 space-y-5">
            {/* Meal Timing Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#17231C]">
                Select Meal Timing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Breakfast', 'Lunch', 'Dinner'] as MealTiming[]).map((slot) => {
                  const supported = meal.timings.includes(slot);
                  const active = selectedTiming === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!supported}
                      onClick={() => setSelectedTiming(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-[#EAF3EE] border-[#1B6B44] text-[#135233]'
                          : supported
                          ? 'bg-[#FAFAF6] border-[#E5E1D6] text-[#17231C] hover:bg-[#F3F0E6]'
                          : 'bg-[#FAFAF6] border-[#E5E1D6] text-[#56635B]/45 cursor-not-allowed'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-[#17231C]">Quantity</div>
                <div className="text-xs text-[#56635B]">
                  Subtotal:{' '}
                  <span className="font-mono tabular-nums font-semibold text-[#17231C]">
                    {formatINR(meal.price * quantity)}
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center border border-[#E5E1D6] rounded-xl bg-[#FAFAF6]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-[#17231C] hover:bg-[#F3F0E6] rounded-l-xl transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-mono tabular-nums text-sm font-semibold text-[#17231C]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="p-2.5 text-[#17231C] hover:bg-[#F3F0E6] rounded-r-xl transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label
                htmlFor="special-instructions"
                className="block text-sm font-semibold text-[#17231C]"
              >
                Special Instructions (Optional)
              </label>
              <textarea
                id="special-instructions"
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., Less spice, no onion, extra roti preference, or call at hostel gate..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none resize-none"
              />
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                disabled={!meal.available}
                onClick={handleAddToCart}
                className="py-3 px-4 bg-white hover:bg-[#F3F0E6] text-[#17231C] border border-[#17231C]/20 disabled:opacity-50 text-sm font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-2 min-h-[46px]"
              >
                <ShoppingBag className="w-4 h-4 text-[#1B6B44]" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                disabled={!meal.available}
                onClick={handleBuyNow}
                className="py-3 px-4 bg-[#1B6B44] hover:bg-[#135233] disabled:bg-[#56635B]/40 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center justify-center min-h-[46px]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* More Home-Style Meals */}
      {relatedMeals.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-[#E5E1D6]">
          <h2 className="font-display text-2xl font-semibold text-[#17231C]">
            More Home-Style Meals Nearby
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedMeals.map((m) => (
              <MealCard key={m.id} meal={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
