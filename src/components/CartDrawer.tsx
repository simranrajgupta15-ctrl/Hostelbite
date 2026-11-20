import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  FREE_DELIVERY_THRESHOLD,
  formatINR,
  useApp,
} from '../context/AppContext';
import { FoodImage } from './FoodImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    meals,
    providers,
    cartSubtotal,
    calculateDeliveryFee,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useApp();

  if (!isCartOpen) return null;

  const deliveryFee = calculateDeliveryFee(cartSubtotal, 'Hostel / PG Doorstep Delivery');
  const finalTotal = cartSubtotal + deliveryFee;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div
        className="fixed inset-0 bg-[#17231C]/45 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative z-10 w-full max-w-md bg-[#FAFAF6] h-full flex flex-col border-l border-[#E5E1D6] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[#E5E1D6]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1B6B44]" />
            <h2 className="font-display text-lg font-semibold text-[#17231C]">Your Meal Cart</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#56635B] hover:text-[#17231C] rounded-lg hover:bg-[#F3F0E6] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#F3F0E6] flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#56635B]" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#17231C] mb-1.5">
                Your cart is empty
              </h3>
              <p className="text-sm text-[#56635B] max-w-xs mb-6">
                Explore home-style meals from nearby Dehradun kitchens and add your favorites here.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('explore');
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B6B44] rounded-lg hover:bg-[#135233] transition-colors"
              >
                Explore Meals
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {remainingForFreeDelivery > 0 ? (
                <div className="bg-[#EAF3EE] text-[#135233] text-xs px-4 py-3 rounded-xl">
                  Add <span className="font-mono font-semibold tabular-nums">{formatINR(remainingForFreeDelivery)}</span> more for free Hostel/PG doorstep delivery, or choose Self-Collection at checkout for ₹0 delivery fee.
                </div>
              ) : (
                <div className="bg-[#EAF3EE] text-[#135233] text-xs font-medium px-4 py-3 rounded-xl">
                  You unlocked free Hostel/PG doorstep delivery on this order.
                </div>
              )}

              {cart.map((item) => {
                const meal = meals.find((m) => m.id === item.mealId);
                if (!meal) return null;
                const provider = providers.find((p) => p.id === meal.providerId);
                return (
                  <div
                    key={`${item.mealId}-${item.selectedTiming}`}
                    className="flex gap-3.5 bg-white border border-[#E5E1D6] rounded-xl p-3.5"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F3F0E6] shrink-0">
                      <FoodImage src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm text-[#17231C] truncate">{meal.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.mealId, item.selectedTiming)}
                          className="text-[#56635B] hover:text-[#B83B24] p-1 transition-colors"
                          aria-label={`Remove ${meal.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#56635B] truncate mt-0.5">
                        {item.selectedTiming} · {provider?.businessName ?? 'Demo Provider'}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-xs text-[#D96B27] mt-1 line-clamp-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-mono tabular-nums text-sm font-semibold text-[#17231C]">
                          {formatINR(meal.price * item.quantity)}
                        </span>
                        <div className="inline-flex items-center border border-[#E5E1D6] rounded-lg bg-[#FAFAF6]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.mealId, item.selectedTiming, -1)}
                            className="p-1.5 text-[#17231C] hover:bg-[#F3F0E6] rounded-l-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.mealId, item.selectedTiming, 1)}
                            className="p-1.5 text-[#17231C] hover:bg-[#F3F0E6] rounded-r-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-white border-t border-[#E5E1D6] px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#56635B]">
                <span>Subtotal (Demo menu prices)</span>
                <span className="font-mono tabular-nums text-[#17231C]">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#56635B]">
                <span>Estimated Delivery Charge</span>
                <span className="font-mono tabular-nums text-[#17231C]">
                  {deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#17231C] pt-2.5 border-t border-[#E5E1D6]">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                navigate('checkout');
              }}
              className="w-full py-3 px-4 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
