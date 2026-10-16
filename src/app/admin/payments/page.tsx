'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Download,
  CheckCircle,
  Eye,
  RefreshCw,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Payment } from '@/types/database';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (Array.isArray(data)) setPayments(data);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: verificationNotes || 'Verified against official bank credit alert',
        }),
      });

      if (res.ok) {
        await fetchPayments();
        setSelectedPayment(null);
        setVerificationNotes('');
      } else {
        alert('Failed to verify payment');
      }
    } catch {
      alert('Error verifying payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.payment_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.receipt_reference && p.receipt_reference.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unverifiedCount = payments.filter((p) => p.status === 'unverified').length;
  const verifiedSum = payments
    .filter((p) => p.status === 'verified')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Payments & Receipts Verification</h2>
            {unverifiedCount > 0 && (
              <Badge variant="warning">{unverifiedCount} Unverified Pending</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Total Audited Receipts: <strong>{formatCurrency(verifiedSum)}</strong> in verified funds
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchPayments}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <a href="/api/reports/export?type=payments" download>
            <Button variant="primary" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Payments CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search payment reference or bank receipt..."
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
            <option value="all">All Payments ({payments.length})</option>
            <option value="unverified">Unverified ({unverifiedCount})</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-4">Reference</th>
                <th className="p-4">Type / Allocation</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Payment Date</th>
                <th className="p-4">Bank / Receipt Ref</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading payments records...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-950">{p.payment_reference}</td>
                    <td className="p-4 font-medium text-slate-800">
                      {p.membership_id
                        ? 'Membership Subscription'
                        : p.booking_id
                        ? 'Facility Reservation'
                        : 'General Service'}
                    </td>
                    <td className="p-4 font-black text-slate-900">{formatCurrency(p.amount)}</td>
                    <td className="p-4 capitalize text-slate-600">{p.payment_method.replace('_', ' ')}</td>
                    <td className="p-4 text-slate-600">{formatDate(p.payment_date)}</td>
                    <td className="p-4 font-mono text-slate-700">{p.receipt_reference || 'Pending ref'}</td>
                    <td className="p-4">
                      <Badge variant={p.status === 'verified' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayment(p)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedPayment && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPayment(null)}
          title={`Payment: ${selectedPayment.payment_reference}`}
          description="Audit transaction receipt and verify funds"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-semibold">Amount & Currency:</span>
                <span className="text-lg font-black text-sky-950">
                  {formatCurrency(selectedPayment.amount)}
                </span>
                <span className="block text-slate-500 capitalize">{selectedPayment.payment_method}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Bank / Txn Reference:</span>
                <span className="font-mono font-bold text-slate-900 block mt-1">
                  {selectedPayment.receipt_reference || 'No reference submitted'}
                </span>
                <span className="text-slate-400">Date: {formatDate(selectedPayment.payment_date)}</span>
              </div>
            </div>

            {selectedPayment.status === 'unverified' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Staff Verification Audit Note
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="e.g. Verified transaction on Zenith Bank portal at 14:30..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600"
                  rows={3}
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPayment(null)}>
                Close
              </Button>
              {selectedPayment.status === 'unverified' && (
                <Button
                  variant="accent"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleVerify(selectedPayment.id)}
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verify & Activate
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

