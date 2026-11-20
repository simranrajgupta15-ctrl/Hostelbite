import React, { useMemo, useState } from 'react';
import { Calendar, Check, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { formatINR, useApp } from '../context/AppContext';
import { DEHRADUN_AREAS } from '../data/seedData';
import {
  MealTiming,
  SubscriptionMealSelection,
  SubscriptionPlanType,
} from '../types';
import { VegIndicator } from '../components/VegIndicator';

export const MealPlansPage: React.FC = () => {
  const {
    meals,
    currentUser,
    selectedArea,
    subscriptions,
    createSubscription,
    cancelSubscription,
  } = useApp();

  const availableMeals = useMemo(() => meals.filter((m) => m.available), [meals]);

  const [planType, setPlanType] = useState<SubscriptionPlanType>('Weekly');
  const [monthlyPreference, setMonthlyPreference] = useState<'Lunch' | 'Dinner' | 'Both'>('Both');
  const [selectedTimings, setSelectedTimings] = useState<MealTiming[]>(['Lunch', 'Dinner']);
  const [mealByTiming, setMealByTiming] = useState<Record<MealTiming, string>>({
    Breakfast: availableMeals.find((m) => m.timings.includes('Breakfast'))?.id ?? availableMeals[0]?.id ?? '',
    Lunch: availableMeals.find((m) => m.id === 'meal-4')?.id ?? availableMeals[0]?.id ?? '',
    Dinner: availableMeals.find((m) => m.id === 'meal-1')?.id ?? availableMeals[0]?.id ?? '',
  });
  const [qtyByTiming, setQtyByTiming] = useState<Record<MealTiming, number>>({
    Breakfast: 1,
    Lunch: 1,
    Dinner: 1,
  });

  const tomorrowIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(tomorrowIso);
  const [customerName, setCustomerName] = useState(currentUser?.name ?? '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser
      ? `${currentUser.hostelPgName}, ${currentUser.deliveryAddress}`
      : ''
  );
  const [area, setArea] = useState(currentUser?.dehradunArea ?? selectedArea);
  const [confirmedSubId, setConfirmedSubId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const durationDays = planType === 'Daily' ? 1 : planType === 'Weekly' ? 7 : 30;

  const activeTimings: MealTiming[] = useMemo(() => {
    if (planType === 'Monthly') {
      if (monthlyPreference === 'Lunch') return ['Lunch'];
      if (monthlyPreference === 'Dinner') return ['Dinner'];
      return ['Lunch', 'Dinner'];
    }
    return selectedTimings;
  }, [planType, monthlyPreference, selectedTimings]);

  const toggleTiming = (slot: MealTiming) => {
    setSelectedTimings((prev) =>
      prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot]
    );
  };

  const selections: SubscriptionMealSelection[] = useMemo(() => {
    return activeTimings
      .map((timing) => {
        const meal = availableMeals.find((m) => m.id === mealByTiming[timing]);
        if (!meal) return null;
        return {
          mealId: meal.id,
          mealName: meal.name,
          unitPrice: meal.price,
          timing,
          quantityPerDay: qtyByTiming[timing] ?? 1,
        };
      })
      .filter((x): x is SubscriptionMealSelection => x !== null);
  }, [activeTimings, availableMeals, mealByTiming, qtyByTiming]);

  const dailyCost = selections.reduce((sum, s) => sum + s.unitPrice * s.quantityPerDay, 0);
  const dailyMeals = selections.reduce((sum, s) => sum + s.quantityPerDay, 0);
  const totalEstimatedCost = dailyCost * durationDays;
  const totalMealsCount = dailyMeals * durationDays;

  const handleConfirmPlan = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (selections.length === 0) {
      setFormError('Please select at least one meal timing to calculate your meal plan.');
      return;
    }
    if (!startDate) {
      setFormError('Please choose a start date for your meal plan.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter your name for the subscription.');
      return;
    }
    if (!deliveryAddress.trim()) {
      setFormError('Please enter your Dehradun hostel or PG delivery address.');
      return;
    }

    const created = createSubscription({
      planType,
      selections,
      startDate,
      deliveryAddress,
      dehradunArea: area,
      customerName,
    });
    setConfirmedSubId(created.id);
  };

  const planCards: {
    type: SubscriptionPlanType;
    subtitle: string;
    daysLabel: string;
    bullets: string[];
  }[] = [
    {
      type: 'Daily',
      subtitle: 'Pay per order flexibility',
      daysLabel: '1 day · Individual selection',
      bullets: [
        'Select individual meals for any timing',
        'Pay per order with zero long-term commitment',
        'Ideal for exam days or trying a kitchen first',
      ],
    },
    {
      type: 'Weekly',
      subtitle: 'Structured 7-day student tiffin',
      daysLabel: '7 consecutive days',
      bullets: [
        'Choose breakfast, lunch, and/or dinner for 7 days',
        'Select preferred meal timings and quantities',
        'Transparent cost calculated strictly from selected meals',
      ],
    },
    {
      type: 'Monthly',
      subtitle: 'Regular 30-day hostel & PG routine',
      daysLabel: '30 consecutive days',
      bullets: [
        'Select regular everyday home-style meals',
        'Choose Lunch, Dinner, or Both effortlessly',
        'Clear monthly cost calculated from demo meal rates',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Page Header */}
      <div className="max-w-3xl space-y-2 border-b border-[#E5E1D6] pb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#17231C]">
          Student Meal Subscriptions
        </h1>
        <p className="text-sm sm:text-base text-[#56635B] leading-relaxed">
          Build a daily, 7-day weekly, or 30-day monthly home-style meal plan. Every subscription
          estimate below is calculated directly from your selected demo meals, quantities, and
          plan duration—no hidden or invented flat pricing.
        </p>
      </div>

      {/* Plan Type Selector */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {planCards.map((card) => {
          const active = planType === card.type;
          return (
            <button
              key={card.type}
              type="button"
              onClick={() => {
                setPlanType(card.type);
                setConfirmedSubId(null);
              }}
              className={`text-left p-6 rounded-2xl border transition-all ${
                active
                  ? 'bg-[#EAF3EE] border-[#1B6B44]'
                  : 'bg-white border-[#E5E1D6] hover:border-[#1B6B44]/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="font-display text-xl font-semibold text-[#17231C]">
                  {card.type} Meal Plan
                </h2>
                <span
                  className={`text-xs font-semibold ${
                    active ? 'text-[#1B6B44]' : 'text-[#56635B]'
                  }`}
                >
                  {active ? 'Selected' : 'Select'}
                </span>
              </div>
              <p className="text-xs text-[#56635B] mb-4">
                {card.subtitle} · {card.daysLabel}
              </p>
              <ul className="space-y-2 text-sm text-[#17231C]">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#1B6B44] shrink-0 mt-0.5" />
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </section>

      {/* Builder + Live Review Summary */}
      <form
        onSubmit={handleConfirmPlan}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left: Preferences */}
        <div className="lg:col-span-7 space-y-6 bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-[#17231C]">
              Configure Your {planType} Plan
            </h2>
            <p className="text-sm text-[#56635B]">
              Pick meal timings, assign home-style dishes, and set your start date.
            </p>
          </div>

          {/* Timing preferences */}
          <div className="space-y-3 pt-2 border-t border-[#E5E1D6]">
            <label className="block text-sm font-semibold text-[#17231C]">
              {planType === 'Monthly'
                ? 'Choose Monthly Meal Schedule (Lunch, Dinner, or Both)'
                : 'Select Preferred Meal Timings'}
            </label>

            {planType === 'Monthly' ? (
              <div className="grid grid-cols-3 gap-2.5">
                {(['Lunch', 'Dinner', 'Both'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setMonthlyPreference(pref)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-colors ${
                      monthlyPreference === pref
                        ? 'bg-[#1B6B44] text-white border-[#1B6B44]'
                        : 'bg-[#FAFAF6] text-[#17231C] border-[#E5E1D6] hover:bg-[#F3F0E6]'
                    }`}
                  >
                    {pref === 'Both' ? 'Lunch & Dinner' : pref}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {(['Breakfast', 'Lunch', 'Dinner'] as MealTiming[]).map((slot) => {
                  const chosen = selectedTimings.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleTiming(slot)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition-colors ${
                        chosen
                          ? 'bg-[#1B6B44] text-white border-[#1B6B44]'
                          : 'bg-[#FAFAF6] text-[#17231C] border-[#E5E1D6] hover:bg-[#F3F0E6]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Meal Assignment per selected timing */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#17231C]">
              Select Meals &amp; Daily Quantities
            </h3>
            {activeTimings.length === 0 ? (
              <p className="text-sm text-[#B83B24]">
                Select at least one meal timing above to choose dishes.
              </p>
            ) : (
              activeTimings.map((slot) => {
                const slotMeals = availableMeals.filter((m) => m.timings.includes(slot));
                const listToUse = slotMeals.length > 0 ? slotMeals : availableMeals;
                const selectedId = mealByTiming[slot] || listToUse[0]?.id || '';
                const currentMeal = listToUse.find((m) => m.id === selectedId) ?? listToUse[0];

                return (
                  <div
                    key={slot}
                    className="p-4 rounded-xl bg-[#FAFAF6] border border-[#E5E1D6] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#17231C]">{slot} Meal</span>
                      {currentMeal && (
                        <div className="flex items-center gap-2 text-xs text-[#56635B]">
                          <VegIndicator dietary={currentMeal.dietary} />
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums font-semibold text-[#17231C]">
                            {formatINR(currentMeal.price)} / meal
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        aria-label={`Choose meal for ${slot}`}
                        value={currentMeal?.id ?? ''}
                        onChange={(e) =>
                          setMealByTiming((prev) => ({ ...prev, [slot]: e.target.value }))
                        }
                        className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#E5E1D6] rounded-xl focus:border-[#1B6B44] focus:outline-none"
                      >
                        {listToUse.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} — {formatINR(m.price)} ({m.dietary})
                          </option>
                        ))}
                      </select>

                      <div className="inline-flex items-center border border-[#E5E1D6] rounded-xl bg-white self-start">
                        <button
                          type="button"
                          onClick={() =>
                            setQtyByTiming((prev) => ({
                              ...prev,
                              [slot]: Math.max(1, (prev[slot] ?? 1) - 1),
                            }))
                          }
                          className="p-2.5 text-[#17231C] hover:bg-[#F3F0E6] rounded-l-xl"
                          aria-label={`Decrease ${slot} quantity`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3.5 text-sm font-mono font-semibold tabular-nums">
                          {qtyByTiming[slot] ?? 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQtyByTiming((prev) => ({
                              ...prev,
                              [slot]: Math.min(5, (prev[slot] ?? 1) + 1),
                            }))
                          }
                          className="p-2.5 text-[#17231C] hover:bg-[#F3F0E6] rounded-r-xl"
                          aria-label={`Increase ${slot} quantity`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Start Date & Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E1D6]">
            <div className="space-y-1.5">
              <label htmlFor="sub-start-date" className="block text-sm font-semibold text-[#17231C]">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#56635B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="sub-start-date"
                  type="date"
                  required
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sub-area" className="block text-sm font-semibold text-[#17231C]">
                Dehradun Locality *
              </label>
              <select
                id="sub-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              >
                {DEHRADUN_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sub-name" className="block text-sm font-semibold text-[#17231C]">
                Student Name *
              </label>
              <input
                id="sub-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sub-address" className="block text-sm font-semibold text-[#17231C]">
                Hostel / PG Delivery Address *
              </label>
              <input
                id="sub-address"
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Hostel / PG name & room number"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-3 rounded-xl">{formError}</p>
          )}
        </div>

        {/* Right: Transparent Cost Breakdown */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              Subscription Cost Summary
            </h2>
            <p className="text-xs text-[#56635B] mt-1">
              Calculated strictly from selected demo meals × daily quantities × {durationDays}{' '}
              {durationDays === 1 ? 'day' : 'days'}.
            </p>
          </div>

          <div className="space-y-3 border-y border-[#E5E1D6] py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[#56635B]">Plan Type</span>
              <span className="font-semibold text-[#17231C]">
                {planType} ({durationDays} {durationDays === 1 ? 'day' : 'days'})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#56635B]">Start Date</span>
              <span className="font-mono tabular-nums text-[#17231C]">{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#56635B]">Total Meals Scheduled</span>
              <span className="font-mono tabular-nums font-semibold text-[#17231C]">
                {totalMealsCount} meals
              </span>
            </div>

            {selections.length > 0 && (
              <div className="pt-3 border-t border-[#E5E1D6] space-y-2">
                {selections.map((s) => (
                  <div key={s.timing} className="flex justify-between gap-2 text-xs">
                    <span className="text-[#56635B]">
                      {s.timing}: {s.mealName} ({s.quantityPerDay} × {formatINR(s.unitPrice)}/day)
                    </span>
                    <span className="font-mono tabular-nums font-medium text-[#17231C] shrink-0">
                      {formatINR(s.unitPrice * s.quantityPerDay * durationDays)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#56635B]">
              <span>Daily Meal Cost</span>
              <span className="font-mono tabular-nums">{formatINR(dailyCost)} / day</span>
            </div>
            <div className="flex justify-between items-baseline text-lg font-semibold text-[#17231C]">
              <span>Estimated {planType} Total</span>
              <span className="font-mono tabular-nums text-2xl text-[#1B6B44]">
                {formatINR(totalEstimatedCost)}
              </span>
            </div>
            <p className="text-[11px] text-[#56635B]">
              Demo calculation based on current menu listings—not a fixed published commercial rate.
            </p>
          </div>

          {confirmedSubId && (
            <div className="bg-[#EAF3EE] text-[#135233] rounded-xl p-4 flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Plan Confirmed ({confirmedSubId})</p>
                <p className="text-xs mt-0.5">
                  Your demo subscription is now listed in Active Subscriptions below.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={selections.length === 0}
            className="w-full py-3.5 px-5 bg-[#1B6B44] hover:bg-[#135233] disabled:bg-[#56635B]/40 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Confirm {planType} Meal Plan (Demo)
          </button>
        </aside>
      </form>

      {/* Active Subscriptions List */}
      <section className="space-y-5 pt-6 border-t border-[#E5E1D6]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#17231C]">
            Active Subscriptions
          </h2>
          <p className="text-sm text-[#56635B] mt-1">
            All meal plans you confirm in this session are stored locally and appear here.
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-10 text-center space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#17231C]">
              No active meal subscriptions yet
            </h3>
            <p className="text-sm text-[#56635B] max-w-md mx-auto">
              Configure a Daily, Weekly, or Monthly meal plan above and confirm it to track your
              scheduled meals here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#56635B]">
                      <span className="font-mono font-semibold text-[#17231C]">{sub.id}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          sub.status === 'Active'
                            ? 'text-[#1B6B44] font-semibold'
                            : 'text-[#B83B24] font-semibold'
                        }
                      >
                        {sub.status}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#17231C] mt-1">
                      {sub.planType} Meal Plan ({sub.durationDays}{' '}
                      {sub.durationDays === 1 ? 'day' : 'days'})
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="font-mono tabular-nums text-lg font-semibold text-[#1B6B44]">
                      {formatINR(sub.calculatedTotal)}
                    </div>
                    <div className="text-[11px] text-[#56635B] tabular-nums">
                      {sub.totalMealsCount} total meals
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#56635B] border-t border-[#E5E1D6] pt-3">
                  {sub.selections.map((sel) => (
                    <div key={`${sub.id}-${sel.timing}`} className="flex justify-between">
                      <span>
                        {sel.timing}: <strong className="text-[#17231C]">{sel.mealName}</strong> (×
                        {sel.quantityPerDay}/day)
                      </span>
                      <span className="font-mono tabular-nums">
                        {formatINR(sel.unitPrice)}/meal
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E5E1D6] text-xs text-[#56635B]">
                  <div>
                    Starts <span className="font-mono text-[#17231C]">{sub.startDate}</span> ·{' '}
                    {sub.dehradunArea}
                  </div>
                  {sub.status === 'Active' && (
                    <button
                      type="button"
                      onClick={() => cancelSubscription(sub.id)}
                      className="inline-flex items-center gap-1 text-[#B83B24] font-semibold hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Plan</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
