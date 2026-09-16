'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Reply, CheckCircle, EyeOff, Edit3, Trash2, Check } from 'lucide-react';

export default function ReviewsManagerPage() {
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReplyId, setSavingReplyId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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
        setReviews(prof.reviews || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReply(reviewId: string) {
    if (!replyText.trim()) return;
    setSavingReplyId(reviewId);
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, replyText }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, reply: { replyText: replyText.trim() } } : r
          )
        );
        setReplyingId(null);
        setReplyText('');
      } else {
        alert('Failed to save reply');
      }
    } catch (e) {
      alert('Error saving review reply');
    } finally {
      setSavingReplyId(null);
    }
  }

  async function handleToggleStatus(reviewId: string, currentStatus: string) {
    const status = currentStatus === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
    setTogglingId(reviewId);
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, status }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
        );
      } else {
        alert('Failed to update review visibility');
      }
    } catch (e) {
      alert('Error updating review status');
    } finally {
      setTogglingId(null);
    }
  }

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const publishedCount = reviews.filter((r) => r.status === 'PUBLISHED').length;
  const repliedCount = reviews.filter((r) => r.reply?.replyText).length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-slate-400 font-medium">
        Loading Customer Reviews...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Customer Reviews & Endorsements Studio</h1>
          </div>
          <p className="text-xs text-slate-400">View ratings, respond to customer feedback, and control review visibility on your profile.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block font-semibold uppercase">Average Rating</span>
            <span className="font-extrabold text-white text-base flex items-center gap-1">
              {avgRating} <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-400 text-[10px] block font-semibold uppercase">Response Rate</span>
            <span className="font-extrabold text-emerald-400 text-base">
              {totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 100}%
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">{r.customerName}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                    <span className="text-xs text-slate-400 font-bold ml-1">{r.rating}.0 / 5.0</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(r.id, r.status)}
                  disabled={togglingId === r.id}
                  className={`text-xs font-extrabold px-4 py-1.5 rounded-full border transition ${
                    r.status === 'PUBLISHED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950'
                      : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white'
                  }`}
                  title="Click to toggle visibility on your profile"
                >
                  {r.status === 'PUBLISHED' ? 'Published ✓' : 'Hidden ✕'}
                </button>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
                &ldquo;{r.comment}&rdquo;
              </p>

              {r.reply && replyingId !== r.id ? (
                <div className="p-4 bg-slate-950/90 border-l-3 border-emerald-500 rounded-r-2xl text-xs space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Response from {profile?.businessName || 'Business'}:</span>
                    </span>
                    <button
                      onClick={() => {
                        setReplyingId(r.id);
                        setReplyText(r.reply.replyText);
                      }}
                      className="text-slate-400 hover:text-emerald-400 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Reply</span>
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-normal">{r.reply.replyText}</p>
                </div>
              ) : replyingId === r.id ? (
                <div className="space-y-3 pt-2">
                  <textarea
                    rows={3}
                    placeholder="Write a public response to this customer review..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none font-medium"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setReplyingId(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(r.id)}
                      disabled={savingReplyId === r.id}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs shadow-lg transition"
                    >
                      {savingReplyId === r.id ? 'Saving Reply...' : 'Post Official Reply'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setReplyingId(r.id);
                    setReplyText('');
                  }}
                  className="text-xs text-emerald-400 font-extrabold hover:underline flex items-center gap-1.5 pt-1"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply to Review</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <h3 className="text-base font-bold text-white">No Customer Reviews Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Reviews submitted by customers on your public profile will appear here where you can manage visibility and post official responses.
          </p>
        </div>
      )}
    </div>
  );
}
