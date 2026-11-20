import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Store,
  UtensilsCrossed,
  MessageSquare,
  FileSpreadsheet,
  ArrowLeft,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import { formatINR, useApp } from '../context/AppContext';
import { VENTURE_ASSUMPTIONS } from '../data/seedData';

type AdminTab = 'overview' | 'orders' | 'providers' | 'listings' | 'feedback' | 'venture';

export const AdminDashboardPage: React.FC = () => {
  const {
    users,
    providers,
    meals,
    orders,
    subscriptions,
    feedbacks,
    toggleProviderActive,
    updateMeal,
    deleteMeal,
    resetDemoData,
    navigate,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [confirmReset, setConfirmReset] = useState(false);

  const nonCancelledOrders = useMemo(
    () => orders.filter((o) => o.status !== 'Cancelled'),
    [orders]
  );

  const totalDemoRevenue = useMemo(
    () => nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    [nonCancelledOrders]
  );

  const activeSubscriptionsCount = useMemo(
    () => subscriptions.filter((s) => s.status === 'Active').length,
    [subscriptions]
  );

  // Chart 1: Daily Orders derived strictly from live demo orders
  const dailyOrdersData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const label = new Date(o.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      map.set(label, (map.get(label) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([date, count]) => ({ date, orders: count }));
  }, [orders]);

  // Chart 2: Monthly Sales derived strictly from live demo orders & active subscriptions
  const monthlySalesData = useMemo(() => {
    const map = new Map<string, number>();
    nonCancelledOrders.forEach((o) => {
      const label = new Date(o.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: '2-digit',
      });
      map.set(label, (map.get(label) ?? 0) + o.totalAmount);
    });
    subscriptions
      .filter((s) => s.status === 'Active')
      .forEach((s) => {
        const label = new Date(s.createdAt).toLocaleDateString('en-IN', {
          month: 'short',
          year: '2-digit',
        });
        map.set(label, (map.get(label) ?? 0) + s.calculatedTotal);
      });
    return Array.from(map.entries()).map(([month, sales]) => ({ month, sales }));
  }, [nonCancelledOrders, subscriptions]);

  // Chart 3: Popular Meals by units ordered strictly from demo orders
  const popularMealsData = useMemo(() => {
    const map = new Map<string, number>();
    nonCancelledOrders.forEach((o) => {
      o.items.forEach((item) => {
        map.set(item.mealName, (map.get(item.mealName) ?? 0) + item.quantity);
      });
    });
    return Array.from(map.entries())
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 6);
  }, [nonCancelledOrders]);

  // Chart 4: Cumulative Customer Growth derived strictly from registered users
  const customerGrowthData = useMemo(() => {
    const sorted = [...users].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const map = new Map<string, number>();
    let cumulative = 0;
    sorted.forEach((u) => {
      cumulative += 1;
      const label = new Date(u.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
      map.set(label, cumulative);
    });
    return Array.from(map.entries()).map(([date, customers]) => ({ date, customers }));
  }, [users]);

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-[#E5E1D6] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E5E1D6] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-xl font-bold text-[#1B6B44]">HostelBite</span>
            <span className="text-[11px] font-semibold text-[#1B6B44]">Admin Console</span>
          </div>
          <p className="text-xs text-[#56635B]">
            Platform oversight using live demonstration application data only.
          </p>
        </div>

        <nav className="p-4 flex lg:flex-col gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'overview' as AdminTab, label: 'Overview & Charts', icon: LayoutDashboard },
              { id: 'orders' as AdminTab, label: 'Recent Orders', icon: ClipboardList },
              { id: 'providers' as AdminTab, label: 'Provider Management', icon: Store },
              { id: 'listings' as AdminTab, label: 'Food Listings', icon: UtensilsCrossed },
              { id: 'feedback' as AdminTab, label: 'Customer Feedback', icon: MessageSquare },
              { id: 'venture' as AdminTab, label: 'Venture Plan Model', icon: FileSpreadsheet },
            ]
          ).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[#EAF3EE] text-[#135233]'
                    : 'text-[#56635B] hover:bg-[#F3F0E6] hover:text-[#17231C]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[#E5E1D6] space-y-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full px-3.5 py-2 text-xs font-medium text-[#56635B] hover:text-[#B83B24] border border-[#E5E1D6] rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          ) : (
            <div className="p-2.5 bg-[#FDF1E8] rounded-xl space-y-2 text-xs">
              <p className="text-[#B83B24] font-medium text-center">Reset all local demo state?</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setConfirmReset(false);
                  }}
                  className="py-1.5 bg-[#B83B24] text-white font-semibold rounded-lg"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="py-1.5 bg-white text-[#17231C] border border-[#E5E1D6] rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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
        <header className="border-b border-[#E5E1D6] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-[#1B6B44]">
              Demonstration Statistics · Live App State Only
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C] mt-1">
              HostelBite Admin Dashboard
            </h1>
          </div>
          <p className="text-xs text-[#56635B] max-w-sm">
            Every number and chart below is computed strictly from demo transactions, users,
            providers, and subscriptions stored in this application.
          </p>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Registered Customers</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#17231C] mt-1">
              {users.length}
            </div>
            <div className="text-[11px] text-[#56635B] mt-0.5">Demo accounts</div>
          </div>

          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Food Providers</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#17231C] mt-1">
              {providers.length}
            </div>
            <div className="text-[11px] text-[#56635B] mt-0.5">
              {providers.filter((p) => p.active).length} active kitchens
            </div>
          </div>

          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Total Demo Orders</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#17231C] mt-1">
              {orders.length}
            </div>
            <div className="text-[11px] text-[#56635B] mt-0.5">
              {nonCancelledOrders.length} active/completed
            </div>
          </div>

          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4">
            <div className="text-xs text-[#56635B]">Demo Order Revenue</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#1B6B44] mt-1">
              {formatINR(totalDemoRevenue)}
            </div>
            <div className="text-[11px] text-[#56635B] mt-0.5">Demo transactions</div>
          </div>

          <div className="bg-white border border-[#E5E1D6] rounded-xl p-4 col-span-2 lg:col-span-1">
            <div className="text-xs text-[#56635B]">Active Subscriptions</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#D96B27] mt-1">
              {activeSubscriptionsCount}
            </div>
            <div className="text-[11px] text-[#56635B] mt-0.5">Demo meal plans</div>
          </div>
        </div>

        {/* TAB: OVERVIEW & CHARTS */}
        {tab === 'overview' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Daily Orders */}
            <div className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#17231C]">
                  Daily Orders (Demo Data)
                </h2>
                <p className="text-xs text-[#56635B]">Orders placed grouped by date.</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D6" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#56635B' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#56635B' }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#1B6B44" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Monthly Sales */}
            <div className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#17231C]">
                  Monthly Demo Sales (INR)
                </h2>
                <p className="text-xs text-[#56635B]">
                  Sum of non-cancelled demo orders and active subscriptions.
                </p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#56635B' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#56635B' }} />
                    <Tooltip formatter={(val) => formatINR(Number(val ?? 0))} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#D96B27"
                      fill="#FDF1E8"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Popular Meals */}
            <div className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#17231C]">
                  Popular Meals (Units Ordered)
                </h2>
                <p className="text-xs text-[#56635B]">
                  Ranked strictly by quantity ordered in demo transactions.
                </p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularMealsData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D6" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#56635B' }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 11, fill: '#17231C' }}
                    />
                    <Tooltip />
                    <Bar dataKey="units" fill="#1B6B44" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Customer Growth */}
            <div className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#17231C]">
                  Customer Growth (Cumulative Accounts)
                </h2>
                <p className="text-xs text-[#56635B]">
                  Cumulative student registrations in this application.
                </p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D6" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#56635B' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#56635B' }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#1B6B44"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#1B6B44' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* TAB: RECENT ORDERS */}
        {tab === 'orders' && (
          <section className="bg-white border border-[#E5E1D6] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#E5E1D6]">
              <h2 className="font-display text-xl font-semibold text-[#17231C]">
                All Demo Orders ({orders.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAFAF6] border-b border-[#E5E1D6] text-xs text-[#56635B]">
                    <th className="py-3 px-5 font-semibold">Order ID</th>
                    <th className="py-3 px-5 font-semibold">Customer</th>
                    <th className="py-3 px-5 font-semibold">Meals</th>
                    <th className="py-3 px-5 font-semibold">Locality</th>
                    <th className="py-3 px-5 font-semibold">Status</th>
                    <th className="py-3 px-5 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D6]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAFAF6]">
                      <td className="py-3.5 px-5 font-mono text-xs font-semibold text-[#17231C]">
                        {order.id}
                      </td>
                      <td className="py-3.5 px-5 text-[#17231C]">{order.customerName}</td>
                      <td className="py-3.5 px-5 text-[#56635B]">
                        {order.items.map((i) => `${i.mealName} ×${i.quantity}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-[#56635B]">{order.dehradunArea}</td>
                      <td className="py-3.5 px-5 text-xs font-semibold text-[#1B6B44]">
                        {order.status}
                      </td>
                      <td className="py-3.5 px-5 font-mono tabular-nums font-semibold text-right text-[#17231C]">
                        {formatINR(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB: PROVIDERS */}
        {tab === 'providers' && (
          <section className="bg-white border border-[#E5E1D6] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#E5E1D6]">
              <h2 className="font-display text-xl font-semibold text-[#17231C]">
                Provider Management ({providers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAFAF6] border-b border-[#E5E1D6] text-xs text-[#56635B]">
                    <th className="py-3 px-5 font-semibold">Provider Business</th>
                    <th className="py-3 px-5 font-semibold">Owner</th>
                    <th className="py-3 px-5 font-semibold">Dehradun Area</th>
                    <th className="py-3 px-5 font-semibold text-right">Meals</th>
                    <th className="py-3 px-5 font-semibold text-right">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D6]">
                  {providers.map((prov) => {
                    const count = meals.filter((m) => m.providerId === prov.id).length;
                    return (
                      <tr key={prov.id} className="hover:bg-[#FAFAF6]">
                        <td className="py-3.5 px-5 font-semibold text-[#17231C]">
                          {prov.businessName}
                        </td>
                        <td className="py-3.5 px-5 text-[#56635B]">{prov.ownerName}</td>
                        <td className="py-3.5 px-5 text-xs text-[#56635B]">{prov.area}</td>
                        <td className="py-3.5 px-5 font-mono tabular-nums text-right">{count}</td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => toggleProviderActive(prov.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                              prov.active
                                ? 'bg-[#EAF3EE] border-[#1B6B44] text-[#135233]'
                                : 'bg-[#FDF1E8] border-[#B83B24]/30 text-[#B83B24]'
                            }`}
                          >
                            {prov.active ? 'Active (Pause)' : 'Paused (Activate)'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB: FOOD LISTINGS */}
        {tab === 'listings' && (
          <section className="bg-white border border-[#E5E1D6] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#E5E1D6]">
              <h2 className="font-display text-xl font-semibold text-[#17231C]">
                Food Listing Management ({meals.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAFAF6] border-b border-[#E5E1D6] text-xs text-[#56635B]">
                    <th className="py-3 px-5 font-semibold">Meal</th>
                    <th className="py-3 px-5 font-semibold">Provider</th>
                    <th className="py-3 px-5 font-semibold">Diet</th>
                    <th className="py-3 px-5 font-semibold text-right">Demo Price</th>
                    <th className="py-3 px-5 font-semibold text-right">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D6]">
                  {meals.map((meal) => {
                    const prov = providers.find((p) => p.id === meal.providerId);
                    return (
                      <tr key={meal.id} className="hover:bg-[#FAFAF6]">
                        <td className="py-3.5 px-5 font-semibold text-[#17231C]">{meal.name}</td>
                        <td className="py-3.5 px-5 text-xs text-[#56635B]">
                          {prov?.businessName ?? 'Demo Provider'}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-[#56635B]">{meal.dietary}</td>
                        <td className="py-3.5 px-5 font-mono tabular-nums font-semibold text-right">
                          {formatINR(meal.price)}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateMeal(meal.id, { available: !meal.available })}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                                meal.available
                                  ? 'bg-[#EAF3EE] border-[#1B6B44] text-[#135233]'
                                  : 'bg-[#FDF1E8] border-[#B83B24]/30 text-[#B83B24]'
                              }`}
                            >
                              {meal.available ? 'Available' : 'Hidden'}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteMeal(meal.id)}
                              className="p-1.5 text-[#56635B] hover:text-[#B83B24]"
                              aria-label={`Remove ${meal.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB: CUSTOMER FEEDBACK */}
        {tab === 'feedback' && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              Customer Feedback Log ({feedbacks.length})
            </h2>
            {feedbacks.length === 0 ? (
              <div className="bg-white border border-[#E5E1D6] rounded-2xl p-10 text-center space-y-2">
                <MessageSquare className="w-7 h-7 text-[#56635B] mx-auto" />
                <p className="font-semibold text-[#17231C]">No customer feedback submitted yet</p>
                <p className="text-sm text-[#56635B] max-w-md mx-auto">
                  This dashboard displays only authentic reviews submitted in My Orders. Submit a
                  rating on a delivered order to view it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white border border-[#E5E1D6] rounded-2xl p-5 space-y-2.5"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-semibold text-[#17231C]">
                          {fb.customerName} · {fb.providerName}
                        </div>
                        <div className="text-xs font-mono text-[#56635B]">{fb.orderId}</div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#D96B27]">
                        {fb.ratings.overall}/5 ★
                      </span>
                    </div>
                    <p className="text-sm text-[#17231C]">&ldquo;{fb.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: VENTURE PLAN MODEL (DBS GLOBAL UNIVERSITY ASSUMPTIONS) */}
        {tab === 'venture' && (
          <section className="space-y-6">
            <div className="bg-[#F3F0E6] border border-[#E5E1D6] rounded-2xl p-6 space-y-2">
              <div className="text-xs font-semibold text-[#D96B27]">
                Preliminary Business-Plan Assumptions · Not Verified Actual Performance
              </div>
              <h2 className="font-display text-2xl font-semibold text-[#17231C]">
                {VENTURE_ASSUMPTIONS.universityContext}
              </h2>
              <p className="text-sm text-[#56635B]">
                Initial launch market: {VENTURE_ASSUMPTIONS.initialMarket} · Target segment:{' '}
                {VENTURE_ASSUMPTIONS.targetAudience}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Proposed Selling Price',
                  value: `${formatINR(VENTURE_ASSUMPTIONS.proposedSellingPrice)} / meal`,
                },
                {
                  label: 'Estimated Variable Cost',
                  value: `${formatINR(VENTURE_ASSUMPTIONS.estimatedVariableCostPerMeal)} / meal`,
                },
                {
                  label: 'Estimated Contribution / Sale',
                  value: `${formatINR(VENTURE_ASSUMPTIONS.estimatedContributionPerSale)} / meal`,
                },
                {
                  label: 'Base Expected Customers',
                  value: `${VENTURE_ASSUMPTIONS.baseExpectedCustomers} students`,
                },
                {
                  label: 'Expected Purchases / Month',
                  value: `${VENTURE_ASSUMPTIONS.expectedPurchasesPerCustomerPerMonth} meals / student`,
                },
                {
                  label: 'Base Monthly Revenue Assumption',
                  value: formatINR(VENTURE_ASSUMPTIONS.baseMonthlyRevenueAssumption),
                },
                {
                  label: 'Estimated Monthly Fixed Cost',
                  value: formatINR(VENTURE_ASSUMPTIONS.estimatedMonthlyFixedCost),
                },
                {
                  label: 'Estimated Monthly Operating Surplus',
                  value: formatINR(VENTURE_ASSUMPTIONS.estimatedMonthlyOperatingSurplus),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-[#E5E1D6] rounded-xl p-4 space-y-1"
                >
                  <div className="text-xs text-[#56635B]">{item.label}</div>
                  <div className="font-mono tabular-nums text-lg font-semibold text-[#17231C]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
