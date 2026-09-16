'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export function AdminPlanManager({ plans }: { plans: any[] }) {
  const [planList, setPlanList] = useState(plans);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleSavePlan(plan: any) {
    setSavingId(plan.id);
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          priceMonthly: plan.priceMonthly,
          priceYearly: plan.priceYearly,
          profileLimit: plan.profileLimit,
          serviceLimit: plan.serviceLimit,
          productLimit: plan.productLimit,
          nfcLimit: plan.nfcLimit,
        }),
      });

      if (!res.ok) throw new Error('Failed to update plan');
      alert(`Plan ${plan.name} updated successfully!`);
    } catch (e) {
      alert('Error updating plan');
    } finally {
      setSavingId(null);
    }
  }

  function updatePlanField(id: string, field: string, value: any) {
    setPlanList(
      planList.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {planList.map((p) => (
        <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-base">{p.name}</h4>
            <span className="text-[10px] font-mono bg-slate-900 text-emerald-400 px-2 py-1 rounded border border-slate-800">
              {p.code}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Monthly Price (NGN ₦)</label>
              <input
                type="number"
                value={p.priceMonthly}
                onChange={(e) => updatePlanField(p.id, 'priceMonthly', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Services Limit</label>
                <input
                  type="number"
                  value={p.serviceLimit}
                  onChange={(e) => updatePlanField(p.id, 'serviceLimit', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cards & Stickers Limit</label>
                <input
                  type="number"
                  value={p.nfcLimit}
                  onChange={(e) => updatePlanField(p.id, 'nfcLimit', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSavePlan(p)}
            disabled={savingId === p.id}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingId === p.id ? 'Saving...' : 'Update Plan Config'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
