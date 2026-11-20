import React from 'react';
import { ArrowRight, MapPin, ShieldCheck, Clock, CalendarDays, Wallet } from 'lucide-react';
import { HERO_IMAGE, MEAL_CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { FoodImage } from '../components/FoodImage';
import { MealCard } from '../components/MealCard';

export const HomePage: React.FC = () => {
  const { meals, navigate, selectedArea } = useApp();

  const popularMeals = meals.filter((m) => m.isPopular).slice(0, 6);

  const benefits = [
    {
      icon: Wallet,
      title: 'Affordable Pricing',
      description:
        'Demo meal prices centered around ₹120 so hostel and PG students can eat well daily without paying steep restaurant delivery markups.',
    },
    {
      icon: ShieldCheck,
      title: 'Homely Food',
      description:
        'Freshly prepared low-oil dal, soft whole-wheat rotis, seasonal sabzi, and classic North Indian staples cooked by nearby home kitchens.',
    },
    {
      icon: Clock,
      title: 'Convenient Ordering',
      description:
        'Browse menus, pick breakfast, lunch, or dinner slots, and place doorstep or self-collection orders in a few clear steps.',
    },
    {
      icon: CalendarDays,
      title: 'Regular Meal Options',
      description:
        'Switch smoothly between single-meal orders and customizable weekly or monthly meal plans tailored to class schedules.',
    },
  ];

  const steps = [
    {
      num: '01.',
      title: 'Register and select your location',
      detail: 'Sign up with your hostel or PG address in Dehradun, or browse as a guest first.',
    },
    {
      num: '02.',
      title: 'Explore nearby meals',
      detail: 'Filter by breakfast, lunch, dinner, veg/non-veg, and student-friendly demo prices.',
    },
    {
      num: '03.',
      title: 'Choose your meal or subscription',
      detail: 'Order a single fresh thali or build a 7-day weekly or 30-day monthly meal plan.',
    },
    {
      num: '04.',
      title: 'Place your order',
      detail: 'Pick hostel doorstep delivery or kitchen collection and confirm with demo UPI or COD.',
    },
    {
      num: '05.',
      title: 'Enjoy your meal',
      detail: 'Track preparation status in My Orders and share honest quality ratings after delivery.',
    },
  ];

  return (
    <div className="space-y-24">
      {/* B. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs font-medium text-[#56635B] mb-5">
              <span className="inline-flex items-center gap-1 text-[#1B6B44]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Dehradun, Uttarakhand</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Good Food. Homely Feel. Student-Friendly Prices.</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold text-[#17231C] leading-[1.1] tracking-tight mb-5 max-w-xl"
              style={{ textWrap: 'balance' }}
            >
              Missing Home Food? We&apos;ve Got You Covered!
            </h1>

            <p className="text-base sm:text-lg text-[#56635B] leading-relaxed max-w-xl mb-8">
              Discover affordable, hygienic and delicious home-style meals from nearby food
              providers.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                type="button"
                onClick={() => navigate('explore', { category: 'All' })}
                className="px-6 py-3.5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[46px]"
              >
                <span>Explore Meals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('plans')}
                className="px-6 py-3.5 bg-white hover:bg-[#F3F0E6] text-[#17231C] border border-[#E5E1D6] text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[46px]"
              >
                Explore Meal Plans
              </button>
            </div>

            <div className="pt-6 border-t border-[#E5E1D6] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#56635B]">
              <span>
                Active area: <strong className="text-[#17231C] font-medium">{selectedArea}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>Demo meals starting around ₹90–₹150</span>
              <span aria-hidden="true">·</span>
              <span>Guest browsing enabled</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#E5E1D6] bg-[#F3F0E6]">
              <FoodImage
                src={HERO_IMAGE}
                alt="Freshly cooked Indian home-style meal spread with yellow dal, steamed rice, whole-wheat rotis, sabzi, and fresh salad"
                className="w-full h-full lg:h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#17231C]/80 via-[#17231C]/35 to-transparent p-6">
                <p className="text-xs text-[#E8E4DA]">
                  Prepared by local home kitchens · DBS Global University Venture Prototype
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* C. Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
              Browse by Meal Category
            </h2>
            <p className="text-sm text-[#56635B] mt-1">
              Jump straight to everyday breakfast, lunch, dinner, and vegetarian home-style plates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('explore', { category: 'All' })}
            className="text-sm font-semibold text-[#1B6B44] hover:text-[#135233] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>View full menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MEAL_CATEGORIES.map((category) => {
            const count = meals.filter(
              (m) => m.categories.includes(category) && m.available
            ).length;
            return (
              <button
                key={category}
                type="button"
                onClick={() => navigate('explore', { category })}
                className="group text-left bg-white border border-[#E5E1D6] hover:border-[#1B6B44] rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="text-sm font-semibold text-[#17231C] group-hover:text-[#1B6B44] transition-colors">
                  {category}
                </div>
                <div className="text-xs text-[#56635B] mt-1 tabular-nums">
                  {count} {count === 1 ? 'demo meal' : 'demo meals'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* D. Popular Meals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
              Popular Student Meals
            </h2>
            <p className="text-sm text-[#56635B] mt-1">
              Sample home-style listings around our proposed ₹120 student meal price. All prices and
              providers shown are demonstration data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('explore', { category: 'All' })}
            className="px-4 py-2 text-sm font-medium text-[#17231C] bg-white border border-[#E5E1D6] rounded-lg hover:bg-[#F3F0E6] transition-colors whitespace-nowrap shrink-0"
          >
            Explore All Meals ({meals.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </section>

      {/* E. Why Choose HostelBite? */}
      <section className="bg-[#F3F0E6] border-y border-[#E5E1D6] py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
              Why Choose HostelBite?
            </h2>
            <p className="text-sm sm:text-base text-[#56635B] mt-2 leading-relaxed">
              Built around everyday Dehradun hostel and PG realities—balancing convenience,
              hygiene, and student monthly budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E1D6] flex items-center justify-center text-[#1B6B44]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#17231C]">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#56635B] leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* F. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-[#56635B] mt-2">
              Five straightforward steps from choosing your Dehradun hostel locality to enjoying a
              warm home-style meal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('plans')}
            className="text-sm font-semibold text-[#D96B27] hover:text-[#B9561B] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Build a Weekly or Monthly Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t border-[#E5E1D6] pt-8">
          {steps.map((step) => (
            <div key={step.num} className="space-y-2">
              <div className="font-mono text-sm font-semibold text-[#1B6B44] tabular-nums">
                {step.num}
              </div>
              <h3 className="font-display text-base font-semibold text-[#17231C] leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-[#56635B] leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
