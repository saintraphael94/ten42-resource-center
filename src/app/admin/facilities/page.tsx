import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, Users, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function AdminFacilitiesPage() {
  const facilities = await db.getFacilities();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Facilities & Space Configuration</h2>
          <p className="text-xs text-slate-500">
            Configure hourly and daily pricing, buffer periods, and capacity rules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-slate-100">
                <Image src={f.images[0] || '/images/Header2.jpg'} alt={f.name} fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge variant={f.is_active ? 'success' : 'outline'}>
                    {f.is_active ? 'Active for Bookings' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg">{f.name}</h3>
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {f.capacity} seats
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {f.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Hourly</span>
                    <span className="font-bold text-slate-900">{formatCurrency(f.hourly_rate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Half-Day</span>
                    <span className="font-bold text-slate-900">{formatCurrency(f.half_day_rate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Full-Day</span>
                    <span className="font-bold text-sky-950">{formatCurrency(f.daily_rate)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-orange-500" />
                    Buffer: +{f.setup_buffer_mins}m in / +{f.teardown_buffer_mins}m out
                  </span>
                  <span>Min: {f.min_hours}h | Max: {f.max_hours}h</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
              <Link href={`/facilities/${f.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  View Public Page
                </Button>
              </Link>
              <Link href={`/facilities/${f.slug}#reserve`} target="_blank">
                <Button variant="accent" size="sm">
                  Test Booking Engine
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
