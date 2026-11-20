export type PageRoute =
  | 'home'
  | 'explore'
  | 'meal-detail'
  | 'plans'
  | 'checkout'
  | 'orders'
  | 'about'
  | 'contact'
  | 'auth'
  | 'profile'
  | 'provider'
  | 'admin';

export type MealTiming = 'Breakfast' | 'Lunch' | 'Dinner';

export type MealCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Healthy Meals'
  | 'North Indian'
  | 'Vegetarian Meals';

export type DietaryType = 'Veg' | 'Non-Veg';

export type OrderStatus =
  | 'Order Placed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Cash on Delivery';

export type DeliveryOption =
  | 'Hostel / PG Doorstep Delivery'
  | 'Self-Collection from Kitchen';

export type SubscriptionPlanType = 'Daily' | 'Weekly' | 'Monthly';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  hostelPgName: string;
  deliveryAddress: string;
  collegeName: string;
  dehradunArea: string;
  createdAt: string;
}

export interface FoodProvider {
  id: string;
  businessName: string;
  ownerName: string;
  area: string;
  cuisineSpecialty: string;
  prepTimeEstimate: string;
  description: string;
  active: boolean;
  isDemoProvider: boolean;
  createdAt: string;
}

export interface MealItem {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  price: number;
  dietary: DietaryType;
  timings: MealTiming[];
  categories: MealCategory[];
  providerId: string;
  available: boolean;
  prepEstimate: string;
  image: string;
  isPopular: boolean;
  isDemoListing: boolean;
}

export interface CartItem {
  mealId: string;
  quantity: number;
  selectedTiming: MealTiming;
  specialInstructions: string;
}

export interface OrderItemSnapshot {
  mealId: string;
  mealName: string;
  providerId: string;
  providerName: string;
  price: number;
  quantity: number;
  selectedTiming: MealTiming;
  specialInstructions: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  hostelPgName: string;
  deliveryAddress: string;
  dehradunArea: string;
  deliveryOption: DeliveryOption;
  paymentMethod: PaymentMethod;
  upiReference?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  feedbackSubmitted: boolean;
}

export interface SubscriptionMealSelection {
  mealId: string;
  mealName: string;
  unitPrice: number;
  timing: MealTiming;
  quantityPerDay: number;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planType: SubscriptionPlanType;
  selections: SubscriptionMealSelection[];
  startDate: string;
  durationDays: number;
  totalMealsCount: number;
  calculatedTotal: number;
  deliveryAddress: string;
  dehradunArea: string;
  status: 'Active' | 'Cancelled';
  createdAt: string;
}

export interface FeedbackRatings {
  foodQuality: number;
  taste: number;
  hygiene: number;
  portionSize: number;
  convenience: number;
  overall: number;
}

export interface CustomerFeedback {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  mealNames: string[];
  ratings: FeedbackRatings;
  comment: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
