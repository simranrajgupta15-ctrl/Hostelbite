import React, { useMemo, useState } from 'react';
import {
  Store,
  ClipboardList,
  UtensilsCrossed,
  MessageSquare,
  Plus,
  Upload,
  ArrowLeft,
  Check,
  X,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { formatINR, useApp } from '../context/AppContext';
import { DEHRADUN_AREAS, MEAL_CATEGORIES, MEAL_IMAGES } from '../data/seedData';
import { DietaryType, MealCategory, MealTiming, OrderStatus } from '../types';
import { FoodImage } from '../components/FoodImage';
import { VegIndicator } from '../components/VegIndicator';

type ProviderTab = 'orders' | 'menu' | 'register' | 'feedback';

const PRESET_IMAGES: { label: string; url: string }[] = [
  { label: 'Dal, Rice & Roti', url: MEAL_IMAGES.dalRiceRoti },
  { label: 'Rajma Chawal', url: MEAL_IMAGES.rajmaChawal },
  { label: 'Chole with Rice', url: MEAL_IMAGES.choleRice },
  { label: 'Vegetable Thali', url: MEAL_IMAGES.vegThali },
  { label: 'Paneer Thali', url: MEAL_IMAGES.paneerThali },
  { label: 'Homemade Breakfast', url: MEAL_IMAGES.breakfast },
  { label: 'Egg Curry Meal', url: MEAL_IMAGES.eggCurry },
];

export const ProviderDashboardPage: React.FC = () => {
  const {
    providers,
    activeProviderId,
    setActiveProviderId,
    meals,
    orders,
    feedbacks,
    addMeal,
    updateMeal,
    deleteMeal,
    updateOrderStatus,
    registerProvider,
    navigate,
    pushToast,
  } = useApp();

  const [tab, setTab] = useState<ProviderTab>('orders');
  const activeProvider =
    providers.find((p) => p.id === activeProviderId) ?? providers[0];

  // Add Meal Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [mealName, setMealName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [price, setPrice] = useState('120');
  const [dietary, setDietary] = useState<DietaryType>('Veg');
  const [timings, setTimings] = useState<MealTiming[]>(['Lunch', 'Dinner']);
  const [categories, setCategories] = useState<MealCategory[]>([
    'North Indian',
    'Vegetarian Meals',
  ]);
  const [prepEstimate, setPrepEstimate] = useState(
    activeProvider?.prepTimeEstimate ?? '25–35 mins'
  );
  const [imageUrl, setImageUrl] = useState<string>(MEAL_IMAGES.vegThali);
  const [mealFormError, setMealFormError] = useState('');

  // Register New Provider Form State
  const [bizName, setBizName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [bizArea, setBizArea] = useState(DEHRADUN_AREAS[0]);
  const [specialty, setSpecialty] = useState('');
  const [bizPrep, setBizPrep] = useState('25–35 mins');
  const [bizDesc, setBizDesc] = useState('');
  const [bizError, setBizError] = useState('');

  const providerMeals = useMemo(
    () => meals.filter((m) => m.providerId === activeProvider?.id),
    [meals, activeProvider?.id]
  );

  const providerOrders = useMemo(
    () =>
      orders.filter((o) =>
        o.items.some((item) => item.providerId === activeProvider?.id)
      ),
    [orders, activeProvider?.id]
  );

  const providerFeedbacks = useMemo(
    () => feedbacks.filter((f) => f.providerId === activeProvider?.id),
    [feedbacks, activeProvider?.id]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast('error', 'Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        pushToast('success', 'Food image uploaded for this listing.');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleTimingChoice = (slot: MealTiming) => {
    setTimings((prev) =>
      prev.includes(slot) ? prev.filter((t) => t !== slot) : [...prev, slot]
    );
  };

  const toggleCategoryChoice = (cat: MealCategory) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    setMealFormError('');
    const parsedPrice = Number(price);

    if (!mealName.trim()) return setMealFormError('Please enter the meal name.');
    if (!shortDescription.trim())
      return setMealFormError('Please provide a short meal description.');
    if (isNaN(parsedPrice) || parsedPrice < 40 || parsedPrice > 600)
      return setMealFormError('Please enter a valid meal price between ₹40 and ₹600.');
    if (timings.length === 0)
      return setMealFormError('Select at least one meal timing (Breakfast, Lunch, or Dinner).');

    const ingredients = ingredientsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const combinedCategories = Array.from(
      new Set<MealCategory>([...categories, ...timings])
    );

    addMeal({
      name: mealName.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      ingredients:
        ingredients.length > 0 ? ingredients : ['Fresh Home-Style Ingredients'],
      price: Math.round(parsedPrice),
      dietary,
      timings,
      categories: combinedCategories,
      providerId: activeProvider.id,
      available: true,
      prepEstimate: prepEstimate.trim() || '25–35 mins',
      image: imageUrl,
    });

    setMealName('');
    setShortDescription('');
    setDescription('');
    setIngredientsText('');
    setPrice('120');
    setShowAddForm(false);
  };

  const handleRegisterProvider = (e: React.FormEvent) => {
    e.preventDefault();
    setBizError('');
    if (!bizName.trim() || !ownerName.trim() || !specialty.trim()) {
      setBizError('Please fill in business name, home chef name, and cuisine specialty.');
      return;
    }
    registerProvider({
      businessName: bizName.trim().includes('(Demo)')
        ? bizName.trim()
        : `${bizName.trim()} (Demo)`,
      ownerName: ownerName.trim(),
      area: bizArea,
      cuisineSpecialty: specialty.trim(),
      prepTimeEstimate: bizPrep.trim() || '25–35 mins',
      description:
        bizDesc.trim() ||
        'Local Dehradun home kitchen registered via HostelBite Provider Portal.',
    });
    setBizName('');
    setOwnerName('');
    setSpecialty('');
    setBizDesc('');
    setTab('menu');
  };

  const getNextStatusAction = (
    status: OrderStatus
  ): { label: string; next: OrderStatus } | null => {
    if (status === 'Accepted') return { label: 'Start Preparing', next: 'Preparing' };
    if (status === 'Preparing')
      return { label: 'Mark Ready for Delivery', next: 'Ready for Delivery' };
    if (status === 'Ready for Delivery')
      return { label: 'Mark Delivered', next: 'Delivered' };
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-[#E5E1D6] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E5E1D6] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-xl font-bold text-[#1B6B44]">HostelBite</span>
            <span className="text-[11px] font-semibold text-[#D96B27]">Provider Portal</span>
          </div>
          <p className="text-xs text-[#56635B]">
            Separate kitchen operations workspace for Dehradun home chefs &amp; tiffin providers.
          </p>

          <div className="space-y-1 pt-1">
            <label htmlFor="prov-switcher" className="block text-[11px] font-medium text-[#56635B]">
              Active Kitchen Profile
            </label>
            <select
              id="prov-switcher"
              value={activeProvider?.id ?? ''}
              onChange={(e) => setActiveProviderId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-[#FAFAF6] border border-[#E5E1D6] rounded-lg focus:border-[#1B6B44] focus:outline-none"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.businessName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav className="p-4 flex lg:flex-col gap-1.5 overflow-x-auto">
          {(
            [
              {
                id: 'orders' as ProviderTab,
                label: 'Incoming Orders',
                icon: ClipboardList,
                count: providerOrders.length,
              },
              {
                id: 'menu' as ProviderTab,
                label: 'Menu Listings',
                icon: UtensilsCrossed,
                count: providerMeals.length,
              },
              {
                id: 'feedback' as ProviderTab,
                label: 'Customer Feedback',
                icon: MessageSquare,
                count: providerFeedbacks.length,
              },
              {
                id: 'register' as ProviderTab,
                label: 'Register Kitchen',
                icon: UserPlus,
                count: null,
              },
            ]
          ).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#EAF3EE] text-[#135233]'
                    : 'text-[#56635B] hover:bg-[#F3F0E6] hover:text-[#17231C]'
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.count !== null && (
                  <span className="font-mono text-xs tabular-nums">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[#E5E1D6] space-y-2">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#17231C] border border-[#E5E1D6] bg-[#FAFAF6] hover:bg-[#F3F0E6] rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Student App</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 space-y-8 overflow-x-hidden">
        {/* Top Context Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D6] pb-6">
          <div>
            <div className="text-xs text-[#56635B]">
              Food Provider Dashboard · {activeProvider?.area}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C] mt-1">
              {activeProvider?.businessName}
            </h1>
            <p className="text-xs text-[#56635B] mt-0.5">
              Chef / Owner: {activeProvider?.ownerName} · {activeProvider?.cuisineSpecialty}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setTab('menu');
              setShowAddForm(true);
            }}
            className="px-4 py-2.5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl inline-flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>
        </header>

        {/* Quick Provider KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Active Menu Items</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#17231C] mt-1">
              {providerMeals.filter((m) => m.available).length} / {providerMeals.length}
            </div>
          </div>
          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Incoming / Pending Orders</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#D96B27] mt-1">
              {
                providerOrders.filter(
                  (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
                ).length
              }
            </div>
          </div>
          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Delivered Orders</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#1B6B44] mt-1">
              {providerOrders.filter((o) => o.status === 'Delivered').length}
            </div>
          </div>
          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Student Reviews</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#17231C] mt-1">
              {providerFeedbacks.length}
            </div>
          </div>
        </div>

        {/* TAB: INCOMING ORDERS */}
        {tab === 'orders' && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              Incoming Student Orders
            </h2>

            {providerOrders.length === 0 ? (
              <div className="bg-white border border-[#E5E1D6] rounded-2xl p-10 text-center space-y-2">
                <ClipboardList className="w-7 h-7 text-[#56635B] mx-auto" />
                <p className="font-semibold text-[#17231C]">No orders for this kitchen yet</p>
                <p className="text-sm text-[#56635B]">
                  When students place orders for meals from {activeProvider?.businessName}, they
                  will appear here for acceptance and status updates.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {providerOrders.map((order) => {
                  const nextAction = getNextStatusAction(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E5E1D6] rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#56635B]">
                            <span className="font-mono font-semibold text-[#17231C]">
                              {order.id}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {new Date(order.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#1B6B44]">{order.status}</span>
                          </div>
                          <h3 className="font-semibold text-[#17231C] mt-1">
                            {order.items
                              .map((i) => `${i.mealName} × ${i.quantity} (${i.selectedTiming})`)
                              .join(', ')}
                          </h3>
                          <p className="text-xs text-[#56635B] mt-0.5">
                            Student: {order.customerName} ({order.customerMobile}) ·{' '}
                            {order.hostelPgName}, {order.dehradunArea} · {order.deliveryOption}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span className="font-mono tabular-nums font-semibold text-base text-[#17231C] mr-2">
                            {formatINR(order.totalAmount)}
                          </span>

                          {order.status === 'Order Placed' && (
                            <>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(order.id, 'Accepted')}
                                className="px-3.5 py-2 bg-[#1B6B44] hover:bg-[#135233] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Order</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                                className="px-3.5 py-2 bg-white hover:bg-[#FDF1E8] text-[#B83B24] border border-[#B83B24]/30 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {nextAction && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, nextAction.next)}
                              className="px-4 py-2 bg-[#D96B27] hover:bg-[#B9561B] text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              {nextAction.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB: MENU LISTINGS */}
        {tab === 'menu' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-[#17231C]">
                Kitchen Menu Listings ({providerMeals.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm((v) => !v)}
                className="text-sm font-semibold text-[#1B6B44] hover:underline"
              >
                {showAddForm ? 'Close Add Meal Form' : '+ Add New Food Item'}
              </button>
            </div>

            {showAddForm && (
              <form
                onSubmit={handleCreateMeal}
                className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-5"
              >
                <h3 className="font-display text-lg font-semibold text-[#17231C]">
                  Add New Meal Listing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1.5">
                    <label htmlFor="pm-name" className="block font-medium text-[#17231C]">
                      Meal Name *
                    </label>
                    <input
                      id="pm-name"
                      type="text"
                      required
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      placeholder="e.g., Kadhi Chawal Home Plate"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="pm-price" className="block font-medium text-[#17231C]">
                        Price (INR) *
                      </label>
                      <input
                        id="pm-price"
                        type="number"
                        required
                        min={40}
                        max={600}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl font-mono focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="pm-diet" className="block font-medium text-[#17231C]">
                        Dietary Type *
                      </label>
                      <select
                        id="pm-diet"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value as DietaryType)}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="pm-short" className="block font-medium text-[#17231C]">
                      Short Description *
                    </label>
                    <input
                      id="pm-short"
                      type="text"
                      required
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="One-line summary shown on meal cards"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="pm-desc" className="block font-medium text-[#17231C]">
                      Full Description
                    </label>
                    <textarea
                      id="pm-desc"
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe cooking style, portion, and accompaniments..."
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pm-ing" className="block font-medium text-[#17231C]">
                      Ingredients (comma separated)
                    </label>
                    <input
                      id="pm-ing"
                      type="text"
                      value={ingredientsText}
                      onChange={(e) => setIngredientsText(e.target.value)}
                      placeholder="Dal, Basmati Rice, 3 Rotis, Salad"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="pm-prep" className="block font-medium text-[#17231C]">
                      Estimated Prep / Delivery Time
                    </label>
                    <input
                      id="pm-prep"
                      type="text"
                      value={prepEstimate}
                      onChange={(e) => setPrepEstimate(e.target.value)}
                      placeholder="e.g., 25–35 mins"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Timings & Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="block text-sm font-medium text-[#17231C]">Meal Timings *</span>
                    <div className="flex flex-wrap gap-2">
                      {(['Breakfast', 'Lunch', 'Dinner'] as MealTiming[]).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleTimingChoice(slot)}
                          className={`px-3 py-1.5 rounded-lg border font-medium ${
                            timings.includes(slot)
                              ? 'bg-[#1B6B44] text-white border-[#1B6B44]'
                              : 'bg-[#FAFAF6] text-[#17231C] border-[#E5E1D6]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-sm font-medium text-[#17231C]">Categories</span>
                    <div className="flex flex-wrap gap-2">
                      {MEAL_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategoryChoice(cat)}
                          className={`px-3 py-1.5 rounded-lg border font-medium ${
                            categories.includes(cat)
                              ? 'bg-[#EAF3EE] text-[#135233] border-[#1B6B44]'
                              : 'bg-[#FAFAF6] text-[#56635B] border-[#E5E1D6]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Upload or Sample Selection */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-[#E5E1D6]">
                  <div className="md:col-span-3 aspect-[4/3] rounded-xl overflow-hidden border border-[#E5E1D6] bg-[#F3F0E6]">
                    <FoodImage src={imageUrl} alt="Meal preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="md:col-span-9 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#F3F0E6] hover:bg-[#E5E1D6] text-[#17231C] text-xs font-semibold rounded-lg transition-colors">
                        <Upload className="w-4 h-4 text-[#1B6B44]" />
                        <span>Upload Food Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-[#56635B]">or select a sample photo:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`px-2.5 py-1 text-xs rounded-lg border ${
                            imageUrl === preset.url
                              ? 'border-[#1B6B44] bg-[#EAF3EE] text-[#135233] font-semibold'
                              : 'border-[#E5E1D6] bg-white text-[#56635B]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {mealFormError && (
                  <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-2.5 rounded-xl">
                    {mealFormError}
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 text-sm font-medium text-[#56635B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl"
                  >
                    Publish Food Item
                  </button>
                </div>
              </form>
            )}

            {/* Existing Meals List */}
            {providerMeals.length === 0 ? (
              <div className="bg-white border border-[#E5E1D6] rounded-2xl p-10 text-center space-y-2">
                <Store className="w-7 h-7 text-[#56635B] mx-auto" />
                <p className="font-semibold text-[#17231C]">No meals published yet</p>
                <p className="text-sm text-[#56635B]">
                  Click Add Food Item above to list your first home-style dish.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white border border-[#E5E1D6] rounded-2xl p-4 flex gap-4"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F3F0E6] shrink-0">
                      <FoodImage
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-[#17231C] truncate">
                          {meal.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => deleteMeal(meal.id)}
                          className="text-[#56635B] hover:text-[#B83B24] p-1"
                          aria-label={`Delete ${meal.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#56635B]">
                        <VegIndicator dietary={meal.dietary} />
                        <span aria-hidden="true">·</span>
                        <span>{meal.timings.join('/')}</span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#56635B]">₹</span>
                          <input
                            type="number"
                            aria-label={`Price for ${meal.name}`}
                            value={meal.price}
                            min={40}
                            max={600}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (!isNaN(val) && val >= 40) {
                                updateMeal(meal.id, { price: Math.round(val) });
                              }
                            }}
                            className="w-20 px-2 py-1 text-xs font-mono font-semibold bg-[#FAFAF6] border border-[#E5E1D6] rounded-lg"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => updateMeal(meal.id, { available: !meal.available })}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                            meal.available
                              ? 'bg-[#EAF3EE] border-[#1B6B44] text-[#135233]'
                              : 'bg-[#FDF1E8] border-[#B83B24]/30 text-[#B83B24]'
                          }`}
                        >
                          {meal.available ? 'Available' : 'Marked Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: CUSTOMER FEEDBACK */}
        {tab === 'feedback' && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              Customer Feedback for {activeProvider?.businessName}
            </h2>
            {providerFeedbacks.length === 0 ? (
              <div className="bg-white border border-[#E5E1D6] rounded-2xl p-10 text-center space-y-2">
                <MessageSquare className="w-7 h-7 text-[#56635B] mx-auto" />
                <p className="font-semibold text-[#17231C]">No student reviews yet</p>
                <p className="text-sm text-[#56635B] max-w-md mx-auto">
                  Genuine student feedback submitted after orders are marked Delivered will appear
                  here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white border border-[#E5E1D6] rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-sm font-semibold text-[#17231C]">
                          {fb.customerName}
                        </div>
                        <div className="text-xs text-[#56635B] font-mono">
                          {fb.orderId} · {fb.mealNames.join(', ')}
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#D96B27]">
                        {fb.ratings.overall}/5 ★
                      </span>
                    </div>
                    <p className="text-sm text-[#17231C]">&ldquo;{fb.comment}&rdquo;</p>
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#E5E1D6] text-[11px] text-[#56635B]">
                      <span>Quality: {fb.ratings.foodQuality}/5</span>
                      <span>Taste: {fb.ratings.taste}/5</span>
                      <span>Hygiene: {fb.ratings.hygiene}/5</span>
                      <span>Portion: {fb.ratings.portionSize}/5</span>
                      <span>Ease: {fb.ratings.convenience}/5</span>
                      <span>Overall: {fb.ratings.overall}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: REGISTER NEW FOOD PROVIDER */}
        {tab === 'register' && (
          <section className="max-w-2xl bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#17231C]">
                Register a Local Home Kitchen / Food Provider
              </h2>
              <p className="text-sm text-[#56635B] mt-1">
                Create a separate provider profile in Dehradun to publish meals and accept student
                orders.
              </p>
            </div>

            <form onSubmit={handleRegisterProvider} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="rp-biz" className="block font-medium text-[#17231C]">
                    Kitchen / Tiffin Business Name *
                  </label>
                  <input
                    id="rp-biz"
                    type="text"
                    required
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="e.g., Pahadi Ghar Rasoi"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="rp-owner" className="block font-medium text-[#17231C]">
                    Chef / Owner Name *
                  </label>
                  <input
                    id="rp-owner"
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="rp-area" className="block font-medium text-[#17231C]">
                    Dehradun Locality *
                  </label>
                  <select
                    id="rp-area"
                    value={bizArea}
                    onChange={(e) => setBizArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  >
                    {DEHRADUN_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="rp-prep" className="block font-medium text-[#17231C]">
                    Typical Prep &amp; Delivery Time
                  </label>
                  <input
                    id="rp-prep"
                    type="text"
                    value={bizPrep}
                    onChange={(e) => setBizPrep(e.target.value)}
                    placeholder="25–35 mins"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="rp-spec" className="block font-medium text-[#17231C]">
                  Cuisine Specialty *
                </label>
                <input
                  id="rp-spec"
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g., Homestyle North Indian Thalis & Parathas"
                  className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="rp-desc" className="block font-medium text-[#17231C]">
                  Kitchen Description
                </label>
                <textarea
                  id="rp-desc"
                  rows={3}
                  value={bizDesc}
                  onChange={(e) => setBizDesc(e.target.value)}
                  placeholder="Tell students about your cooking standards and meal timings..."
                  className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none resize-none"
                />
              </div>

              {bizError && (
                <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-2.5 rounded-xl">
                  {bizError}
                </p>
              )}

              <button
                type="submit"
                className="px-6 py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Register Provider Profile
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};
