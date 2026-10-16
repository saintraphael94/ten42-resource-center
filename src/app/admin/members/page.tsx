'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  CheckCircle,
  Eye,
  RefreshCw,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Membership } from '@/types/database';

export default function AdminMembersPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemberships = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/memberships');
      const data = await res.json();
      if (Array.isArray(data)) setMemberships(data);
    } catch (err) {
      console.error('Failed to load memberships', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleApprove = async (membershipId: string) => {
    setIsProcessing(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const expiry = nextMonth.toISOString().slice(0, 10);

      const res = await fetch(`/api/admin/memberships/${membershipId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'active',
          start_date: today,
          expiry_date: expiry,
        }),
      });

      if (res.ok) {
        await fetchMemberships();
        setSelectedMembership(null);
      } else {
        alert('Failed to approve membership.');
      }
    } catch {
      alert('Error updating membership status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMemberships = memberships.filter((m) => {
    const matchesSearch =
      m.membership_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.user?.full_name && m.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.plan?.name && m.plan.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Member Directory & Subscriptions</h2>
          <p className="text-xs text-slate-500">
            Track active memberships, approve pending applications, and manage renewal dates
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchMemberships}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <a href="/api/reports/export?type=memberships" download>
            <Button variant="primary" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Directory
            </Button>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search member name or membership number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
          >
            <option value="all">All Members ({memberships.length})</option>
            <option value="active">Active Members</option>
            <option value="application_pending">Applications Pending</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-4">Membership #</th>
                <th className="p-4">Member Name</th>
                <th className="p-4">Tier / Plan</th>
                <th className="p-4">Subscription Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading membership records...
                  </td>
                </tr>
              ) : filteredMemberships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No members found matching filter.
                  </td>
                </tr>
              ) : (
                filteredMemberships.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-950">{m.membership_number}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {m.user?.full_name || 'Member Applicant'}
                      </div>
                      <div className="text-slate-400 text-[11px]">{m.user?.email || 'Registered applicant'}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-900">{m.plan?.name || 'Selected Tier'}</span>
                      {m.plan && (
                        <div className="text-slate-400 text-[11px]">{formatCurrency(m.plan.fee)} / mo</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">
                      {m.start_date && m.expiry_date ? (
                        <div>
                          <span>{formatDate(m.start_date)}</span>
                          <span className="text-slate-400 mx-1">to</span>
                          <span className="font-medium text-slate-900">{formatDate(m.expiry_date)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending approval</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          m.status === 'active'
                            ? 'success'
                            : m.status === 'application_pending'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {m.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMembership(m)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Membership Detail Modal */}
      {selectedMembership && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMembership(null)}
          title={`Membership: ${selectedMembership.membership_number}`}
          description={`Plan: ${selectedMembership.plan?.name || 'Selected Tier'}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold">Tier Privileges:</span>
              <ul className="mt-2 space-y-1 text-slate-700">
                {selectedMembership.plan?.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedMembership.emergency_contact && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block font-semibold">Emergency Contact:</span>
                <div className="font-bold text-slate-900">
                  {selectedMembership.emergency_contact.name} ({selectedMembership.emergency_contact.relationship})
                </div>
                <div className="text-slate-500 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {selectedMembership.emergency_contact.phone}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMembership(null)}>
                Close
              </Button>
              {selectedMembership.status === 'application_pending' && (
                <Button
                  variant="accent"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleApprove(selectedMembership.id)}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Approve Application
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

