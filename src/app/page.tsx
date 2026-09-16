import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  QrCode,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  MessageCircle,
  Calendar,
  Scissors,
  Utensils,
  Camera,
  Building,
  UserCheck,
  ShoppingBag,
  HelpCircle,
  CreditCard,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                TapBiz<span className="text-emerald-400">.ng</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">One Tap. Your Business.</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-emerald-400 transition">
              How It Works
            </a>
            <a href="#features" className="hover:text-emerald-400 transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden">
        {/* Glow background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Built Specifically for Nigerian Businesses & Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Your Business. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              One Tap Away.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Create your digital profile and let customers connect with you through smart cards, stickers, QR codes, and one simple link.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base transition shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl text-base transition border border-slate-800 flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Interactive Visual Demonstration: Smart Card & Sticker -> Phone -> Profile */}
          <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6">
              Smart Card & Sticker Gateway Demo
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Step 1: Card & Sticker */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3 relative group hover:border-emerald-500/50 transition">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">1. Smart Card & Sticker</h4>
                <p className="text-xs text-slate-400">Stores your unique TapBiz profile link</p>
                <div className="text-[10px] font-mono bg-slate-900 text-emerald-400 py-1.5 px-2 rounded-lg border border-slate-800">
                  https://tapbiz.ng/p/cliff-tailoring
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-emerald-400">
                <Zap className="w-8 h-8 animate-pulse text-emerald-400" />
              </div>

              {/* Step 2: Smartphone Profile */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3 md:col-span-1 hover:border-teal-500/50 transition">
                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">2. Instant Profile Load</h4>
                <p className="text-xs text-slate-400">Customer holds phone near card/sticker & profile opens instantly</p>
                <Link
                  href="/p/cliff-tailoring"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline"
                >
                  <span>Preview Demo Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Simple 5-Step Process</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How TapBiz Works</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: '01', title: 'Create Profile', desc: 'Sign up and customize your business profile details, services, and products.' },
              { num: '02', title: 'Get Unique Link & QR', desc: 'Receive your dedicated TapBiz URL and downloadable high-res QR code.' },
              { num: '03', title: 'Receive Cards & Stickers', desc: 'Get your custom physical smart cards & stickers ready to share with anyone.' },
              { num: '04', title: 'Customers Tap or Scan', desc: 'Customers hold their smartphone near your card or scan your QR code.' },
              { num: '05', title: 'Instant Customer Action', desc: 'They instantly see your services, book appointments, chat on WhatsApp, or pay.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 relative hover:border-emerald-500/40 transition">
                <span className="text-3xl font-black text-emerald-500/30 block mb-3">{step.num}</span>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Powerful SaaS Features</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Everything Your Business Needs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Digital Business Profile', desc: 'Mobile-first profile showcases your logo, bio, operating hours, and location.' },
              { icon: Zap, title: 'Smart Card & Sticker Sync', desc: 'Physical card and sticker integration that updates dynamically whenever you change details.' },
              { icon: QrCode, title: 'Printable QR Code Studio', desc: 'Download PNG/SVG QR codes and print business card/standee templates.' },
              { icon: MessageCircle, title: 'Direct WhatsApp CTA', desc: 'Prefilled enquiry messages send customers directly into your WhatsApp inbox.' },
              { icon: Calendar, title: 'Appointment Bookings', desc: 'Let customers book services online without installing any app.' },
              { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track profile views, card taps, QR scans, WhatsApp clicks, and bookings.' },
            ].map((feat, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/40 transition group">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Tailored For Industry Leaders</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Who Uses TapBiz?</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Scissors, label: 'Barbers & Stylists', demo: '/p/kings-barber' },
              { icon: UserCheck, label: 'Tailors & Fashion', demo: '/p/cliff-tailoring' },
              { icon: Utensils, label: 'Restaurants & Kitchens', demo: '/p/aba-fresh-kitchen' },
              { icon: Sparkles, label: 'Beauty & Spas', demo: '/p/glow-beauty' },
              { icon: Camera, label: 'Photographers', demo: '/p/aba-photography' },
              { icon: Building, label: 'Real Estate Agents', demo: '/p/cliff-tailoring' },
              { icon: ShoppingBag, label: 'Retail & Boutiques', demo: '/p/cliff-tailoring' },
              { icon: CreditCard, label: 'Consultants & Pros', demo: '/p/cliff-tailoring' },
            ].map((uc, idx) => (
              <Link
                key={idx}
                href={uc.demo}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 text-center group transition"
              >
                <div className="w-10 h-10 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <uc.icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-white text-sm">{uc.label}</h5>
                <span className="text-[11px] text-slate-500 block mt-1">View Sample Profile →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Transparent Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Simple Plans For Every Business</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FREE Plan */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">FREE</h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">₦0</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Perfect for new businesses starting out with digital identity.</p>

                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Digital Profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to 5 Services & Products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>High-Res QR Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Basic Tap Analytics</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition text-center"
              >
                Get Started Free
              </Link>
            </div>

            {/* PRO Plan (Featured) */}
            <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10 scale-[1.03]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-2">PRO GROWTH</h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-emerald-400">₦2,500</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Ideal for active businesses wanting smart card management and appointment bookings.</p>

                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Everything in FREE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited Services & Products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 Smart Cards & Stickers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Remove &ldquo;Powered by TapBiz&rdquo;</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Advanced Analytics & Bookings</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl transition text-center shadow-lg shadow-emerald-500/20"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* BUSINESS Plan */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">BUSINESS</h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">₦7,500</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">For multi-branch enterprises, teams, and real estate agencies.</p>

                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to 5 Business Profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>20 Smart Cards & Stickers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Enterprise Analytics & Exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority Nigerian Support</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition text-center"
              >
                Choose Business Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Got Questions?</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How do Smart Cards & Stickers work?',
                a: 'Smart cards and stickers allow customers to access your full profile instantly when held near a smartphone camera or tapped.',
              },
              {
                q: 'Do my customers need any app installed?',
                a: 'No app required! Customers simply tap your card/sticker or scan your high-res TapBiz QR code using their phone camera, and your profile opens instantly in their browser.',
              },
              {
                q: 'Can I change my profile details after receiving my card?',
                a: 'Yes! Your card and sticker link dynamically to your TapBiz profile. You can update your phone number, logo, products, and services anytime from your dashboard without changing your card.',
              },
              {
                q: 'Are physical cards and stickers secure?',
                a: 'Yes. Your cards and stickers only store your public TapBiz web profile link. No passwords or private customer data are ever stored on them.',
              },
              {
                q: 'Can I track visitors and interactions?',
                a: 'Yes! TapBiz records profile views, card taps, QR scans, WhatsApp clicks, and bookings in real-time on your dashboard.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{item.q}</span>
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">TapBiz.ng</span>
            <span>— © {new Date().getFullYear()} TapBiz SaaS Nigeria. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-slate-300">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
