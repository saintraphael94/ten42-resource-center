import React from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  CreditCard,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function MemberPortalPage() {
  const memberships = await db.getMemberships();
  const bookings = await db.getBookings();

  // Active or latest member sample
  const member = memberships[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicHeader />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Member Profile Card & Identity */}
          <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="accent" className="bg-orange-500/20 text-orange-300 border-orange-500/40">
                  Member Portal
                </Badge>
                <Badge variant="success">Active Status</Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Welcome back, {member?.user?.full_name || 'Tunde Balogun'}
              </h1>
              <p className="text-xs text-sky-200">
                Institutional ID:{' '}
                <span className="font-mono font-bold text-white tracking-wider">
                  {member?.membership_number || 'T42-MEM-2026-0001'}
                </span>{' '}
                | Tier: <strong>{member?.plan?.name || 'Individual Professional'}</strong>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Valid From:</span>
                <span className="font-bold text-white">{formatDate(member?.start_date)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Valid Through:</span>
                <span className="font-bold text-orange-400">{formatDate(member?.expiry_date)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-slate-300">Monthly Rate:</span>
                <span className="font-black text-white">{formatCurrency(member?.plan?.fee || 25000)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <CalendarCheck className="w-8 h-8 text-sky-800 mb-3" />
                <h3 className="font-bold text-slate-900 text-base">Book a Space with Credits</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Apply your monthly meeting room allowances and receive member discounts on auditorium sessions.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/facilities">
                  <Button variant="accent" size="sm" className="w-full">
                    Reserve Facility <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <CreditCard className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-base">Subscription & Renewal</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  View billing receipts, wire transfer proof status, and renew your membership cycle.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/contact?subject=Membership Renewal">
                  <Button variant="outline" size="sm" className="w-full">
                    Renew Subscription
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
                <h3 className="font-bold text-slate-900 text-base">Masterclasses & Discounts</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Browse certified executive training sessions with prioritized member reservations.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/programs">
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Curriculums
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Member Reservations History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Facility Reservations</h2>
                <p className="text-xs text-slate-500">Scheduled sessions and meeting room usage</p>
              </div>
              <Link href="/facilities">
                <Button variant="outline" size="sm">
                  New Reservation
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Facility</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Attendees</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Booking Status</th>
                    <th className="p-4">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-sky-950">{b.booking_reference}</td>
                      <td className="p-4 font-semibold text-slate-800">{b.facility?.name || 'Facility'}</td>
                      <td className="p-4 text-slate-600">{formatDateTime(b.start_time)}</td>
                      <td className="p-4 font-semibold text-slate-800">{b.attendee_count} pax</td>
                      <td className="p-4 font-bold text-slate-900">{formatCurrency(b.estimated_price)}</td>
                      <td className="p-4">
                        <Badge variant={b.booking_status === 'confirmed' ? 'success' : 'warning'}>
                          {b.booking_status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={b.payment_status === 'paid' ? 'success' : 'outline'}>
                          {b.payment_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
