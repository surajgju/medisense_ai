import React, { useState } from 'react';
import { ShieldCheck, UserPlus, X } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { DEPARTMENTS, HOSPITALS } from '../../data/healthcareData';
import type { DepartmentName, UserAccount } from '../../types/healthcare';
import { StatusLabel } from '../ui/StatusLabel';

export const UserManagementView: React.FC = () => {
  const { users, toggleUserStatus, addUser } = useHealthcare();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserAccount['role']>('Senior Consultant');
  const [dept, setDept] = useState<DepartmentName>('Cardiology');
  const [error, setError] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      setError('Please enter a valid clinician name and institutional email address.');
      return;
    }

    addUser({
      id: `USR-0${users.length + 1}`,
      name: name.trim(),
      email: email.trim(),
      role,
      department: dept,
      hospital: HOSPITALS[0].name,
      status: 'Active',
      mfaEnabled: true,
      lastActive: 'Invited (Demo)',
    });
    setName('');
    setEmail('');
    setError('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            User Management & Clinical Access Controls
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Role-based access control (RBAC) across clinicians, radiologists, laboratory directors, and operations admins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Team Member
        </button>
      </div>

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold">Department & Hospital</th>
                <th className="py-3 px-3 font-semibold">MFA Security</th>
                <th className="py-3 px-3 font-semibold">Last Active</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{u.role}</td>
                  <td className="py-3 px-3">
                    <div className="text-slate-700 dark:text-slate-300">{u.department}</div>
                    <div className="text-[11px] text-slate-400">{u.hospital}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <ShieldCheck
                        className={`w-3.5 h-3.5 ${
                          u.mfaEnabled ? 'text-emerald-600' : 'text-amber-500'
                        }`}
                      />
                      {u.mfaEnabled ? 'Enforced' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{u.lastActive}</td>
                  <td className="py-3 px-3">
                    <StatusLabel label={u.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className="rounded border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add Clinical Team Member"
        >
          <div
            className="fixed inset-0 bg-slate-950/45"
            onClick={() => setShowInviteModal(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleInvite}
            className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                Provision Clinical User (Demo)
              </h2>
              <button type="button" onClick={() => setShowInviteModal(false)} aria-label="Close modal">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 px-3 py-2 text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <label className="block space-y-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Clinician / Staff Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dr. Kavita Deshpande"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block space-y-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Institutional Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kavita.d@medisense-demo.in"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Role</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserAccount['role'])}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="Senior Consultant">Senior Consultant</option>
                  <option value="Radiologist">Radiologist</option>
                  <option value="Lab Director">Lab Director</option>
                  <option value="Nursing Lead">Nursing Lead</option>
                  <option value="Operations Admin">Operations Admin</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Department</span>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value as DepartmentName)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 font-semibold text-white"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
