'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserCheck,
  Search,
  Download,
  Plus,
  Clock,
  LogOut,
  RefreshCw,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/lib/utils';
import { visitorCheckInSchema, VisitorCheckInInput } from '@/lib/validations';
import { Visit } from '@/types/database';

export default function AdminVisitorsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'checked_out'>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/visitors');
      const data = await res.json();
      if (Array.isArray(data)) setVisits(data);
    } catch (err) {
      console.error('Failed to load visitor log', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(visitorCheckInSchema),
    defaultValues: {
      group_size: 1,
    },
  });

  const onRegisterVisitor = async (data: VisitorCheckInInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchVisits();
        setIsRegisterModalOpen(false);
        reset();
      } else {
        alert('Failed to register visitor');
      }
    } catch {
      alert('Error registering visitor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (visitId: string) => {
    setIsCheckingOut(visitId);
    try {
      const res = await fetch(`/api/visitors/${visitId}/checkout`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchVisits();
      } else {
        alert('Failed to check out visitor');
      }
    } catch {
      alert('Error checking out visitor');
    } finally {
      setIsCheckingOut(null);
    }
  };

  const filteredVisits = visits.filter((v) => {
    const matchesSearch =
      v.visit_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.guest?.full_name && v.guest.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.guest?.organization && v.guest.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = visits.filter((v) => v.status === 'checked_in').length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Front Desk & Visitor Management</h2>
            <Badge variant="success">{activeCount} Currently On Premises</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Real-time daily register, walk-in check-in, host assignments, and departure logging
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={fetchVisits}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <a href="/api/reports/export?type=visitors" download>
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Register
            </Button>
          </a>
          <Button variant="accent" size="sm" onClick={() => setIsRegisterModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Walk-in Check-in
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search visitor name, company, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 bg-white"
          >
            <option value="all">All Visitors ({visits.length})</option>
            <option value="checked_in">Currently Checked In ({activeCount})</option>
            <option value="checked_out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Visitor Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-4">Reference</th>
                <th className="p-4">Visitor Details</th>
                <th className="p-4">Purpose & Destination</th>
                <th className="p-4">Host / Department</th>
                <th className="p-4">Party Size</th>
                <th className="p-4">Check-in Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading visitor register...
                  </td>
                </tr>
              ) : filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No visitor records found.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-sky-950">{v.visit_reference}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{v.guest?.full_name}</div>
                      <div className="text-slate-500 text-[11px]">{v.guest?.phone || 'No phone'}</div>
                      {v.guest?.organization && (
                        <div className="text-[10px] text-slate-400">{v.guest.organization}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{v.purpose}</div>
                      <div className="text-slate-400 text-[11px] flex items-center mt-0.5">
                        <Building className="w-3 h-3 mr-1" />
                        {v.destination || 'Main Facility'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">{v.host_person || 'Front Desk'}</td>
                    <td className="p-4 font-semibold text-slate-900">{v.group_size}</td>
                    <td className="p-4 text-slate-600">
                      <div>{formatDateTime(v.check_in_time)}</div>
                      {v.check_out_time && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Out: {formatDateTime(v.check_out_time)}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant={v.status === 'checked_in' ? 'success' : 'default'}>
                        {v.status === 'checked_in' ? 'Checked In' : 'Checked Out'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {v.status === 'checked_in' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={isCheckingOut === v.id}
                          onClick={() => handleCheckOut(v.id)}
                          className="text-rose-700 hover:bg-rose-50 border-rose-200"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-1" />
                          Check Out
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Visitor Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Walk-in Guest Check-in"
        description="Register an on-site visitor and log arrival time"
      >
        <form onSubmit={handleSubmit(onRegisterVisitor)} className="space-y-4">
          <Input
            label="Visitor Full Name"
            placeholder="e.g. Adebayo Ogunlesi"
            error={errors.full_name?.message}
            {...register('full_name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+234 800 000 0000"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              type="email"
              label="Email Address (Optional)"
              placeholder="visitor@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Company"
              placeholder="Company or Affiliation"
              error={errors.organization?.message}
              {...register('organization')}
            />
            <Input
              type="number"
              label="Group Size"
              min={1}
              defaultValue={1}
              error={errors.group_size?.message}
              {...register('group_size', { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Purpose of Visit"
            placeholder="e.g. Meeting with Operations Team / Facility Tour"
            error={errors.purpose?.message}
            {...register('purpose')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Host Person / Department"
              placeholder="e.g. Engr. Olatunji"
              error={errors.host_person?.message}
              {...register('host_person')}
            />
            <Input
              label="Destination / Room"
              placeholder="e.g. Executive Boardroom"
              error={errors.destination?.message}
              {...register('destination')}
            />
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              variant="accent"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-xs"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Complete Check-In
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
