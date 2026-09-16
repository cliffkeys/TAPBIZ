'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ExternalLink, Trash2 } from 'lucide-react';

export function AdminProfileTable({ initialProfiles }: { initialProfiles: any[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);

  async function toggleVerification(profileId: string, currentVerified: boolean) {
    const isVerified = !currentVerified;
    try {
      const res = await fetch('/api/admin/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, isVerified }),
      });

      if (res.ok) {
        setProfiles(
          profiles.map((p) => (p.id === profileId ? { ...p, isVerified } : p))
        );
      }
    } catch (e) {
      alert('Error updating verification status');
    }
  }

  async function handleDeleteProfile(profileId: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete profile "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/profiles?id=${profileId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProfiles(profiles.filter((p) => p.id !== profileId));
      } else {
        alert('Failed to delete profile');
      }
    } catch (e) {
      alert('Error deleting profile');
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
            <th className="py-3 px-4">Business Name</th>
            <th className="py-3 px-4">Handle</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Owner Email</th>
            <th className="py-3 px-4">Verification</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {profiles.map((p) => (
            <tr key={p.id} className="hover:bg-slate-950/40">
              <td className="py-3.5 px-4 font-bold text-white">{p.businessName}</td>
              <td className="py-3.5 px-4 font-mono text-emerald-400">/p/{p.username}</td>
              <td className="py-3.5 px-4 text-slate-300">{p.category}</td>
              <td className="py-3.5 px-4 text-slate-400">{p.user?.email}</td>
              <td className="py-3.5 px-4">
                {p.isVerified ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-slate-500 font-medium">Unverified</span>
                )}
              </td>
              <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                <Link
                  href={`/p/${p.username}`}
                  target="_blank"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => toggleVerification(p.id, p.isVerified)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    p.isVerified
                      ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {p.isVerified ? 'Unverify' : 'Verify'}
                </button>

                <button
                  onClick={() => handleDeleteProfile(p.id, p.businessName)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
                  title="Delete Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
