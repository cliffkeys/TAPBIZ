import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { ShieldCheck, Users, Building, CreditCard, ArrowLeft } from 'lucide-react';

import { prisma } from '@/lib/prisma';

import { AdminHeaderLogout } from '@/components/admin/AdminHeaderLogout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // If not authenticated as ADMIN, render children directly (allows /admin/login to display full screen)
  if (!user || user.role !== 'ADMIN') {
    return <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-black">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <header className="bg-slate-900/90 border-b border-slate-800 p-4 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <div>
                <span className="font-extrabold text-white text-base block">TapBiz Admin Console</span>
                <span className="text-[10px] text-slate-400 block">System Control Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-3 py-1 rounded-full hidden sm:inline-block">
              {user.email} (ADMIN)
            </span>
            <AdminHeaderLogout />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
