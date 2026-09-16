'use client';

import { useState, useEffect } from 'react';
import { Scissors, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function ServicesManagerPage() {
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
        setServices(prof.services || []);
      }
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice('');
    setDuration('45 Mins');
    setImageUrl('');
    setModalOpen(true);
  }

  function openEditModal(srv: any) {
    setEditingService(srv);
    setName(srv.name);
    setDescription(srv.description || '');
    setPrice(srv.price.toString());
    setDuration(srv.duration || '');
    setImageUrl(srv.imageUrl || '');
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        profileId: profile.id,
        name,
        description,
        price: parseFloat(price),
        duration,
        imageUrl,
      };

      const url = '/api/services';
      const method = editingService ? 'PATCH' : 'POST';
      const body = editingService ? { ...payload, id: editingService.id } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save service');

      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert('Error saving service');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    window.location.reload();
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Services...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Services Management</h1>
          <p className="text-xs text-slate-400 mt-1">Add, edit, or toggle services displayed on your digital profile</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{srv.name}</h3>
                  <span className="font-extrabold text-emerald-400 text-base">₦{srv.price.toLocaleString()}</span>
                </div>
                {srv.description && <p className="text-xs text-slate-400 mb-3">{srv.description}</p>}
                {srv.duration && <span className="text-[11px] text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">{srv.duration}</span>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(srv)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <Scissors className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Services Added Yet</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">Create your first service so customers can view pricing and book online.</p>
          <button
            onClick={openCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Service</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white relative shadow-2xl">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bespoke Senator Suit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Price (NGN ₦)</label>
                <input
                  type="number"
                  required
                  placeholder="45000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Duration (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 45 Mins, 4 Days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about material, measurements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <ImageUploader
                  label="Service Image (Optional)"
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url as string)}
                  aspect="landscape"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl transition"
              >
                {submitting ? 'Saving...' : 'Save Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
