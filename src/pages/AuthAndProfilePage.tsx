import React, { useState } from 'react';
import { User, LogOut, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatINR, useApp } from '../context/AppContext';
import { DEHRADUN_AREAS } from '../data/seedData';

export const AuthAndProfilePage: React.FC = () => {
  const {
    currentUser,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    customerVisibleOrders,
    subscriptions,
    feedbacks,
    navigate,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [hostelPgName, setHostelPgName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [collegeName, setCollegeName] = useState('DBS Global University');
  const [dehradunArea, setDehradunArea] = useState(DEHRADUN_AREAS[0]);

  // Profile edit state
  const [editHostel, setEditHostel] = useState(currentUser?.hostelPgName ?? '');
  const [editAddress, setEditAddress] = useState(currentUser?.deliveryAddress ?? '');
  const [editCollege, setEditCollege] = useState(currentUser?.collegeName ?? '');
  const [editArea, setEditArea] = useState(currentUser?.dehradunArea ?? DEHRADUN_AREAS[0]);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter both your email address and password.');
      return;
    }
    const res = loginUser(loginEmail, loginPassword);
    if (!res.ok) {
      setError(res.error ?? 'Unable to sign in.');
      return;
    }
    navigate('home');
  };

  const handleFillDemoLogin = () => {
    setLoginEmail('aarav.student@demo.hostelbite.in');
    setLoginPassword('password123');
    setError('');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Please enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (!/^[0-9]{10}$/.test(mobile.trim()))
      return setError('Please enter a valid 10-digit mobile number.');
    if (password.length < 6)
      return setError('Password must be at least 6 characters long.');
    if (!hostelPgName.trim() || !deliveryAddress.trim() || !collegeName.trim())
      return setError('Please fill in your Hostel/PG name, delivery address, and college name.');

    const res = registerUser({
      name,
      email,
      mobile,
      password,
      hostelPgName,
      deliveryAddress,
      collegeName,
      dehradunArea,
    });
    if (!res.ok) {
      setError(res.error ?? 'Unable to create account.');
      return;
    }
    navigate('home');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      hostelPgName: editHostel,
      deliveryAddress: editAddress,
      collegeName: editCollege,
      dehradunArea: editArea,
    });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 3000);
  };

  if (currentUser) {
    const activeSubs = subscriptions.filter((s) => s.status === 'Active');
    const userFeedbacks = feedbacks.filter(
      (f) => f.customerId === currentUser.id || f.customerName === currentUser.name
    );

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D6] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF3EE] text-[#1B6B44] flex items-center justify-center font-display text-2xl font-semibold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#17231C]">
                {currentUser.name}
              </h1>
              <p className="text-sm text-[#56635B]">
                {currentUser.collegeName} · {currentUser.dehradunArea}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logoutUser();
              navigate('home');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#B83B24] border border-[#B83B24]/30 bg-white hover:bg-[#FDF1E8] rounded-xl transition-colors self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-5">
            <div className="text-xs text-[#56635B]">Orders Placed</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#17231C] mt-1">
              {customerVisibleOrders.length}
            </div>
          </div>
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-5">
            <div className="text-xs text-[#56635B]">Active Subscriptions</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#1B6B44] mt-1">
              {activeSubs.length}
            </div>
          </div>
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-5">
            <div className="text-xs text-[#56635B]">Feedback Submitted</div>
            <div className="font-mono tabular-nums text-2xl font-semibold text-[#D96B27] mt-1">
              {userFeedbacks.length}
            </div>
          </div>
        </div>

        {/* Editable Delivery Details */}
        <form
          onSubmit={handleProfileSave}
          className="bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-[#17231C]">
              Student &amp; Hostel Delivery Information
            </h2>
            {profileSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B6B44]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1.5">
              <label className="block font-medium text-[#56635B]">Email Address</label>
              <input
                type="text"
                disabled
                value={currentUser.email}
                className="w-full px-3.5 py-2.5 bg-[#F3F0E6] border border-[#E5E1D6] rounded-xl text-[#56635B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-medium text-[#56635B]">Mobile Number</label>
              <input
                type="text"
                disabled
                value={currentUser.mobile}
                className="w-full px-3.5 py-2.5 bg-[#F3F0E6] border border-[#E5E1D6] rounded-xl text-[#56635B] font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="prof-college" className="block font-medium text-[#17231C]">
                College / University Name
              </label>
              <input
                id="prof-college"
                type="text"
                value={editCollege}
                onChange={(e) => setEditCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="prof-area" className="block font-medium text-[#17231C]">
                Dehradun Locality
              </label>
              <select
                id="prof-area"
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
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
              <label htmlFor="prof-hostel" className="block font-medium text-[#17231C]">
                Hostel / PG Name
              </label>
              <input
                id="prof-hostel"
                type="text"
                value={editHostel}
                onChange={(e) => setEditHostel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="prof-address" className="block font-medium text-[#17231C]">
                Delivery Address
              </label>
              <input
                id="prof-address"
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Save Profile Changes
          </button>
        </form>

        {/* Submitted Feedback & Active Plans Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#17231C]">
                Active Meal Plans
              </h3>
              <button
                type="button"
                onClick={() => navigate('plans')}
                className="text-xs font-semibold text-[#1B6B44] hover:underline"
              >
                Manage Plans →
              </button>
            </div>
            {activeSubs.length === 0 ? (
              <p className="text-sm text-[#56635B]">No active meal plans yet.</p>
            ) : (
              activeSubs.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl flex justify-between items-center text-sm"
                >
                  <div>
                    <div className="font-semibold text-[#17231C]">{s.planType} Plan</div>
                    <div className="text-xs text-[#56635B]">Starts {s.startDate}</div>
                  </div>
                  <div className="font-mono font-semibold text-[#1B6B44]">
                    {formatINR(s.calculatedTotal)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border border-[#E5E1D6] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#17231C]">
                Your Submitted Feedback
              </h3>
              <button
                type="button"
                onClick={() => navigate('orders')}
                className="text-xs font-semibold text-[#1B6B44] hover:underline"
              >
                View Orders →
              </button>
            </div>
            {userFeedbacks.length === 0 ? (
              <p className="text-sm text-[#56635B]">
                No feedback submitted yet. Rate a delivered order in My Orders to see it here.
              </p>
            ) : (
              userFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl space-y-1 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#17231C]">{fb.mealNames.join(', ')}</span>
                    <span className="font-mono text-xs font-semibold text-[#D96B27]">
                      {fb.ratings.overall}/5 ★
                    </span>
                  </div>
                  <p className="text-xs text-[#56635B] line-clamp-2">&ldquo;{fb.comment}&rdquo;</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Brand Context */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B6B44]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Dehradun Hostel &amp; PG Student Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#17231C] leading-tight">
            {mode === 'login' ? 'Welcome back to HostelBite' : 'Create your student account'}
          </h1>
          <p className="text-sm sm:text-base text-[#56635B] leading-relaxed">
            Save your Dehradun hostel or PG address once, track orders easily, build weekly or
            monthly meal plans, and share meal ratings directly with nearby home kitchens.
          </p>

          <div className="bg-[#F3F0E6] border border-[#E5E1D6] rounded-2xl p-5 space-y-3 text-sm">
            <div className="font-semibold text-[#17231C]">Prefer to look around first?</div>
            <p className="text-xs text-[#56635B] leading-relaxed">
              Guest browsing is always open. Explore home-style meals, calculate subscription
              totals, and test checkout before creating an account.
            </p>
            <button
              type="button"
              onClick={() => navigate('explore')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B6B44] hover:underline"
            >
              <span>Continue Browsing as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Auth Card */}
        <div className="lg:col-span-7 bg-white border border-[#E5E1D6] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="inline-flex p-1 bg-[#F3F0E6] rounded-xl w-full">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                mode === 'login' ? 'bg-white text-[#17231C] shadow-xs' : 'text-[#56635B]'
              }`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                mode === 'signup' ? 'bg-white text-[#17231C] shadow-xs' : 'text-[#56635B]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-sm font-medium text-[#17231C]">
                  Email Address *
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-[#17231C]"
                >
                  Password *
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                />
              </div>

              {error && (
                <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-2.5 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Login to HostelBite
              </button>

              <div className="pt-3 border-t border-[#E5E1D6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#56635B]">
                <span>Demo student: aarav.student@demo.hostelbite.in / password123</span>
                <button
                  type="button"
                  onClick={handleFillDemoLogin}
                  className="font-semibold text-[#1B6B44] hover:underline"
                >
                  Auto-fill Demo Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="su-name" className="block text-sm font-medium text-[#17231C]">
                    Full Name *
                  </label>
                  <input
                    id="su-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="su-mobile" className="block text-sm font-medium text-[#17231C]">
                    Mobile Number *
                  </label>
                  <input
                    id="su-mobile"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="su-email" className="block text-sm font-medium text-[#17231C]">
                    Email Address *
                  </label>
                  <input
                    id="su-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu.in"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="su-password" className="block text-sm font-medium text-[#17231C]">
                    Password *
                  </label>
                  <input
                    id="su-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="su-college" className="block text-sm font-medium text-[#17231C]">
                    College / University Name *
                  </label>
                  <input
                    id="su-college"
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="DBS Global University"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="su-area" className="block text-sm font-medium text-[#17231C]">
                    Dehradun Location *
                  </label>
                  <select
                    id="su-area"
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
                  <label htmlFor="su-hostel" className="block text-sm font-medium text-[#17231C]">
                    Hostel / PG Name *
                  </label>
                  <input
                    id="su-hostel"
                    type="text"
                    required
                    value={hostelPgName}
                    onChange={(e) => setHostelPgName(e.target.value)}
                    placeholder="e.g., Green View PG, Room 302"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="su-address" className="block text-sm font-medium text-[#17231C]">
                    Delivery Address *
                  </label>
                  <input
                    id="su-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street / landmark in Dehradun"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAF6] border border-[#E5E1D6] rounded-xl focus:bg-white focus:border-[#1B6B44] focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-[#B83B24] bg-[#FDF1E8] px-4 py-2.5 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1B6B44] hover:bg-[#135233] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Create Student Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
