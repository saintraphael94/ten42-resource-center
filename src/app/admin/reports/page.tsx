import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Download,
  Users,
  CalendarCheck,
  UserCheck,
  CreditCard,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function AdminReportsPage() {
  const metrics = await db.getDashboardMetrics();
  const facilities = await db.getFacilities();
  const bookings = await db.getBookings();
  const memberships = await db.getMemberships();
  const payments = await db.getPayments();
  const visits = await db.getVisits();

  // Facility utilization breakdown
  const facilityBreakdown = facilities.map((f) => {
    const fBookings = bookings.filter((b) => b.facility_id === f.id);
    const confirmedCount = fBookings.filter((b) => b.booking_status === 'confirmed').length;
    const revenue = fBookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + Number(b.estimated_price), 0);
    return {
      name: f.name,
      totalReservations: fBookings.length,
      confirmedCount,
      revenue,
      capacity: f.capacity,
    };
  });

  // Membership distribution by tier
  const membershipByTier = memberships.reduce((acc, m) => {
    const planName = m.plan?.name || 'General';
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Operational Analytics</h2>
          <p className="text-xs text-slate-500">
            Real-time telemetry, revenue audits, facility capacity metrics, and CSV reporting
          </p>
        </div>

        {/* Quick CSV Export Suite */}
        <div className="flex flex-wrap gap-2">
          <a href="/api/reports/export?type=bookings" download>
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1" />
              Bookings CSV
            </Button>
          </a>
          <a href="/api/reports/export?type=memberships" download>
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1" />
              Members CSV
            </Button>
          </a>
          <a href="/api/reports/export?type=visitors" download>
            <Button variant="outline" size="sm">
              <Download className="w-3.5 h-3.5 mr-1" />
              Visitors CSV
            </Button>
          </a>
          <a href="/api/reports/export?type=payments" download>
            <Button variant="primary" size="sm">
              <Download className="w-3.5 h-3.5 mr-1" />
              Financial Audit CSV
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Verified Revenue"
          value={formatCurrency(metrics.verifiedRevenue)}
          description="Audited received funds in NGN"
          icon={<CreditCard className="w-5 h-5 text-sky-800" />}
        />
        <StatCard
          title="Total Reservations"
          value={bookings.length}
          description={`${metrics.pendingBookings} awaiting confirmation`}
          icon={<CalendarCheck className="w-5 h-5 text-orange-600" />}
        />
        <StatCard
          title="Active Members"
          value={metrics.activeMembers}
          description={`Across ${memberships.length} registered accounts`}
          icon={<Users className="w-5 h-5 text-sky-800" />}
        />
        <StatCard
          title="Premises Visits"
          value={visits.length}
          description={`${metrics.currentlyCheckedIn} on-site at present`}
          icon={<UserCheck className="w-5 h-5 text-emerald-700" />}
        />
      </div>

      {/* Facility Utilization & Performance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-6">
          <Badge variant="primary">Space Analytics</Badge>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Facility Reservation & Utilization Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Performance comparison of conference auditoriums, boardrooms, and training spaces
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-3.5">Facility Name</th>
                <th className="p-3.5">Capacity</th>
                <th className="p-3.5">Total Bookings</th>
                <th className="p-3.5">Confirmed</th>
                <th className="p-3.5">Audited Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facilityBreakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="p-3.5 text-slate-600">{item.capacity} seats</td>
                  <td className="p-3.5 font-semibold text-slate-800">{item.totalReservations}</td>
                  <td className="p-3.5">
                    <Badge variant="success">{item.confirmedCount} confirmed</Badge>
                  </td>
                  <td className="p-3.5 font-black text-sky-950">{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Analysis Grid: Membership Tier Distribution & Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Membership Tier Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <Badge variant="secondary">Member Cohort</Badge>
          <h3 className="text-base font-bold text-slate-900 mt-1">Membership Distribution by Tier</h3>
          <div className="mt-6 space-y-4">
            {Object.entries(membershipByTier).map(([tier, count], idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-xs text-slate-800">{tier}</span>
                <span className="font-black text-xs text-sky-950">{count} Members</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels & Verification Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <Badge variant="accent">Financial Compliance</Badge>
          <h3 className="text-base font-bold text-slate-900 mt-1">Payment Method & Settlement</h3>
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-sky-900 font-semibold block">Official Bank Transfers</span>
                <span className="text-[11px] text-slate-500">Zenith Bank Plc corporate account</span>
              </div>
              <span className="font-bold text-sm text-sky-950">
                {payments.filter((p) => p.payment_method === 'bank_transfer').length} Records
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-700 font-semibold block">Audited Verification Rate</span>
                <span className="text-[11px] text-slate-500">Payments with verified staff sign-off</span>
              </div>
              <Badge variant="success">
                {payments.length > 0
                  ? Math.round(
                      (payments.filter((p) => p.status === 'verified').length / payments.length) * 100
                    )
                  : 100}
                % Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
