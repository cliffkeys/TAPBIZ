'use client';

import { useState, useEffect } from 'react';
import { Zap, Copy, Check, Plus, ShieldAlert, Smartphone, ExternalLink, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function NfcManagementPage() {
  const [profile, setProfile] = useState<any>(null);
  const [nfcTags, setNfcTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New tag modal
  const [modalOpen, setModalOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user?.profiles?.[0]) {
        const prof = data.user.profiles[0];
        setProfile(prof);
        setNfcTags(prof.nfcTags || []);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCopyUrl(token: string) {
    const url = `${window.location.origin}/t/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  }

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!tagName) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/nfc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id, tagName }),
      });

      if (!res.ok) throw new Error('Failed to create tag');

      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert('Error creating NFC Tag');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await fetch('/api/nfc', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    window.location.reload();
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading NFC Tags Studio...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Cards & Stickers Studio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Create & manage physical smart cards and stickers pointing dynamically to your digital profile.
          </p>
        </div>

        <button
          onClick={() => {
            setTagName(`Smart Card 00${nfcTags.length + 1}`);
            setModalOpen(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Smart Card</span>
        </button>
      </div>

      {/* Active Tags Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Your Registered Cards & Stickers</h2>

        {nfcTags.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nfcTags.map((tag) => {
              const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://tapbiz.ng'}/t/${tag.tagToken}`;
              return (
                <div key={tag.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{tag.tagName}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">Token: {tag.tagToken}</span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                        tag.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {tag.status}
                    </span>
                  </div>

                  {/* Tap Stats */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Taps</span>
                      <strong className="text-emerald-400 font-extrabold text-lg">{tag.tapCount.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Last Tapped</span>
                      <strong className="text-slate-300 font-medium text-xs">
                        {tag.lastTappedAt ? new Date(tag.lastTappedAt).toLocaleDateString() : 'Never'}
                      </strong>
                    </div>
                  </div>

                  {/* Generated URL & Copy Box */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Destination Profile URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={fullUrl}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopyUrl(tag.tagToken)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition shrink-0 flex items-center gap-1"
                      >
                        {copiedToken === tag.tagToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedToken === tag.tagToken ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <Link
                      href={`/t/${tag.tagToken}`}
                      target="_blank"
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Test Redirect</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleToggleStatus(tag.id, tag.status)}
                      className={`font-semibold ${tag.status === 'ACTIVE' ? 'text-red-400 hover:underline' : 'text-emerald-400 hover:underline'}`}
                    >
                      {tag.status === 'ACTIVE' ? 'Disable Card' : 'Enable Card'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            No Smart Cards or Stickers created yet. Click &ldquo;Create New Smart Card&rdquo; above.
          </div>
        )}
      </div>

      {/* User-friendly non-technical guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span>How Cards & Stickers Connect to Your Profile</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {[
            { step: 'Step 1', title: 'Create Card Link', text: 'Generate your smart card or sticker token above.' },
            { step: 'Step 2', title: 'Receive Physical Card', text: 'Your physical card or sticker comes pre-synced to your business profile.' },
            { step: 'Step 3', title: 'Display & Share', text: 'Place your sticker on your phone case or desk, or hand out smart cards to clients.' },
            { step: 'Step 4', title: 'Instant Customer Taps', text: 'Customers hold their smartphone near your card or sticker to view your profile instantly.' },
          ].map((st, i) => (
            <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-emerald-400 font-bold uppercase text-[10px]">{st.step}</span>
              <h4 className="font-bold text-white text-sm">{st.title}</h4>
              <p className="text-slate-400 leading-relaxed">{st.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white relative shadow-2xl space-y-4">
            <h2 className="text-xl font-bold">Create New Smart Card Record</h2>

            <form onSubmit={handleCreateTag} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Card / Sticker Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reception Desk Card"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl text-xs"
                >
                  {submitting ? 'Generating...' : 'Generate Card Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
