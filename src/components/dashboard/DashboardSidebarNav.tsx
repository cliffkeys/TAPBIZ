'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Scissors,
  ShoppingBag,
  Zap,
  QrCode,
  BarChart3,
  Calendar,
  Star,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  user: {
    fullName: string;
    email: string;
    role: string;
    subscription?: { plan: { name: string; code: string } } | null;
  };
  primaryProfile?: {
    username: string;
    businessName: string;
  } | null;
}

export function DashboardSidebarNav({ user, primaryProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'My Profile', icon: User },
    { href: '/dashboard/services', label: 'Services', icon: Scissors },
    { href: '/dashboard/products', label: 'Products', icon: ShoppingBag },
    { href: '/dashboard/nfc', label: 'Cards & Stickers', icon: Zap },
    { href: '/dashboard/qr', label: 'QR Code Studio', icon: QrCode },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
    { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
    { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black">
            ⚡
          </div>
          <span className="font-extrabold text-white">TapBiz.ng</span>
        </Link>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-300 hover:text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Overlay */}
      <aside
        className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-transform ${
          mobileOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:flex'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg">
              ⚡
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base">TapBiz.ng</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {user.subscription?.plan?.name || 'Free Plan'}
              </span>
            </div>
          </Link>

          {/* Public Profile Link Preview */}
          {primaryProfile && (
            <div className="mb-6 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Public Profile</span>
                <span className="text-xs font-semibold text-emerald-400 truncate block">/p/{primaryProfile.username}</span>
              </div>
              <Link
                href={`/p/${primaryProfile.username}`}
                target="_blank"
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition shrink-0"
                title="View Live Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{user.fullName}</span>
              <span className="text-[10px] text-slate-400 truncate block">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
