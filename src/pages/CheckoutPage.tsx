import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import {
  FREE_DELIVERY_THRESHOLD,
  formatINR,
  useApp,
} from '../context/AppContext';
import { DEHRADUN_AREAS } from '../data/seedData';
import { DeliveryOption, Order, PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    meals,
    providers,
    cartSubtotal,
    calculateDeliveryFee,
    currentUser,
    selectedArea,
    placeOrder,
    navigate,
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name ?? '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email ?? '');
  const [customerMobile, setCustomerMobile] = useState(currentUser?.mobile ?? '');
  const [hostelPgName, setHostelPgName] = useState(currentUser?.hostelPgName ?? '');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.deliveryAddress ?? '');
  const [dehradunArea, setDehradunArea] = useState(currentUser?.dehradunArea ?? selectedArea);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(
    'Hostel / PG Doorstep Delivery'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiReference, setUpiReference] = useState('');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const deliveryFee = calculateDeliveryFee(cartSubtotal, deliveryOption);
  const finalTotal = cartSubtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(customerEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^[0-9]{10}$/.test(customerMobile.trim())) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!hostelPgName.trim() || !deliveryAddress.trim()) {
      setError('Please enter your Hostel/PG name and delivery address in Dehradun.');
      return;
    }
    if (paymentMethod === 'UPI' && !upiReference.trim()) {
      setError('Please enter a demo UPI ID (e.g., student@upi) to simulate UPI confirmation.');
      return;
    }

    const order = placeOrder({
      customerName,
      customerEmail,
      customerMobile,
      hostelPgName,
      deliveryAddress,
      dehradunArea,
      deliveryOption,
      paymentMethod,
      upiReference: paymentMethod === 'UPI' ? `${upiReference.trim()} (Demo)` : undefined,
    });

    if (order) {
      setConfirmedOrder(order);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white border border-[#E5E1D6] rounded-2xl p-8 sm:p-10 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3EE] text-[#1B6B44] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#1B6B44]">
                Demo Payment Confirmed · Prototype Transaction
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
                Order Confirmed — {confirmedOrder.id}
              </h1>
              <p className="text-sm text-[#56635B]">
                Your order has been sent to the food provider dashboard. Current status:{' '}
                <strong className="text-[#17231C]">{confirmedOrder.status}</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl p-5 text-sm">
            <div>
              <div className="text-xs text-[#56635B]">Student &amp; Delivery Location</div>
              <div className="font-semibold text-[#17231C] mt-1">
                {confirmedOrder.customerName} ({confirmedOrder.customerMobile})
              </div>
              <div className="text-[#56635B] mt-0.5">
                {confirmedOrder.hostelPgName}, {confirmedOrder.deliveryAddress}
              </div>
              <div className="text-xs text-[#56635B] mt-0.5">{confirmedOrder.dehradunArea}</div>
            </div>
            <div>
              <div className="text-xs text-[#56635B]">Fulfillment &amp; Demo Payment</div>
              <div className="font-semibold text-[#17231C] mt-1">
                {confirmedOrder.deliveryOption}
              </div>
              <div className="text-[#56635B] mt-0.5">
                Method: {confirmedOrder.paymentMethod}
                {confirmedOrder.upiReference ? ` (${confirmedOrder.upiReference})` : ''}
              </div>
              <div className="text-xs text-[#1B6B44] font-medium mt-1">
                Status: {confirmedOrder.status}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#17231C]">Order Summary</h2>
            <div className="divide-y divide-[#E5E1D6] border-y border-[#E5E1D6]">
              {confirmedOrder.items.map((item, idx) => (
                <div key={`${item.mealId}-${idx}`} className="py-3 flex justify-between gap-4 text-sm">
                  <div>
                    <div className="font-medium text-[#17231C]">
                      {item.mealName} × {item.quantity}
                    </div>
                    <div className="text-xs text-[#56635B]">
                      {item.selectedTiming} · {item.providerName}
                    </div>
                  </div>
                  <div className="font-mono tabular-nums font-semibold text-[#17231C]">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-sm pt-2">
              <div className="flex justify-between text-[#56635B]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatINR(confirmedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#56635B]">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums">
                  {confirmedOrder.deliveryFee === 0 ? 'Free' : formatINR(confirmedOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#17231C] pt-2 border-t border-[#E5E1D6]">
                <span>Total Demo Amount</span>
                <span className="font-mono tabular-nums text-[#1B6B44]">
                  {formatINR(confirmedOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('orders')}
              className="px-6 py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <span>Track Order in My Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('explore')}
              className="px-6 py-3 bg-white hover:bg-[#F3F0E6] text-[#17231C] border border-[#E5E1D6] text-sm font-semibold rounded-xl transition-colors"
            >
              Continue Exploring Meals
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F3F0E6] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-[#56635B]" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-[#17231C]">
          Your checkout cart is empty
        </h1>
        <p className="text-sm text-[#56635B] max-w-md mx-auto">
          Add at least one home-style meal to your cart before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => navigate('explore')}
          className="px-6 py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Explore Meals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        type="button"
        onClick={() => navigate('explore')}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#56635B] hover:text-[#17231C]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Meals</span>
      </button>

      <div className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#17231C]">
          Checkout
        </h1>
        <p className="text-sm text-[#56635B]">
          Simulated demo checkout — no real money or payment gateway transaction is processed.
        </p>
      </div>

      <form
        onSubmit={handleSubmitOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left: Customer, Address, Fulfillment, Payment */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              1. Student &amp; Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="chk-name" className="block text-sm font-medium text-[#17231C]">
                  Full Name *
                </label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Aarav Sharma"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="chk-mobile" className="block text-sm font-medium text-[#17231C]">
                  Mobile Number (10 digits) *
                </label>
                <input
                  id="chk-mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="chk-email" className="block text-sm font-medium text-[#17231C]">
                  Email Address *
                </label>
                <input
                  id="chk-email"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="chk-area" className="block text-sm font-medium text-[#17231C]">
                  Dehradun Area *
                </label>
                <select
                  id="chk-area"
                  value={dehradunArea}
                  onChange={(e) => setDehradunArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                >
                  {DEHRADUN_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="chk-hostel" className="block text-sm font-medium text-[#17231C]">
                  Hostel / PG Name &amp; Room *
                </label>
                <input
                  id="chk-hostel"
                  type="text"
                  required
                  value={hostelPgName}
                  onChange={(e) => setHostelPgName(e.target.value)}
                  placeholder="e.g., Shivalik PG, Room 108"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="chk-address" className="block text-sm font-medium text-[#17231C]">
                  Street / Landmark Delivery Address *
                </label>
                <input
                  id="chk-address"
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Landmark near hostel / college road, Dehradun"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              2. Preferred Delivery or Collection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(
                [
                  {
                    value: 'Hostel / PG Doorstep Delivery' as DeliveryOption,
                    note: `Free on orders ${formatINR(FREE_DELIVERY_THRESHOLD)}+, else ₹15`,
                  },
                  {
                    value: 'Self-Collection from Kitchen' as DeliveryOption,
                    note: '₹0 delivery charge · Collect directly from nearby kitchen',
                  },
                ]
              ).map((opt) => {
                const selected = deliveryOption === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDeliveryOption(opt.value)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      selected
                        ? 'bg-[#EAF3EE] border-[#1B6B44]'
                        : 'bg-[#FAFAF6] border-[#E5E1D6] hover:bg-[#F3F0E6]'
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#17231C]">{opt.value}</div>
                    <div className="text-xs text-[#56635B] mt-1">{opt.note}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#17231C]">
                3. Demo Payment Method
              </h2>
              <p className="text-xs text-[#56635B] mt-1">
                Simulated prototype payment confirmation — no real payment gateway is connected.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(['UPI', 'Cash on Delivery'] as PaymentMethod[]).map((method) => {
                const selected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      selected
                        ? 'bg-[#EAF3EE] border-[#1B6B44]'
                        : 'bg-[#FAFAF6] border-[#E5E1D6] hover:bg-[#F3F0E6]'
                    }`}
                  >
                    <div className="text-sm font-semibold text-[#17231C]">
                      {method} (Demo)
                    </div>
                    <div className="text-xs text-[#56635B] mt-1">
                      {method === 'UPI'
                        ? 'Simulated instant UPI confirmation'
                        : 'Pay cash when meal arrives or on collection'}
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="space-y-1.5 pt-2">
                <label htmlFor="chk-upi" className="block text-sm font-medium text-[#17231C]">
                  Demo UPI ID *
                </label>
                <input
                  id="chk-upi"
                  type="text"
                  value={upiReference}
                  onChange={(e) => setUpiReference(e.target.value)}
                  placeholder="e.g., studentname@upi"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none font-mono"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-3 rounded-xl">{error}</p>
            )}
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-xl font-semibold text-[#17231C]">Order Summary</h2>

          <div className="divide-y divide-[#E5E1D6] border-y border-[#E5E1D6]">
            {cart.map((item) => {
              const meal = meals.find((m) => m.id === item.mealId);
              if (!meal) return null;
              const provider = providers.find((p) => p.id === meal.providerId);
              return (
                <div
                  key={`${item.mealId}-${item.selectedTiming}`}
                  className="py-3.5 flex justify-between gap-3 text-sm"
                >
                  <div>
                    <div className="font-medium text-[#17231C]">
                      {meal.name} × {item.quantity}
                    </div>
                    <div className="text-xs text-[#56635B]">
                      {item.selectedTiming} · {provider?.businessName ?? 'Demo Provider'}
                    </div>
                    {item.specialInstructions && (
                      <div className="text-xs text-[#D96B27] mt-0.5">
                        Note: {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <div className="font-mono tabular-nums font-semibold text-[#17231C] shrink-0">
                    {formatINR(meal.price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#56635B]">
              <span>Meals Subtotal</span>
              <span className="font-mono tabular-nums text-[#17231C]">
                {formatINR(cartSubtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[#56635B]">
              <span>Delivery / Collection Fee</span>
              <span className="font-mono tabular-nums text-[#17231C]">
                {deliveryFee === 0 ? 'Free' : formatINR(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-[#17231C] pt-3 border-t border-[#E5E1D6]">
              <span>Final Total</span>
              <span className="font-mono tabular-nums text-[#1B6B44]">{formatINR(finalTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Confirm Demo Order · {formatINR(finalTotal)}
          </button>

          <div className="flex items-start gap-2 text-xs text-[#56635B]">
            <ShieldCheck className="w-4 h-4 text-[#1B6B44] shrink-0 mt-0.5" />
            <span>
              Generates a unique demo order ID immediately and sends the order to the Food Provider
              Dashboard for live status updates.
            </span>
          </div>
        </aside>
      </form>
    </div>
  );
};
