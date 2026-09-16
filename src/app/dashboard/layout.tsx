import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
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
} from 'lucide-react';
import { DashboardSidebarNav } from '@/components/dashboard/DashboardSidebarNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const primaryProfile = user.profiles[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sidebar Navigation */}
      <DashboardSidebarNav user={user as any} primaryProfile={primaryProfile as any} />

      {/* Main Dashboard Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
