import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Award,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function ProgramsDirectoryPage() {
  const programs = await db.getPrograms();

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow bg-slate-50">
        {/* Banner */}
        <section className="bg-sky-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge variant="accent">Executive & Professional Development</Badge>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
                Programs & Training Opportunities
              </h1>
              <p className="text-slate-300 mt-3 text-base sm:text-lg leading-relaxed">
                Empowering leaders, managers, and changemakers with actionable skills, ethical grounding, and certified competencies.
              </p>
            </div>
          </div>
        </section>

        {/* Programs Listing */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {programs.map((program) => (
                <div
                  key={program.id}
                  id={program.slug}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12"
                >
                  <div className="md:col-span-4 relative h-64 md:h-auto bg-slate-100">
                    <Image
                      src={program.featured_image || '/images/Header2.jpg'}
                      alt={program.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="primary" className="bg-sky-950/85 text-white border-sky-800">
                        {program.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-500 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-orange-600" />
                          {program.start_date} – {program.end_date}
                        </span>
                        {program.capacity && (
                          <span className="text-xs font-medium text-slate-500 flex items-center">
                            <Users className="w-3.5 h-3.5 mr-1 text-sky-700" />
                            Capacity: {program.capacity} Participants
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                        {program.title}
                      </h2>

                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                        {program.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-700">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-orange-600 flex-shrink-0" />
                          <span>
                            <strong>Facilitator:</strong> {program.instructor}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-sky-700 flex-shrink-0" />
                          <span>
                            <strong>Venue:</strong> {program.venue}
                          </span>
                        </div>
                        {program.registration_deadline && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>
                              <strong>Deadline:</strong> {program.registration_deadline}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                          Enrollment Fee
                        </span>
                        <span className="text-2xl font-black text-sky-950">
                          {formatCurrency(program.fee)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Link href={`/contact?subject=Program Registration: ${program.title}`}>
                          <Button variant="accent">
                            Register for Program <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
