'use client';

import { useState, useEffect } from 'react';
import { User, Save, CheckCircle2, AlertCircle, Building } from 'lucide-react';
import { BUSINESS_CATEGORIES, PROFILE_THEMES } from '@/lib/constants';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function ProfileBuilderPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.profiles?.[0]) {
          setProfile(data.user.profiles[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save profile changes');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving changes' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Profile Builder...</div>;
  if (!profile) return <div className="p-8 text-center text-slate-400">No profile found. Please create one.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Digital Business Profile Builder</h1>
        <p className="text-xs text-slate-400 mt-1">Edit your business details, branding, contact info, and theme</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Type Selector: Business vs Personal / Leader */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Profile Type</h2>
          <p className="text-xs text-slate-400">Choose whether this profile represents a business storefront or an individual leader / CEO / creator.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setProfile({ ...profile, profileType: 'BUSINESS' })}
              className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 ${
                (profile.profileType || 'BUSINESS') === 'BUSINESS'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">💼 Business Storefront</h4>
                <p className="text-xs text-slate-400">For shops, salons, restaurants & agencies. Showcases services, product catalog & opening hours.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setProfile({ ...profile, profileType: 'PERSONAL' })}
              className={`p-5 rounded-2xl border text-left transition flex items-start gap-4 ${
                profile.profileType === 'PERSONAL'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">👤 Personal / CEO / Community Leader</h4>
                <p className="text-xs text-slate-400">For founders, executives & community leaders. Focuses on your bio, roles, accomplishments & social links.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Basic Business or Personal Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            {profile.profileType === 'PERSONAL' ? 'Personal Details & Leadership Roles' : 'Basic Business Information'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                {profile.profileType === 'PERSONAL' ? 'Full Name' : 'Business Name'}
              </label>
              <input
                type="text"
                required
                placeholder={profile.profileType === 'PERSONAL' ? 'e.g. Cliff Nwachukwu' : 'e.g. Cliff Tailoring Studio'}
                value={profile.businessName || ''}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                {profile.profileType === 'PERSONAL' ? 'Personal Title / Headline' : 'Category'}
              </label>
              {profile.profileType === 'PERSONAL' ? (
                <input
                  type="text"
                  placeholder="e.g. CEO @ TechVibe & Community Leader"
                  value={profile.personalTitle || ''}
                  onChange={(e) => setProfile({ ...profile, personalTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <select
                  value={profile.category || 'Tailor & Fashion'}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {profile.profileType === 'PERSONAL' && (
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Key Accomplishments & Roles (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Founder @ Cliff Group, Guild Chairman, African Tech Speaker"
                value={profile.highlights || ''}
                onChange={(e) => setProfile({ ...profile, highlights: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Business Handle / Slug</label>
            <div className="flex items-center">
              <span className="bg-slate-950 border border-r-0 border-slate-800 text-slate-500 text-xs px-3 py-3 rounded-l-xl">
                tapbiz.ng/p/
              </span>
              <input
                type="text"
                required
                value={profile.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                className="w-full bg-slate-950 border border-slate-800 rounded-r-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Tagline / Short Bio</label>
            <textarea
              rows={2}
              value={profile.description || ''}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Media, Story & Gallery Showcase */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Photos, Story & Media Gallery</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <ImageUploader
                label="Profile Picture / Founder Photo"
                placeholder="Upload Founder Photo"
                value={profile.avatarUrl}
                onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
              />
            </div>

            <div>
              <ImageUploader
                label="Business Logo"
                placeholder="Upload Business Logo"
                value={profile.logoUrl}
                onChange={(url) => setProfile({ ...profile, logoUrl: url })}
              />
            </div>

            <div>
              <ImageUploader
                label="Cover Banner Photo"
                placeholder="Upload Cover Photo"
                value={profile.coverUrl}
                onChange={(url) => setProfile({ ...profile, coverUrl: url })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Detailed "About Me & Business" Story</label>
            <textarea
              rows={5}
              placeholder="Tell your clients about yourself, your background, experience, craft, and mission..."
              value={profile.aboutStory || ''}
              onChange={(e) => setProfile({ ...profile, aboutStory: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-y"
            />
          </div>

          <div>
            <ImageUploader
              label="Work & Product Showcase Gallery"
              placeholder="Upload Showcase Photos to Gallery"
              multiple
              value={profile.galleryImages}
              onChange={(urls) => setProfile({ ...profile, galleryImages: urls })}
            />
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Contact & Location</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                required
                value={profile.whatsapp || ''}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Website URL</label>
              <input
                type="url"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Address</label>
              <input
                type="text"
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">City</label>
              <input
                type="text"
                value={profile.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">State</label>
              <input
                type="text"
                value={profile.state || ''}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Social Media Channels & Handles Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Social Media Channels & Handles</h2>
              <p className="text-xs text-slate-400">Connect your official social media pages so customers can follow and message you.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const current = profile.socialLinks || [];
                setProfile({
                  ...profile,
                  socialLinks: [...current, { platform: 'Instagram', url: '', handle: '' }],
                });
              }}
              className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold px-3.5 py-2 rounded-xl border border-emerald-500/20 text-xs transition"
            >
              + Add Social Link
            </button>
          </div>

          {(profile.socialLinks || []).length > 0 ? (
            <div className="space-y-3">
              {(profile.socialLinks || []).map((s: any, idx: number) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Platform</label>
                    <select
                      value={s.platform || 'Instagram'}
                      onChange={(e) => {
                        const current = [...(profile.socialLinks || [])];
                        current[idx] = { ...current[idx], platform: e.target.value };
                        setProfile({ ...profile, socialLinks: current });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="X (Twitter)">X (Twitter)</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Threads">Threads</option>
                      <option value="Pinterest">Pinterest</option>
                      <option value="Website">Website</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Profile Link / URL</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/yourhandle"
                      value={s.url || ''}
                      onChange={(e) => {
                        const current = [...(profile.socialLinks || [])];
                        current[idx] = { ...current[idx], url: e.target.value };
                        setProfile({ ...profile, socialLinks: current });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Handle / Username</label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={s.handle || ''}
                      onChange={(e) => {
                        const current = [...(profile.socialLinks || [])];
                        current[idx] = { ...current[idx], handle: e.target.value };
                        setProfile({ ...profile, socialLinks: current });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        const current = [...(profile.socialLinks || [])];
                        current.splice(idx, 1);
                        setProfile({ ...profile, socialLinks: current });
                      }}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
                      title="Remove Social Link"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
              No social media links added yet. Click "+ Add Social Link" to showcase your Instagram, Facebook, LinkedIn, TikTok, or YouTube handles.
            </div>
          )}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Visual Profile Theme</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PROFILE_THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setProfile({ ...profile, theme: th.id })}
                className={`p-4 rounded-2xl border text-left transition ${
                  profile.theme === th.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <h4 className="font-bold text-sm text-white mb-1">{th.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{th.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-8 py-4 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
