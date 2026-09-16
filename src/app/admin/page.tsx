import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Users, Building, Zap, QrCode, CreditCard, CheckCircle, ShieldAlert, Edit3 } from 'lucide-react';
import { AdminProfileTable } from '@/components/admin/AdminProfileTable';
import { AdminUserTable } from '@/components/admin/AdminUserTable';
import { AdminPlanManager } from '@/components/admin/AdminPlanManager';

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }
  const totalUsers = await prisma.user.count();
  const totalProfiles = await prisma.profile.count();
  const verifiedProfiles = await prisma.profile.count({ where: { isVerified: true } });
  const totalNfcTags = await prisma.nfcTag.count();

  const totalNfcTaps = await prisma.analyticsEvent.count({ where: { eventType: 'NFC_TAP' } });
  const totalQrScans = await prisma.analyticsEvent.count({ where: { eventType: 'QR_SCAN' } });

  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: true },
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { subscription: { include: { plan: true } } },
  });

  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { priceMonthly: 'asc' },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Platform Admin Dashboard</h1>
        <p className="text-xs text-slate-400">System metrics, business verification, user management & subscription pricing</p>
      </div>

      {/* System Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalUsers}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Business Profiles</span>
            <Building className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalProfiles} ({verifiedProfiles} Verified ✓)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Card & Sticker Taps</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalNfcTaps.toLocaleString()}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total QR Code Scans</span>
            <QrCode className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalQrScans.toLocaleString()}</div>
        </div>
      </div>

      {/* Subscription Plan Config Studio */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span>Subscription Plans & Pricing Configuration</span>
        </h2>
        <AdminPlanManager plans={plans as any} />
      </div>

      {/* Profiles Verification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Business Profiles & Verification Badges</span>
        </h2>
        <AdminProfileTable initialProfiles={profiles as any} />
      </div>

      {/* Users Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-400" />
          <span>User Accounts & RBAC Controls</span>
        </h2>
        <AdminUserTable initialUsers={users as any} />
      </div>
    </div>
  );
}
