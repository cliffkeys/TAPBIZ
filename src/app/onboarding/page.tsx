'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Scissors,
  UserCheck,
  Utensils,
  Sparkles,
  Camera,
  Building,
  ShoppingBag,
  Briefcase,
  Grid,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { BUSINESS_CATEGORIES, PROFILE_THEMES } from '@/lib/constants';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('Tailor & Fashion');
  const [businessName, setBusinessName] = useState('');
  const [handle, setHandle] = useState('');
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [handleError, setHandleError] = useState('');
  const [checkingHandle, setCheckingHandle] = useState(false);
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Aba');
  const [state, setState] = useState('Abia State');
  const [theme, setTheme] = useState('MODERN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate handle when business name changes
  useEffect(() => {
    if (businessName && !handle) {
      const slug = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setHandle(slug);
    }
  }, [businessName, handle]);

  // Real-time handle check effect
  useEffect(() => {
    if (!handle || handle.length < 3) {
      setHandleAvailable(null);
      setHandleError('');
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingHandle(true);
      try {
        const res = await fetch(`/api/profiles/check-handle?handle=${encodeURIComponent(handle)}`);
        const data = await res.json();
        setHandleAvailable(data.available);
        setHandleError(data.error || '');
      } catch (e) {
        setHandleAvailable(false);
      } finally {
        setCheckingHandle(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [handle]);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function handlePublish() {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          username: handle,
          category,
          phone,
          whatsapp: whatsapp || phone,
          city,
          state,
          theme,
        }),
      });

      const data = await res.json();
      if (res.status === 401 || data.error === 'Unauthorized') {
        throw new Error('AUTH_REQUIRED');
      }

      if (!res.ok) throw new Error(data.error || 'Failed to create profile');

      window.location.href = '/dashboard/nfc';
    } catch (err: any) {
      if (err.message === 'AUTH_REQUIRED') {
        setError('You need to be logged in to publish. Redirecting to login...');
        setTimeout(() => {
          window.location.href = `/login?redirect=/onboarding`;
        }, 1500);
      } else {
        setError(err.message || 'An error occurred while publishing.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{error}</div>}

        {/* STEP 1: Category */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">What type of business do you run?</h2>
              <p className="text-xs text-slate-400 mt-1">Select your primary business industry</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BUSINESS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border text-left flex flex-col items-center text-center justify-center gap-2 transition ${
                    category === cat
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold">{cat}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Next: Business Name & Handle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Name & Username */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Name & Handle</h2>
              <p className="text-xs text-slate-400 mt-1">Choose your business name and custom profile link</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cliff Tailoring Studio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Profile Handle / Slug</label>
                <div className="relative flex items-center">
                  <span className="bg-slate-950 border border-r-0 border-slate-800 text-slate-500 text-xs px-3 py-3 rounded-l-xl">
                    tapbiz.ng/p/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="cliff-tailoring"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-r-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {checkingHandle && <p className="text-xs text-amber-400 mt-1">Checking handle availability...</p>}
                {!checkingHandle && handleAvailable === true && (
                  <p className="text-xs text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Handle is available!</span>
                  </p>
                )}
                {!checkingHandle && handleAvailable === false && (
                  <p className="text-xs text-red-400 mt-1">{handleError || 'Handle is already taken or invalid.'}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition"
              >
                Back
              </button>
              <button
                disabled={!businessName || !handle || handleAvailable !== true}
                onClick={() => setStep(3)}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Next: Contact Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Contact & Location</h2>
              <p className="text-xs text-slate-400 mt-1">Let customers reach you on WhatsApp and phone</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+234 803 123 4567"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition"
              >
                Back
              </button>
              <button
                disabled={!phone}
                onClick={() => setStep(4)}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Next: Choose Theme</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Choose Theme & Publish */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Choose Profile Theme</h2>
              <p className="text-xs text-slate-400 mt-1">Select the visual theme for your business profile</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PROFILE_THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    theme === th.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <h4 className="font-bold text-sm text-white mb-1">{th.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{th.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition"
              >
                Back
              </button>
              <button
                disabled={loading}
                onClick={handlePublish}
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Publishing Profile...' : 'Publish Profile Now 🎉'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
