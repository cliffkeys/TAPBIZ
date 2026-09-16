'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, Edit2, X } from 'lucide-react';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function ProductsManagerPage() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
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
        setProducts(prof.products || []);
      }
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setSku('');
    setImageUrl('');
    setModalOpen(true);
  }

  function openEditModal(prod: any) {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description || '');
    setPrice(prod.price.toString());
    setSku(prod.sku || '');
    setImageUrl(prod.imageUrl || '');
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
        sku,
        imageUrl,
      };

      const url = '/api/products';
      const method = editingProduct ? 'PATCH' : 'POST';
      const body = editingProduct ? { ...payload, id: editingProduct.id } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save product');

      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert('Error saving product');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    window.location.reload();
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Products...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage physical products and inventory items displayed on your profile</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((prod) => (
            <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{prod.name}</h3>
                  <span className="font-extrabold text-teal-400 text-base">₦{prod.price.toLocaleString()}</span>
                </div>
                {prod.description && <p className="text-xs text-slate-400 mb-3">{prod.description}</p>}
                {prod.sku && <span className="text-[10px] text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 font-mono">SKU: {prod.sku}</span>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(prod)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
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
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Products Added Yet</h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">Add ready-to-wear items, merchandise, or products so visitors can order directly.</p>
          <button
            onClick={openCreateModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Product</span>
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
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ready-to-Wear Senator Wear"
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
                  placeholder="35000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">SKU / Code (Optional)</label>
                <input
                  type="text"
                  placeholder="CLIFF-SEN-01"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Product specs, sizes, material..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <ImageUploader
                  label="Product Photo (Optional)"
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
                {submitting ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
