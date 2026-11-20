import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DietaryType, MealCategory, MealTiming } from '../types';
import { DEHRADUN_AREAS, MEAL_CATEGORIES } from '../data/seedData';
import { MealCard } from '../components/MealCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
type PriceBand = 'all' | 'under-110' | '110-130' | 'above-130';

export const ExploreMealsPage: React.FC = () => {
  const { meals, providers, exploreCategoryFilter, selectedArea, setSelectedArea } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [timingFilter, setTimingFilter] = useState<MealTiming | 'All'>('All');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<MealCategory | 'All'>(exploreCategoryFilter);
  const [priceBand, setPriceBand] = useState<PriceBand>('all');
  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    setCategoryFilter(exploreCategoryFilter);
    if (
      exploreCategoryFilter === 'Breakfast' ||
      exploreCategoryFilter === 'Lunch' ||
      exploreCategoryFilter === 'Dinner'
    ) {
      setTimingFilter(exploreCategoryFilter);
    } else {
      setTimingFilter('All');
    }
  }, [exploreCategoryFilter]);

  const activeProviders = useMemo(() => providers.filter((p) => p.active), [providers]);

  const filteredMeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = meals.filter((meal) => {
      const provider = providers.find((p) => p.id === meal.providerId);
      if (provider && !provider.active) return false;

      if (q) {
        const hay = [
          meal.name,
          meal.shortDescription,
          meal.description,
          ...meal.ingredients,
          provider?.businessName ?? '',
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (timingFilter !== 'All' && !meal.timings.includes(timingFilter)) return false;
      if (dietaryFilter !== 'All' && meal.dietary !== dietaryFilter) return false;
      if (categoryFilter !== 'All' && !meal.categories.includes(categoryFilter)) return false;
      if (providerFilter !== 'All' && meal.providerId !== providerFilter) return false;

      if (priceBand === 'under-110' && meal.price >= 110) return false;
      if (priceBand === '110-130' && (meal.price < 110 || meal.price > 130)) return false;
      if (priceBand === 'above-130' && meal.price <= 130) return false;

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [
    meals,
    providers,
    searchQuery,
    timingFilter,
    dietaryFilter,
    categoryFilter,
    priceBand,
    providerFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setTimingFilter('All');
    setDietaryFilter('All');
    setCategoryFilter('All');
    setPriceBand('all');
    setProviderFilter('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    timingFilter !== 'All' ||
    dietaryFilter !== 'All' ||
    categoryFilter !== 'All' ||
    priceBand !== 'all' ||
    providerFilter !== 'All' ||
    sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5E1D6] pb-8">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#17231C]">
            Explore Home-Style Meals
          </h1>
          <p className="text-sm sm:text-base text-[#56635B]">
            Search daily tiffins, thalis, and breakfast plates from demonstration Dehradun food
            providers. All listings and vendor profiles are sample prototype data.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-[#E5E1D6] rounded-xl px-3.5 py-2.5 shrink-0">
          <MapPin className="w-4 h-4 text-[#1B6B44] shrink-0" />
          <label htmlFor="explore-area" className="sr-only">
            Dehradun Locality
          </label>
          <select
            id="explore-area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-sm font-medium text-[#17231C] bg-transparent focus:outline-none pr-2"
          >
            {DEHRADUN_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Filters */}
      <section className="bg-white border border-[#E5E1D6] rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-[#56635B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals, ingredients, or kitchen name..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              aria-label="Filter by price range"
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value as PriceBand)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
            >
              <option value="all">All Prices (Demo INR)</option>
              <option value="under-110">Under ₹110</option>
              <option value="110-130">₹110 – ₹130 (Target Range)</option>
              <option value="above-130">Above ₹130</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MealCategory | 'All')}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
            >
              <option value="All">All Categories</option>
              {MEAL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              aria-label="Sort meals"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E5E1D6]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Meal Timing segmented controls */}
            <div className="inline-flex items-center p-1 bg-[#F3F0E6] rounded-lg">
              {(['All', 'Breakfast', 'Lunch', 'Dinner'] as const).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimingFilter(slot)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    timingFilter === slot
                      ? 'bg-white text-[#17231C] shadow-xs'
                      : 'text-[#56635B] hover:text-[#17231C]'
                  }`}
                >
                  {slot === 'All' ? 'All Timings' : slot}
                </button>
              ))}
            </div>

            {/* Dietary segmented controls */}
            <div className="inline-flex items-center p-1 bg-[#F3F0E6] rounded-lg">
              {(['All', 'Veg', 'Non-Veg'] as const).map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setDietaryFilter(diet)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dietaryFilter === diet
                      ? 'bg-white text-[#17231C] shadow-xs'
                      : 'text-[#56635B] hover:text-[#17231C]'
                  }`}
                >
                  {diet === 'All' ? 'All Diets' : diet}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#56635B]">
            <span className="tabular-nums">
              Showing <strong className="text-[#17231C]">{filteredMeals.length}</strong> of{' '}
              {meals.length} meals
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[#1B6B44] font-semibold hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Available Demo Food Providers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              Nearby Food Providers (Demonstration Listings)
            </h2>
            <p className="text-xs text-[#56635B] mt-0.5">
              Select a kitchen to filter its menu. These are sample demonstration providers, not
              verified commercial vendors.
            </p>
          </div>
          {providerFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setProviderFilter('All')}
              className="text-xs font-semibold text-[#1B6B44] hover:underline whitespace-nowrap"
            >
              Show All Providers
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeProviders.map((prov) => {
            const selected = providerFilter === prov.id;
            const mealCount = meals.filter((m) => m.providerId === prov.id && m.available).length;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => setProviderFilter(selected ? 'All' : prov.id)}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  selected
                    ? 'bg-[#EAF3EE] border-[#1B6B44]'
                    : 'bg-white border-[#E5E1D6] hover:border-[#1B6B44]/60'
                }`}
              >
                <div className="font-semibold text-sm text-[#17231C]">{prov.businessName}</div>
                <div className="text-xs text-[#56635B] mt-1">{prov.area}</div>
                <div className="text-xs text-[#56635B] mt-2 pt-2 border-t border-[#E5E1D6] flex items-center justify-between gap-2">
                  <span className="truncate">{prov.prepTimeEstimate}</span>
                  <span className="tabular-nums font-medium text-[#1B6B44] shrink-0">
                    {mealCount} meals
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Meal Results Grid */}
      <section>
        {filteredMeals.length === 0 ? (
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-12 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-[#56635B] mx-auto" />
            <h3 className="font-display text-xl font-semibold text-[#17231C]">
              No meals match your filters
            </h3>
            <p className="text-sm text-[#56635B] max-w-md mx-auto">
              Try clearing your search term or widening the meal timing, dietary preference, or
              price range.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-5 py-2.5 bg-[#1B6B44] text-white text-sm font-semibold rounded-xl hover:bg-[#135233] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
