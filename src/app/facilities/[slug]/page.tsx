import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Clock,
  ShieldCheck,
  CheckCircle,
  Calendar,
  ChevronLeft,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { BookingForm } from '@/components/public/BookingForm';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = await db.getFacilityBySlug(slug);

  if (!facility) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Link
              href="/facilities"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-sky-950 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Facilities Directory
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Facility Specs, Photography, and Amenities */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <Badge variant="primary" className="bg-sky-100 text-sky-900 border-sky-200">
                    Ten42 Verified Space
                  </Badge>
                  <div className="flex items-center text-xs font-bold text-slate-600">
                    <Users className="w-4 h-4 mr-1.5 text-sky-800" />
                    Capacity: Up to {facility.capacity} Persons
                  </div>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {facility.name}
                </h1>

                <p className="text-slate-600 mt-4 leading-relaxed text-sm sm:text-base">
                  {facility.description}
                </p>

                {/* Main Photography */}
                <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden my-6 border border-slate-200 bg-slate-100">
                  <Image
                    src={facility.images[0] || '/images/Header2.jpg'}
                    alt={facility.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Secondary Photo Thumbnail if present */}
                {facility.images.length > 1 && (
                  <div className="grid grid-cols-2 gap-4 my-4">
                    {facility.images.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <Image
                          src={img}
                          alt={`${facility.name} view ${idx + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Amenities */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
                    Included Amenities & Technology
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                    {facility.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operational Rules & Policies */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span>
                      Operating Hours: Weekdays 8:00 AM - 6:00 PM | Saturdays 9:00 AM - 5:00 PM
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      Buffer Management: +{facility.setup_buffer_mins} mins setup and +
                      {facility.teardown_buffer_mins} mins teardown automatically blocked for your team.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Interactive Reservation Form */}
            <div id="reserve" className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">
                    Reserve This Facility
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <h2 className="text-xl font-bold text-slate-900">Book Reservation</h2>
                    <div className="text-right">
                      <span className="text-xl font-black text-sky-950">
                        {formatCurrency(facility.hourly_rate)}
                      </span>
                      <span className="text-xs text-slate-500"> / hour</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>
                      Half-Day: <strong>{formatCurrency(facility.half_day_rate)}</strong>
                    </span>
                    <span>
                      Full-Day: <strong>{formatCurrency(facility.daily_rate)}</strong>
                    </span>
                  </div>
                </div>

                {/* Interactive Booking Form */}
                <BookingForm facility={facility} />
              </div>

              {/* Assistance Card */}
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 text-xs text-sky-950">
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <Calendar className="w-4 h-4 text-sky-800" />
                  <span>Need an inspection tour or custom package?</span>
                </div>
                <p className="text-slate-600">
                  Call our front desk at <strong>+234 800 000 1042</strong> or email{' '}
                  <strong>info@ten42.org</strong> for personalized event planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
