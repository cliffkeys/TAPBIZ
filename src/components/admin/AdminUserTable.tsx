'use client';

import { useState } from 'react';
import { Trash2, Shield } from 'lucide-react';

export function AdminUserTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);

  async function toggleStatus(userId: string, currentStatus: string) {
    const status = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status } : u)));
      }
    } catch (e) {
      alert('Error updating user status');
    }
  }

  async function toggleRole(userId: string, currentRole: string) {
    const role = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });

      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
      }
    } catch (e) {
      alert('Error updating user role');
    }
  }

  async function handleDeleteUser(userId: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete user "${name}" and all associated data?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (e) {
      alert('Error deleting user');
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
            <th className="py-3 px-4">Full Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Plan</th>
            <th className="py-3 px-4">Account Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-950/40">
              <td className="py-3.5 px-4 font-bold text-white">{u.fullName}</td>
              <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
              <td className="py-3.5 px-4">
                <button
                  onClick={() => toggleRole(u.id, u.role)}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition ${
                    u.role === 'ADMIN'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Click to toggle Admin/User role"
                >
                  {u.role}
                </button>
              </td>
              <td className="py-3.5 px-4 text-emerald-400 font-medium">
                {u.subscription?.plan?.name || 'Free Starter'}
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    u.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                <button
                  onClick={() => toggleStatus(u.id, u.status)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    u.status === 'ACTIVE'
                      ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                </button>

                <button
                  onClick={() => handleDeleteUser(u.id, u.fullName)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"
                  title="Delete User"
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
