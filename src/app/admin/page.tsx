import React from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  UserCheck,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function AdminDashboardOverviewPage() {
  const metrics = await db.getDashboardMetrics();
  const bookings = await db.getBookings();
  const visits = await db.getVisits();
  const activeVisits = visits.filter((v) => v.status === 'checked_in');

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-orange-400">
            Duty Operations Center
          </span>
          <h2 className="text-2xl font-black mt-1">Ten42 Central Overview</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live operational telemetry across facility schedules, active visitor occupancy, membership cycles, and verified payment audits.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/visitors">
            <Button variant="accent" size="sm">
              <UserCheck className="w-4 h-4 mr-1.5" />
              Register Visitor
            </Button>
          </Link>
          <Link href="/admin/reservations">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Manage Bookings
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS (ALL FROM ACTUAL DATABASE RECORDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Members"
          value={metrics.activeMembers}
          description={`Total registered: ${metrics.totalMembers} members`}
          icon={<Users className="w-5 h-5 text-sky-800" />}
        />

        <StatCard
          title="Pending Bookings"
          value={metrics.pendingBookings}
          description="Awaiting staff schedule approval"
          icon={<CalendarCheck className="w-5 h-5 text-amber-700" />}
          className={metrics.pendingBookings > 0 ? 'border-amber-300 bg-amber-50/20' : ''}
        />

        <StatCard
          title="Currently Checked-in"
          value={metrics.currentlyCheckedIn}
          description={`Today's total visitors: ${metrics.todayVisits}`}
          icon={<UserCheck className="w-5 h-5 text-emerald-700" />}
        />

        <StatCard
          title="Verified Revenue"
          value={formatCurrency(metrics.verifiedRevenue)}
          description="Audited payments in system"
          icon={<CreditCard className="w-5 h-5 text-sky-800" />}
        />
      </div>

      {/* Secondary Operational Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Pending Membership Apps</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{metrics.pendingMemberships}</div>
          </div>
          <Link href="/admin/members">
            <span className="text-xs text-sky-700 font-semibold hover:underline flex items-center">
              Review <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Open Enquiries</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{metrics.unresolvedEnquiries}</div>
          </div>
          <Link href="/admin/enquiries">
            <span className="text-xs text-sky-700 font-semibold hover:underline flex items-center">
              Inbox <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Export Center Records</span>
            <div className="text-xs text-slate-500 mt-1">Download CSV audit logs</div>
          </div>
          <Link href="/admin/reports">
            <span className="text-xs text-sky-700 font-semibold hover:underline flex items-center">
              Reports <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </Link>
        </div>
      </div>

      {/* Dual Table Section: Recent Reservations & Active Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Facility Reservations</h3>
              <p className="text-xs text-slate-500">Live booking queue and approval status</p>
            </div>
            <Link href="/admin/reservations">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-3.5">Reference</th>
                  <th className="p-3.5">Facility</th>
                  <th className="p-3.5">Organizer</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono font-bold text-sky-950">{b.booking_reference}</td>
                    <td className="p-3.5 text-slate-800">{b.facility?.name || 'Facility'}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{b.guest_name}</div>
                      <div className="text-slate-400 text-[11px]">{b.organization || 'Individual'}</div>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <div>{formatDateTime(b.start_time)}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          b.booking_status === 'confirmed'
                            ? 'success'
                            : b.booking_status === 'pending'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {b.booking_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Active Visitors in Facility */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center">
                  <UserCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Currently Checked-in Visitors
                </h3>
                <p className="text-xs text-slate-500">{activeVisits.length} visitors on premises</p>
              </div>
              <Link href="/admin/visitors">
                <Button variant="outline" size="sm">
                  Visitor Log
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {activeVisits.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No visitors currently checked in on premises.
                </div>
              ) : (
                activeVisits.map((visit) => (
                  <div key={visit.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{visit.guest?.full_name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Destination: {visit.destination || 'General Facility'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        In: {formatDateTime(visit.check_in_time)}
                      </div>
                    </div>
                    <Badge variant="success">Checked In</Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <Link href="/admin/visitors" className="text-xs font-semibold text-sky-800 hover:underline">
              Open Front Desk Check-In Console →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
