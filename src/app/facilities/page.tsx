import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Clock, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function FacilitiesDirectoryPage() {
  const facilities = await db.getFacilities();
  const categories = await db.getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-sky-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="accent">Institutional Spaces</Badge>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
                Facilities & Resource Spaces
              </h1>
              <p className="text-slate-300 mt-3 text-base sm:text-lg leading-relaxed">
                Explore our purpose-built conference auditorium, executive boardroom suites, and practical computer training labs. Transparent pricing and instant reservation requests.
              </p>
            </div>
          </div>
        </section>

        {/* Directory Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {facilities.map((facility) => {
                const category = categories.find((c) => c.id === facility.category_id);
                return (
                  <div
                    key={facility.id}
                    id={facility.slug}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12"
                  >
                    {/* Facility Image */}
                    <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-auto bg-slate-100">
                      <Image
                        src={facility.images[0] || '/images/Header2.jpg'}
                        alt={facility.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="primary" className="bg-sky-950/85 text-white border-sky-800 backdrop-blur-xs">
                          {category?.name || 'Facility'}
                        </Badge>
                      </div>
                    </div>

                    {/* Facility Details */}
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-2xl font-bold text-slate-900">{facility.name}</h2>
                          <Badge variant="outline" className="text-slate-700 bg-slate-50">
                            <Users className="w-3.5 h-3.5 mr-1 text-sky-800" />
                            Capacity: {facility.capacity} seats
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          {facility.description}
                        </p>

                        {/* Amenities */}
                        <div className="mt-6">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                            Key Amenities & Specifications
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                            {facility.amenities.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Operating info */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1.5">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span>Weekdays: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 5:00 PM</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Power Generator & Fiber WiFi Included</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Action CTAs */}
                      <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">
                            Rates (NGN)
                          </span>
                          <div className="flex items-baseline space-x-3">
                            <div>
                              <span className="text-xl font-black text-sky-950">
                                {formatCurrency(facility.half_day_rate)}
                              </span>
                              <span className="text-xs text-slate-500"> / 4-hr</span>
                            </div>
                            <span className="text-slate-300">|</span>
                            <div>
                              <span className="text-lg font-bold text-slate-800">
                                {formatCurrency(facility.daily_rate)}
                              </span>
                              <span className="text-xs text-slate-500"> / full-day</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Link href={`/facilities/${facility.slug}`}>
                            <Button variant="outline">Learn More</Button>
                          </Link>
                          <Link href={`/facilities/${facility.slug}#reserve`}>
                            <Button variant="accent">
                              Book This Room <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
