import React, { useState } from 'react';
import {
  Star,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatINR, useApp } from '../context/AppContext';
import { FeedbackRatings, OrderStatus } from '../types';

const STATUS_SEQUENCE: OrderStatus[] = [
  'Order Placed',
  'Accepted',
  'Preparing',
  'Ready for Delivery',
  'Delivered',
];

const RATING_DIMENSIONS: { key: keyof FeedbackRatings; label: string }[] = [
  { key: 'foodQuality', label: 'Food Quality' },
  { key: 'taste', label: 'Taste' },
  { key: 'hygiene', label: 'Hygiene' },
  { key: 'portionSize', label: 'Portion Size' },
  { key: 'convenience', label: 'Convenience' },
  { key: 'overall', label: 'Overall Satisfaction' },
];

export const MyOrdersPage: React.FC = () => {
  const {
    customerVisibleOrders,
    feedbacks,
    cancelCustomerOrder,
    submitFeedback,
    navigate,
  } = useApp();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    customerVisibleOrders[0]?.id ?? null
  );
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<FeedbackRatings>({
    foodQuality: 5,
    taste: 5,
    hygiene: 5,
    portionSize: 5,
    convenience: 5,
    overall: 5,
  });
  const [comment, setComment] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const handleOpenFeedback = (orderId: string) => {
    setFeedbackOrderId(orderId);
    setRatings({
      foodQuality: 5,
      taste: 5,
      hygiene: 5,
      portionSize: 5,
      convenience: 5,
      overall: 5,
    });
    setComment('');
    setFeedbackError('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackOrderId) return;
    if (comment.trim().length < 5) {
      setFeedbackError('Please share a brief written comment (at least 5 characters).');
      return;
    }
    const ok = submitFeedback(feedbackOrderId, ratings, comment);
    if (ok) {
      setFeedbackOrderId(null);
      setComment('');
      setFeedbackError('');
    }
  };

  const getStatusTextColor = (status: OrderStatus) => {
    if (status === 'Delivered') return 'text-[#1B6B44]';
    if (status === 'Cancelled') return 'text-[#B83B24]';
    if (status === 'Preparing' || status === 'Ready for Delivery') return 'text-[#D96B27]';
    return 'text-[#17231C]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1D6] pb-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#17231C]">
            My Orders &amp; Feedback
          </h1>
          <p className="text-sm sm:text-base text-[#56635B]">
            Track meal preparation progress, inspect order summaries, and submit honest ratings
            once your meal is delivered.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('explore')}
          className="px-5 py-2.5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          Order Another Meal
        </button>
      </div>

      {/* Orders List */}
      <section className="space-y-4">
        {customerVisibleOrders.length === 0 ? (
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-12 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-[#56635B] mx-auto" />
            <h2 className="font-display text-xl font-semibold text-[#17231C]">No orders yet</h2>
            <p className="text-sm text-[#56635B] max-w-md mx-auto">
              Once you place a meal order in demo checkout, it will appear here with live status
              tracking.
            </p>
            <button
              type="button"
              onClick={() => navigate('explore')}
              className="mt-2 px-5 py-2.5 bg-[#1B6B44] text-white text-sm font-semibold rounded-xl hover:bg-[#135233]"
            >
              Explore Meals
            </button>
          </div>
        ) : (
          customerVisibleOrders.map((order) => {
            const expanded = expandedOrderId === order.id;
            const statusIndex = STATUS_SEQUENCE.indexOf(order.status);
            const canCancel = order.status === 'Order Placed' || order.status === 'Accepted';
            const canReview = order.status === 'Delivered' && !order.feedbackSubmitted;
            const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <article
                key={order.id}
                className="bg-white border border-[#E5E1D6] rounded-2xl overflow-hidden"
              >
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#56635B]">
                      <span className="font-mono font-semibold text-[#17231C]">{order.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-semibold ${getStatusTextColor(order.status)}`}>
                        Status: {order.status}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-semibold text-[#17231C]">
                      {order.items.map((i) => `${i.mealName} (×${i.quantity})`).join(', ')}
                    </h2>
                    <p className="text-xs text-[#56635B]">
                      {totalQty} {totalQty === 1 ? 'meal' : 'meals'} · {order.deliveryOption} ·{' '}
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-right mr-2">
                      <div className="font-mono tabular-nums text-lg font-semibold text-[#17231C]">
                        {formatINR(order.totalAmount)}
                      </div>
                      <div className="text-[11px] text-[#56635B]">Demo total</div>
                    </div>

                    {canReview && (
                      <button
                        type="button"
                        onClick={() => handleOpenFeedback(order.id)}
                        className="px-4 py-2 bg-[#D96B27] hover:bg-[#B9561B] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[38px]"
                      >
                        Leave Feedback
                      </button>
                    )}

                    {order.feedbackSubmitted && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1B6B44]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Feedback Submitted</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                      className="px-3.5 py-2 text-xs font-medium text-[#17231C] border border-[#E5E1D6] rounded-lg hover:bg-[#F3F0E6] inline-flex items-center gap-1.5 min-h-[38px]"
                    >
                      <span>{expanded ? 'Hide Details' : 'View Details'}</span>
                      {expanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-[#E5E1D6] bg-[#FAFAF6] space-y-6">
                    {/* Status Progress Bar */}
                    {order.status === 'Cancelled' ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-[#B83B24]">
                        <XCircle className="w-4 h-4" />
                        <span>This order was cancelled.</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[#56635B]">
                          Order Progress (updated live from Food Provider Dashboard)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {STATUS_SEQUENCE.map((step, idx) => {
                            const reached = statusIndex >= idx;
                            return (
                              <div
                                key={step}
                                className={`px-3 py-2 rounded-lg border text-xs font-medium ${
                                  reached
                                    ? 'bg-[#EAF3EE] border-[#1B6B44] text-[#135233]'
                                    : 'bg-white border-[#E5E1D6] text-[#56635B]'
                                }`}
                              >
                                <span className="font-mono mr-1.5">0{idx + 1}.</span>
                                {step}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Item & Address Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[#56635B]">Meals Ordered</div>
                        {order.items.map((item, idx) => (
                          <div
                            key={`${order.id}-${item.mealId}-${idx}`}
                            className="flex justify-between gap-3 bg-white border border-[#E5E1D6] rounded-xl p-3"
                          >
                            <div>
                              <div className="font-medium text-[#17231C]">
                                {item.mealName} × {item.quantity}
                              </div>
                              <div className="text-xs text-[#56635B]">
                                {item.selectedTiming} · {item.providerName}
                              </div>
                              {item.specialInstructions && (
                                <div className="text-xs text-[#D96B27] mt-0.5">
                                  Note: {item.specialInstructions}
                                </div>
                              )}
                            </div>
                            <div className="font-mono tabular-nums font-semibold">
                              {formatINR(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-[#56635B]">
                          Delivery &amp; Payment Info
                        </div>
                        <div className="bg-white border border-[#E5E1D6] rounded-xl p-4 space-y-1.5 text-xs text-[#56635B]">
                          <div className="text-sm font-semibold text-[#17231C]">
                            {order.customerName} ({order.customerMobile})
                          </div>
                          <div>
                            {order.hostelPgName}, {order.deliveryAddress}
                          </div>
                          <div>{order.dehradunArea}</div>
                          <div className="pt-2 border-t border-[#E5E1D6] flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-mono text-[#17231C]">
                              {formatINR(order.subtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery Charge</span>
                            <span className="font-mono text-[#17231C]">
                              {order.deliveryFee === 0 ? 'Free' : formatINR(order.deliveryFee)}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-[#17231C]">
                            <span>Total ({order.paymentMethod})</span>
                            <span className="font-mono">{formatINR(order.totalAmount)}</span>
                          </div>
                        </div>

                        {canCancel && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => cancelCustomerOrder(order.id)}
                              className="px-4 py-2 text-xs font-semibold text-[#B83B24] border border-[#B83B24]/30 bg-white hover:bg-[#FDF1E8] rounded-lg transition-colors"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {/* Feedback Modal */}
      {feedbackOrderId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17231C]/50"
          role="dialog"
          aria-modal="true"
          aria-label="Submit meal feedback"
        >
          <form
            onSubmit={handleFeedbackSubmit}
            className="bg-white border border-[#E5E1D6] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#1B6B44] font-semibold">
                Order {feedbackOrderId}
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#17231C]">
                Rate Your Meal Experience
              </h2>
              <p className="text-sm text-[#56635B]">
                Your honest feedback helps local Dehradun kitchens maintain home-style hygiene and
                quality.
              </p>
            </div>

            <div className="space-y-3.5">
              {RATING_DIMENSIONS.map((dim) => (
                <div
                  key={dim.key}
                  className="flex items-center justify-between gap-3 py-2 border-b border-[#E5E1D6]"
                >
                  <span className="text-sm font-medium text-[#17231C]">{dim.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const active = ratings[dim.key] >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() =>
                            setRatings((prev) => ({ ...prev, [dim.key]: starVal }))
                          }
                          className="p-1 rounded hover:bg-[#F3F0E6] transition-colors"
                          aria-label={`Rate ${dim.label} ${starVal} out of 5`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              active
                                ? 'fill-[#D96B27] text-[#D96B27]'
                                : 'text-[#D6D2C7]'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="font-mono text-xs text-[#56635B] w-7 text-right tabular-nums">
                      {ratings[dim.key]}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="fb-comment" className="block text-sm font-semibold text-[#17231C]">
                Written Feedback *
              </label>
              <textarea
                id="fb-comment"
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share what you liked or what the kitchen can improve..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none resize-none"
              />
            </div>

            {feedbackError && (
              <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-2.5 rounded-xl">
                {feedbackError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFeedbackOrderId(null)}
                className="px-4 py-2.5 text-sm font-medium text-[#56635B] hover:text-[#17231C] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submitted Customer Feedback Section (Zero Fake Reviews) */}
      <section className="space-y-5 pt-6 border-t border-[#E5E1D6]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#17231C]">
            Your Submitted Feedback
          </h2>
          <p className="text-sm text-[#56635B] mt-1">
            Only genuine feedback submitted by you on completed orders is shown here. We do not
            display fabricated sample reviews.
          </p>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-10 text-center space-y-2">
            <MessageSquare className="w-7 h-7 text-[#56635B] mx-auto" />
            <h3 className="font-display text-lg font-semibold text-[#17231C]">
              No feedback submitted yet
            </h3>
            <p className="text-sm text-[#56635B] max-w-md mx-auto">
              Click <strong>Leave Feedback</strong> on any Delivered order above to rate food
              quality, taste, hygiene, portion size, convenience, and overall satisfaction.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#56635B] font-mono">
                      Order {fb.orderId} · {fb.providerName}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#17231C] mt-0.5">
                      {fb.mealNames.join(', ')}
                    </h3>
                  </div>
                  <div className="font-mono tabular-nums text-sm font-semibold text-[#D96B27]">
                    {fb.ratings.overall}/5 ★
                  </div>
                </div>

                <p className="text-sm text-[#17231C] leading-relaxed">&ldquo;{fb.comment}&rdquo;</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-[#E5E1D6] text-xs text-[#56635B]">
                  <span>Quality: {fb.ratings.foodQuality}/5</span>
                  <span>Taste: {fb.ratings.taste}/5</span>
                  <span>Hygiene: {fb.ratings.hygiene}/5</span>
                  <span>Portion: {fb.ratings.portionSize}/5</span>
                  <span>Convenience: {fb.ratings.convenience}/5</span>
                  <span>Overall: {fb.ratings.overall}/5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
