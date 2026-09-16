'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function SubscriptionPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleUpgrade(planCode: string) {
    setUpgrading(planCode);
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');

      // Redirect to Paystack Checkout URL
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      alert(err.message || 'Payment error');
    } finally {
      setUpgrading(null);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Subscription Studio...</div>;

  const currentPlanCode = user?.subscription?.plan?.code || 'FREE';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Subscription & Billing Studio</h1>
          </div>
          <p className="text-xs text-slate-400">Manage your subscription plan, Paystack payment integration, and feature limits.</p>
        </div>

        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Current Active Plan: {user?.subscription?.plan?.name || 'Free Starter'}</span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-white text-lg mb-2">FREE</h3>
            <div className="text-3xl font-black text-white mb-4">₦0<span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Profile</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 Services & Products</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Smart Card & Sticker</li>
            </ul>
          </div>
          <button disabled className="w-full bg-slate-800 text-slate-400 font-bold py-3 rounded-xl text-xs">
            {currentPlanCode === 'FREE' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        {/* PRO */}
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative shadow-xl shadow-emerald-500/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
            Recommended
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-2">PRO GROWTH</h3>
            <div className="text-3xl font-black text-emerald-400 mb-4">₦2,500<span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Services & Products</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 Smart Cards & Stickers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Remove Branding</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Advanced Analytics</li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade('PRO')}
            disabled={currentPlanCode === 'PRO' || upgrading === 'PRO'}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl text-xs transition"
          >
            {currentPlanCode === 'PRO' ? 'Current Active Plan' : upgrading === 'PRO' ? 'Processing...' : 'Upgrade via Paystack'}
          </button>
        </div>

        {/* BUSINESS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-white text-lg mb-2">BUSINESS</h3>
            <div className="text-3xl font-black text-white mb-4">₦7,500<span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 5 Profiles</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 20 Smart Cards & Stickers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Priority Support</li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade('BUSINESS')}
            disabled={currentPlanCode === 'BUSINESS' || upgrading === 'BUSINESS'}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition"
          >
            {currentPlanCode === 'BUSINESS' ? 'Current Active Plan' : upgrading === 'BUSINESS' ? 'Processing...' : 'Upgrade via Paystack'}
          </button>
        </div>
      </div>
    </div>
  );
}
