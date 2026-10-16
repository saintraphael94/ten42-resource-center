'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/lib/utils';
import { Enquiry } from '@/types/database';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (Array.isArray(data)) setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (status: Enquiry['status']) => {
    if (!selectedEnquiry) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          internal_notes: internalNotes || selectedEnquiry.internal_notes,
        }),
      });

      if (res.ok) {
        await fetchEnquiries();
        setSelectedEnquiry(null);
      } else {
        alert('Failed to update enquiry.');
      }
    } catch {
      alert('Error updating enquiry.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Enquiries & Communications Desk</h2>
          <p className="text-xs text-slate-500">
            Review incoming public enquiries, record internal resolution notes, and assign staff
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchEnquiries}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search reference, sender, or subject..."
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
            <option value="all">All Enquiries ({enquiries.length})</option>
            <option value="new">New ({enquiries.filter((e) => e.status === 'new').length})</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-4">Reference</th>
                <th className="p-4">Sender Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Preferred Channel</th>
                <th className="p-4">Received</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading inquiries...
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-950">{e.reference}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{e.full_name}</div>
                      <div className="text-slate-500 text-[11px]">{e.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {e.category.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-slate-800 max-w-xs truncate">{e.subject}</td>
                    <td className="p-4 capitalize text-slate-600">{e.preferred_contact_method}</td>
                    <td className="p-4 text-slate-500">{formatDateTime(e.created_at)}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          e.status === 'new'
                            ? 'warning'
                            : e.status === 'resolved'
                            ? 'success'
                            : 'default'
                        }
                      >
                        {e.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEnquiry(e);
                          setInternalNotes(e.internal_notes || '');
                        }}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Respond
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail & Response Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.reference}`}
          description={`From: ${selectedEnquiry.full_name} (${selectedEnquiry.email})`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block text-sm mb-1">{selectedEnquiry.subject}</span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedEnquiry.message}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Internal Resolution / Follow-up Notes
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log internal follow-up steps, phone call summary, or assigned staff member..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600"
                rows={3}
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedEnquiry(null)}>
                Close
              </Button>
              {selectedEnquiry.status !== 'resolved' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleUpdateStatus('resolved')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

