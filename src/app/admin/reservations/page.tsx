'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Booking } from '@/types/database';

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (status: Booking['booking_status']) => {
    if (!selectedBooking) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          admin_notes: actionNotes,
          cancellation_reason: status === 'rejected' || status === 'cancelled' ? actionNotes : undefined,
        }),
      });
      if (res.ok) {
        await fetchBookings();
        setSelectedBooking(null);
        setActionNotes('');
      } else {
        alert('Failed to update status.');
      }
    } catch {
      alert('Error updating status.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.booking_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.facility?.name && b.facility.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.organization && b.organization.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Facility Reservations Management</h2>
          <p className="text-xs text-slate-500">
            Review incoming requests, verify availability buffers, and issue approvals
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchBookings}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <a href="/api/reports/export?type=bookings" download>
            <Button variant="primary" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search reference, customer, or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
          >
            <option value="all">All Statuses ({bookings.length})</option>
            <option value="pending">Pending Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-4">Reference</th>
                <th className="p-4">Facility</th>
                <th className="p-4">Guest / Organization</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Attendees</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Loading reservation records...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No reservations found matching the current criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-950">{b.booking_reference}</td>
                    <td className="p-4 font-semibold text-slate-900">{b.facility?.name || 'Facility'}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{b.guest_name}</div>
                      <div className="text-slate-500 text-[11px]">{b.guest_email}</div>
                      {b.organization && (
                        <div className="text-[10px] text-slate-400 font-medium">{b.organization}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{formatDateTime(b.start_time)}</div>
                      <div className="text-[11px] text-slate-400">to {formatDateTime(b.end_time)}</div>
                    </td>
                    <td className="p-4">{b.attendee_count} pax</td>
                    <td className="p-4 font-bold text-slate-900">{formatCurrency(b.estimated_price)}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          b.booking_status === 'confirmed'
                            ? 'success'
                            : b.booking_status === 'pending'
                            ? 'warning'
                            : b.booking_status === 'rejected'
                            ? 'danger'
                            : 'default'
                        }
                      >
                        {b.booking_status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={b.payment_status === 'paid' ? 'success' : 'outline'}>
                        {b.payment_status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Action / Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking ${selectedBooking.booking_reference}`}
          description={`Facility: ${selectedBooking.facility?.name || 'Reserved Space'}`}
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">Organizer:</span>
                <span className="font-bold text-slate-900">{selectedBooking.guest_name}</span>
                <span className="block text-slate-500">{selectedBooking.guest_phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Attendance & Price:</span>
                <span className="font-bold text-slate-900">{selectedBooking.attendee_count} Persons</span>
                <span className="block font-bold text-sky-950">{formatCurrency(selectedBooking.estimated_price)}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold">Purpose & Setup:</span>
              <p className="mt-1 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800">
                {selectedBooking.purpose}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Administrative Notes / Reason
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Optional notes for approval, or reason if rejecting/cancelling..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600"
                rows={3}
              />
            </div>

            {/* Workflow Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>

              {selectedBooking.booking_status !== 'rejected' && (
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleUpdateStatus('rejected')}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject Reservation
                </Button>
              )}

              {selectedBooking.booking_status !== 'confirmed' && (
                <Button
                  variant="accent"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleUpdateStatus('confirmed')}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Approve & Confirm Slot
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

