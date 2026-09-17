'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Phone,
  Mail,
  FileText,
  MessageCircle,
  Plus,
  Filter,
  Check,
} from 'lucide-react';

export default function BookingsManagerPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual booking form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [formLoading, setFormLoading] = useState(false);

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
        setBookings(prof.bookings || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      alert('Error updating booking status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !customerName || !customerPhone || !bookingDate || !bookingTime) return;

    setFormLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          serviceId: selectedServiceId || null,
          customerName,
          customerPhone,
          customerEmail,
          bookingDate,
          bookingTime,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.booking) {
        setBookings((prev) => [data.booking, ...prev]);
        setShowAddModal(false);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setBookingDate('');
        setBookingTime('');
        setNotes('');
        setSelectedServiceId('');
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (e) {
      alert('Error creating booking');
    } finally {
      setFormLoading(false);
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-slate-400 font-medium">
        Loading Appointments & Bookings...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Appointments & Bookings Manager</h1>
          </div>
          <p className="text-xs text-slate-400">Manage online appointment requests & add manual offline customer bookings.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Metrics & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'ALL'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'PENDING'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-400'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('CONFIRMED')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'CONFIRMED'
                ? 'bg-teal-400 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-teal-400'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              filterStatus === 'COMPLETED'
                ? 'bg-blue-500 text-white font-extrabold shadow-md'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-blue-400'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const formatWaNumber = (num: string) => {
              let d = num.replace(/[^0-9]/g, '');
              if (d.startsWith('0') && d.length === 11) d = '234' + d.slice(1);
              if (d.length === 10) d = '234' + d;
              return d;
            };
            const formattedPhone = b.customerPhone ? formatWaNumber(b.customerPhone) : '';
            const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
              `Hello ${b.customerName}, regarding your appointment booking for ${b.bookingDate} at ${b.bookingTime} with ${profile?.businessName || 'us'}:`
            )}`;


            return (
              <div
                key={b.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-700 transition shadow-xl"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-extrabold text-white text-base">{b.customerName}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : b.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {b.status}
                    </span>

                    {b.service?.name && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {b.service.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{b.customerPhone}</span>
                    </a>

                    {b.customerEmail && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{b.customerEmail}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{b.bookingDate} at {b.bookingTime}</span>
                    </span>

                    {b.totalPrice > 0 && (
                      <span className="font-extrabold text-emerald-400">
                        ₦{b.totalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {b.notes && (
                    <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                      <strong className="text-slate-400 block mb-0.5">Notes:</strong>
                      <span>&ldquo;{b.notes}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {formattedPhone && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border border-emerald-500/20 transition flex items-center gap-1.5"
                      title="Chat with Customer on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {b.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatusChange(b.id, 'CONFIRMED')}
                      disabled={updatingId === b.id}
                      className="bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-400 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-teal-400 transition"
                    >
                      Confirm
                    </button>
                  )}

                  {b.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                      disabled={updatingId === b.id}
                      className="bg-slate-800 hover:bg-blue-500 hover:text-white text-blue-400 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-blue-400 transition"
                    >
                      Complete
                    </button>
                  )}

                  {b.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                      disabled={updatingId === b.id}
                      className="bg-slate-800 hover:bg-red-500 hover:text-white text-red-400 text-xs font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-700 hover:border-red-400 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Appointments Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filterStatus === 'ALL'
              ? 'Appointments booked by customers through your digital profile will appear here.'
              : `No appointments currently marked as ${filterStatus.toLowerCase()}.`}
          </p>
        </div>
      )}

      {/* New Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Create New Appointment</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Okafor"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Email (Optional)</label>
                <input
                  type="email"
                  placeholder="samuel@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time *</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {profile?.services?.length > 0 && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Service (Optional)</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">General Appointment</option>
                    {profile.services.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₦{s.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Special requests or appointment details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg"
                >
                  {formLoading ? 'Saving...' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
