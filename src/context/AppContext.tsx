import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CartItem,
  ContactInquiry,
  CustomerFeedback,
  DeliveryOption,
  FeedbackRatings,
  FoodProvider,
  MealCategory,
  MealItem,
  MealTiming,
  Order,
  OrderStatus,
  PageRoute,
  PaymentMethod,
  Subscription,
  SubscriptionMealSelection,
  SubscriptionPlanType,
  ToastMessage,
  UserAccount,
} from '../types';
import {
  DEHRADUN_AREAS,
  INITIAL_MEALS,
  INITIAL_ORDERS,
  INITIAL_PROVIDERS,
  INITIAL_USERS,
} from '../data/seedData';

const STORAGE_KEY = 'hostelbite_mvp_state_v1';

export const FREE_DELIVERY_THRESHOLD = 240;
export const STANDARD_DELIVERY_FEE = 15;

export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

interface PersistedState {
  users: UserAccount[];
  currentUserId: string | null;
  providers: FoodProvider[];
  activeProviderId: string;
  meals: MealItem[];
  cart: CartItem[];
  orders: Order[];
  guestOrderIds: string[];
  subscriptions: Subscription[];
  feedbacks: CustomerFeedback[];
  inquiries: ContactInquiry[];
  selectedArea: string;
}

const DEFAULT_PERSISTED_STATE: PersistedState = {
  users: INITIAL_USERS,
  currentUserId: null,
  providers: INITIAL_PROVIDERS,
  activeProviderId: INITIAL_PROVIDERS[0].id,
  meals: INITIAL_MEALS,
  cart: [],
  orders: INITIAL_ORDERS,
  guestOrderIds: ['HB-DDN-1001', 'HB-DDN-1003'],
  subscriptions: [],
  feedbacks: [],
  inquiries: [],
  selectedArea: DEHRADUN_AREAS[0],
};

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...DEFAULT_PERSISTED_STATE,
      ...parsed,
      users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : INITIAL_USERS,
      providers:
        Array.isArray(parsed.providers) && parsed.providers.length > 0
          ? parsed.providers
          : INITIAL_PROVIDERS,
      meals: Array.isArray(parsed.meals) && parsed.meals.length > 0 ? parsed.meals : INITIAL_MEALS,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : INITIAL_ORDERS,
      guestOrderIds: Array.isArray(parsed.guestOrderIds)
        ? parsed.guestOrderIds
        : DEFAULT_PERSISTED_STATE.guestOrderIds,
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
      feedbacks: Array.isArray(parsed.feedbacks) ? parsed.feedbacks : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    return DEFAULT_PERSISTED_STATE;
  }
}

interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  hostelPgName: string;
  deliveryAddress: string;
  dehradunArea: string;
  deliveryOption: DeliveryOption;
  paymentMethod: PaymentMethod;
  upiReference?: string;
}

interface RegisterUserInput {
  name: string;
  email: string;
  mobile: string;
  password: string;
  hostelPgName: string;
  deliveryAddress: string;
  collegeName: string;
  dehradunArea: string;
}

interface CreateSubscriptionInput {
  planType: SubscriptionPlanType;
  selections: SubscriptionMealSelection[];
  startDate: string;
  deliveryAddress: string;
  dehradunArea: string;
  customerName: string;
}

interface AppContextValue {
  route: PageRoute;
  selectedMealId: string | null;
  exploreCategoryFilter: MealCategory | 'All';
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  navigate: (nextRoute: PageRoute, options?: { mealId?: string; category?: MealCategory | 'All' }) => void;

  // Domain state
  users: UserAccount[];
  currentUser: UserAccount | null;
  providers: FoodProvider[];
  activeProviderId: string;
  setActiveProviderId: (id: string) => void;
  meals: MealItem[];
  cart: CartItem[];
  orders: Order[];
  customerVisibleOrders: Order[];
  subscriptions: Subscription[];
  feedbacks: CustomerFeedback[];
  inquiries: ContactInquiry[];
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  pushToast: (type: ToastMessage['type'], message: string) => void;

  // Cart helpers
  cartItemCount: number;
  cartSubtotal: number;
  calculateDeliveryFee: (subtotal: number, option?: DeliveryOption) => number;
  addToCart: (mealId: string, quantity?: number, timing?: MealTiming, specialInstructions?: string) => void;
  updateCartQuantity: (mealId: string, selectedTiming: MealTiming, delta: number) => void;
  removeFromCart: (mealId: string, selectedTiming: MealTiming) => void;
  clearCart: () => void;

  // Auth & profile
  registerUser: (input: RegisterUserInput) => { ok: boolean; error?: string };
  loginUser: (email: string, password: string) => { ok: boolean; error?: string };
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<Omit<UserAccount, 'id' | 'createdAt'>>) => void;

  // Orders & feedback
  placeOrder: (input: CheckoutInput) => Order | null;
  cancelCustomerOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  submitFeedback: (orderId: string, ratings: FeedbackRatings, comment: string) => boolean;

  // Subscriptions
  createSubscription: (input: CreateSubscriptionInput) => Subscription;
  cancelSubscription: (subscriptionId: string) => void;

  // Provider CRUD
  registerProvider: (input: Omit<FoodProvider, 'id' | 'createdAt' | 'active' | 'isDemoProvider'>) => FoodProvider;
  toggleProviderActive: (providerId: string) => void;
  addMeal: (input: Omit<MealItem, 'id' | 'isPopular' | 'isDemoListing'>) => MealItem;
  updateMeal: (mealId: string, updates: Partial<MealItem>) => void;
  deleteMeal: (mealId: string) => void;

  // Contact
  submitInquiry: (input: Omit<ContactInquiry, 'id' | 'createdAt'>) => ContactInquiry;

  // Admin demo reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());
  const [route, setRoute] = useState<PageRoute>('home');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState<MealCategory | 'All'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [state]);

  const pushToast = (type: ToastMessage['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (
    nextRoute: PageRoute,
    options?: { mealId?: string; category?: MealCategory | 'All' }
  ) => {
    if (options?.mealId !== undefined) {
      setSelectedMealId(options.mealId);
    }
    if (options?.category !== undefined) {
      setExploreCategoryFilter(options.category);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const cartItemCount = useMemo(
    () => state.cart.reduce((sum, item) => sum + item.quantity, 0),
    [state.cart]
  );

  const cartSubtotal = useMemo(() => {
    return state.cart.reduce((sum, item) => {
      const meal = state.meals.find((m) => m.id === item.mealId);
      return sum + (meal ? meal.price * item.quantity : 0);
    }, 0);
  }, [state.cart, state.meals]);

  const calculateDeliveryFee = (
    subtotal: number,
    option: DeliveryOption = 'Hostel / PG Doorstep Delivery'
  ): number => {
    if (subtotal <= 0) return 0;
    if (option === 'Self-Collection from Kitchen') return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  };

  const customerVisibleOrders = useMemo(() => {
    if (currentUser) {
      return state.orders.filter(
        (o) => o.customerId === currentUser.id || state.guestOrderIds.includes(o.id)
      );
    }
    return state.orders.filter((o) => state.guestOrderIds.includes(o.id));
  }, [state.orders, state.guestOrderIds, currentUser]);

  const addToCart = (
    mealId: string,
    quantity = 1,
    timing?: MealTiming,
    specialInstructions = ''
  ) => {
    const meal = state.meals.find((m) => m.id === mealId);
    if (!meal) return;
    if (!meal.available) {
      pushToast('error', `${meal.name} is currently unavailable.`);
      return;
    }
    const chosenTiming: MealTiming = timing ?? meal.timings[0] ?? 'Lunch';

    setState((prev) => {
      const idx = prev.cart.findIndex(
        (c) => c.mealId === mealId && c.selectedTiming === chosenTiming
      );
      const nextCart = [...prev.cart];
      if (idx >= 0) {
        nextCart[idx] = {
          ...nextCart[idx],
          quantity: nextCart[idx].quantity + quantity,
          specialInstructions: specialInstructions || nextCart[idx].specialInstructions,
        };
      } else {
        nextCart.push({
          mealId,
          quantity,
          selectedTiming: chosenTiming,
          specialInstructions,
        });
      }
      return { ...prev, cart: nextCart };
    });

    pushToast('success', `Added ${meal.name} (${chosenTiming}) to cart.`);
  };

  const updateCartQuantity = (mealId: string, selectedTiming: MealTiming, delta: number) => {
    setState((prev) => {
      const nextCart = prev.cart
        .map((item) => {
          if (item.mealId === mealId && item.selectedTiming === selectedTiming) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      return { ...prev, cart: nextCart };
    });
  };

  const removeFromCart = (mealId: string, selectedTiming: MealTiming) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter(
        (item) => !(item.mealId === mealId && item.selectedTiming === selectedTiming)
      ),
    }));
    pushToast('info', 'Item removed from cart.');
  };

  const clearCart = () => {
    setState((prev) => ({ ...prev, cart: [] }));
  };

  const registerUser = (input: RegisterUserInput): { ok: boolean; error?: string } => {
    const emailNormalized = input.email.trim().toLowerCase();
    const exists = state.users.some((u) => u.email.toLowerCase() === emailNormalized);
    if (exists) {
      return { ok: false, error: 'An account with this email already exists. Please log in.' };
    }
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: input.name.trim(),
      email: emailNormalized,
      mobile: input.mobile.trim(),
      password: input.password,
      hostelPgName: input.hostelPgName.trim(),
      deliveryAddress: input.deliveryAddress.trim(),
      collegeName: input.collegeName.trim(),
      dehradunArea: input.dehradunArea,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      users: [newUser, ...prev.users],
      currentUserId: newUser.id,
      selectedArea: input.dehradunArea,
    }));
    pushToast('success', `Welcome to HostelBite, ${newUser.name}!`);
    return { ok: true };
  };

  const loginUser = (email: string, password: string): { ok: boolean; error?: string } => {
    const emailNormalized = email.trim().toLowerCase();
    const found = state.users.find(
      (u) => u.email.toLowerCase() === emailNormalized && u.password === password
    );
    if (!found) {
      return {
        ok: false,
        error: 'Invalid email or password. Use the demo credentials or register a new student account.',
      };
    }
    setState((prev) => ({
      ...prev,
      currentUserId: found.id,
      selectedArea: found.dehradunArea || prev.selectedArea,
    }));
    pushToast('success', `Signed in as ${found.name}.`);
    return { ok: true };
  };

  const logoutUser = () => {
    setState((prev) => ({ ...prev, currentUserId: null }));
    pushToast('info', 'Signed out. You can continue browsing as a guest.');
  };

  const updateUserProfile = (updates: Partial<Omit<UserAccount, 'id' | 'createdAt'>>) => {
    if (!state.currentUserId) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === prev.currentUserId ? { ...u, ...updates } : u
      ),
      selectedArea: updates.dehradunArea ?? prev.selectedArea,
    }));
    pushToast('success', 'Student profile updated.');
  };

  const placeOrder = (input: CheckoutInput): Order | null => {
    if (state.cart.length === 0) {
      pushToast('error', 'Your cart is empty.');
      return null;
    }

    const items = state.cart
      .map((ci) => {
        const meal = state.meals.find((m) => m.id === ci.mealId);
        if (!meal) return null;
        const provider = state.providers.find((p) => p.id === meal.providerId);
        return {
          mealId: meal.id,
          mealName: meal.name,
          providerId: meal.providerId,
          providerName: provider?.businessName ?? 'Local Provider (Demo)',
          price: meal.price,
          quantity: ci.quantity,
          selectedTiming: ci.selectedTiming,
          specialInstructions: ci.specialInstructions,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = calculateDeliveryFee(subtotal, input.deliveryOption);
    const totalAmount = subtotal + deliveryFee;
    const now = new Date().toISOString();
    const orderNum = 1004 + state.orders.length + Math.floor(Math.random() * 90);
    const newOrder: Order = {
      id: `HB-DDN-${orderNum}`,
      customerId: currentUser?.id ?? 'guest',
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.trim(),
      customerMobile: input.customerMobile.trim(),
      hostelPgName: input.hostelPgName.trim(),
      deliveryAddress: input.deliveryAddress.trim(),
      dehradunArea: input.dehradunArea,
      deliveryOption: input.deliveryOption,
      paymentMethod: input.paymentMethod,
      upiReference: input.paymentMethod === 'UPI' ? input.upiReference?.trim() : undefined,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      status: 'Order Placed',
      createdAt: now,
      updatedAt: now,
      feedbackSubmitted: false,
    };

    setState((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      guestOrderIds: [newOrder.id, ...prev.guestOrderIds],
      cart: [],
      selectedArea: input.dehradunArea,
    }));

    pushToast('success', `Demo order ${newOrder.id} confirmed!`);
    return newOrder;
  };

  const cancelCustomerOrder = (orderId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => {
        if (o.id === orderId && (o.status === 'Order Placed' || o.status === 'Accepted')) {
          return { ...o, status: 'Cancelled', updatedAt: new Date().toISOString() };
        }
        return o;
      }),
    }));
    pushToast('info', `Order ${orderId} has been cancelled.`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    }));
    pushToast('success', `Order ${orderId} updated to "${status}".`);
  };

  const submitFeedback = (
    orderId: string,
    ratings: FeedbackRatings,
    comment: string
  ): boolean => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order || order.feedbackSubmitted) return false;
    const primaryItem = order.items[0];
    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      orderId: order.id,
      customerId: currentUser?.id ?? order.customerId,
      customerName: currentUser?.name ?? order.customerName,
      providerId: primaryItem?.providerId ?? 'prov-1',
      providerName: primaryItem?.providerName ?? 'Local Provider (Demo)',
      mealNames: order.items.map((i) => i.mealName),
      ratings,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      feedbacks: [newFeedback, ...prev.feedbacks],
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, feedbackSubmitted: true } : o
      ),
    }));
    pushToast('success', 'Thank you! Your meal feedback has been recorded.');
    return true;
  };

  const createSubscription = (input: CreateSubscriptionInput): Subscription => {
    const durationDays =
      input.planType === 'Daily' ? 1 : input.planType === 'Weekly' ? 7 : 30;
    const dailyCost = input.selections.reduce(
      (sum, sel) => sum + sel.unitPrice * sel.quantityPerDay,
      0
    );
    const dailyMeals = input.selections.reduce((sum, sel) => sum + sel.quantityPerDay, 0);
    const newSub: Subscription = {
      id: `SUB-DDN-${101 + state.subscriptions.length}`,
      customerId: currentUser?.id ?? 'guest',
      customerName: input.customerName.trim() || currentUser?.name || 'Guest Student',
      planType: input.planType,
      selections: input.selections,
      startDate: input.startDate,
      durationDays,
      totalMealsCount: dailyMeals * durationDays,
      calculatedTotal: dailyCost * durationDays,
      deliveryAddress: input.deliveryAddress.trim(),
      dehradunArea: input.dehradunArea,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      subscriptions: [newSub, ...prev.subscriptions],
    }));
    pushToast('success', `${input.planType} Meal Plan (${newSub.id}) activated in demo mode!`);
    return newSub;
  };

  const cancelSubscription = (subscriptionId: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subscriptionId ? { ...s, status: 'Cancelled' } : s
      ),
    }));
    pushToast('info', `Subscription ${subscriptionId} cancelled.`);
  };

  const registerProvider = (
    input: Omit<FoodProvider, 'id' | 'createdAt' | 'active' | 'isDemoProvider'>
  ): FoodProvider => {
    const newProv: FoodProvider = {
      ...input,
      id: `prov-${Date.now()}`,
      active: true,
      isDemoProvider: true,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      providers: [newProv, ...prev.providers],
      activeProviderId: newProv.id,
    }));
    pushToast('success', `Food provider "${newProv.businessName}" registered.`);
    return newProv;
  };

  const toggleProviderActive = (providerId: string) => {
    setState((prev) => ({
      ...prev,
      providers: prev.providers.map((p) =>
        p.id === providerId ? { ...p, active: !p.active } : p
      ),
    }));
    pushToast('info', 'Provider status updated.');
  };

  const addMeal = (input: Omit<MealItem, 'id' | 'isPopular' | 'isDemoListing'>): MealItem => {
    const newMeal: MealItem = {
      ...input,
      id: `meal-${Date.now()}`,
      isPopular: false,
      isDemoListing: true,
    };
    setState((prev) => ({
      ...prev,
      meals: [newMeal, ...prev.meals],
    }));
    pushToast('success', `"${newMeal.name}" published to HostelBite menu.`);
    return newMeal;
  };

  const updateMeal = (mealId: string, updates: Partial<MealItem>) => {
    setState((prev) => ({
      ...prev,
      meals: prev.meals.map((m) => (m.id === mealId ? { ...m, ...updates } : m)),
    }));
    pushToast('success', 'Meal listing updated.');
  };

  const deleteMeal = (mealId: string) => {
    setState((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.id !== mealId),
      cart: prev.cart.filter((c) => c.mealId !== mealId),
    }));
    pushToast('info', 'Meal listing removed.');
  };

  const submitInquiry = (input: Omit<ContactInquiry, 'id' | 'createdAt'>): ContactInquiry => {
    const inquiry: ContactInquiry = {
      ...input,
      id: `INQ-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      inquiries: [inquiry, ...prev.inquiries],
    }));
    pushToast('success', 'Your message has been submitted to HostelBite Support.');
    return inquiry;
  };

  const resetDemoData = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_PERSISTED_STATE);
    pushToast('info', 'Demo workspace reset to initial seed data.');
  };

  const setActiveProviderId = (id: string) => {
    setState((prev) => ({ ...prev, activeProviderId: id }));
  };

  const setSelectedArea = (area: string) => {
    setState((prev) => ({ ...prev, selectedArea: area }));
  };

  return (
    <AppContext.Provider
      value={{
        route,
        selectedMealId,
        exploreCategoryFilter,
        isCartOpen,
        setIsCartOpen,
        navigate,
        users: state.users,
        currentUser,
        providers: state.providers,
        activeProviderId: state.activeProviderId,
        setActiveProviderId,
        meals: state.meals,
        cart: state.cart,
        orders: state.orders,
        customerVisibleOrders,
        subscriptions: state.subscriptions,
        feedbacks: state.feedbacks,
        inquiries: state.inquiries,
        selectedArea: state.selectedArea,
        setSelectedArea,
        toasts,
        dismissToast,
        pushToast,
        cartItemCount,
        cartSubtotal,
        calculateDeliveryFee,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        placeOrder,
        cancelCustomerOrder,
        updateOrderStatus,
        submitFeedback,
        createSubscription,
        cancelSubscription,
        registerProvider,
        toggleProviderActive,
        addMeal,
        updateMeal,
        deleteMeal,
        submitInquiry,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
