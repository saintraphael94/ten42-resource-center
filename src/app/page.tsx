import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  CalendarCheck,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Building,
  HelpCircle,
} from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/data/store';


export default async function HomePage() {
  const facilities = await db.getFacilities();
  const programs = await db.getPrograms();
  const plans = await db.getPlans();

  const faqs = [
    {
      q: 'How do I book the Main Auditorium or a meeting room?',
      a: 'Browse our Facilities directory, select your preferred room, pick your desired date and time, and submit your reservation request. Our facilities manager reviews requests promptly, with confirmation issued upon schedule verification.',
    },
    {
      q: 'Does the center provide backup power and high-speed internet?',
      a: 'Yes. Ten42 is equipped with industrial dual backup generators and dedicated enterprise fiber optic internet to ensure zero disruptions to seminars, board meetings, and training workshops.',
    },
    {
      q: 'What are the benefits of joining as a member?',
      a: 'Members receive complimentary meeting room credits, substantial discounts (up to 30%) on auditorium and lab bookings, high-speed Wi-Fi, digital library access, and priority event invitations.',
    },
    {
      q: 'Can we inspect the facilities in person before booking?',
      a: 'Absolutely. Visitors and event coordinators are welcome Monday through Friday from 8:00 AM to 5:00 PM. Our front-desk team will happily register you and provide a guided tour of the spaces.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 text-white overflow-hidden py-20 lg:py-28">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-pattern opacity-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-sky-900/60 border border-sky-700/50 rounded-full px-3.5 py-1 text-xs text-sky-200">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-semibold tracking-wide">Training for Right Living...</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                  Where Visionary Minds{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                    Gather, Learn, & Lead
                  </span>
                </h1>

                <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                  Ten42 Training and Resource Center provides institutional-grade event auditoriums, executive boardrooms, practical tech labs, and transformative professional training programs in Kaduna.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link href="/facilities">
                    <Button variant="accent" size="lg" className="shadow-lg shadow-orange-900/30">
                      <CalendarCheck className="w-5 h-5 mr-2" />
                      Book a Facility
                    </Button>
                  </Link>
                  <Link href="/membership">
                    <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Become a Member
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="ghost" size="lg" className="text-sky-200 hover:text-white hover:bg-sky-900/50">
                      Explore Ten42
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                {/* Key Metric Highlights */}
                <div className="pt-8 border-t border-sky-800/60 grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">280+</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Auditorium Capacity</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">100%</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Power Redundancy</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">500+</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Leaders Trained</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Facility Photography */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-sky-700/50 group">
                  <div className="relative h-80 sm:h-96 w-full">
                    <Image
                      src="/images/Header2.jpg"
                      alt="Ten42 Grand Auditorium Interior"
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-sky-950/90 backdrop-blur-md p-4 rounded-xl border border-sky-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                          Flagship Venue
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Main Auditorium & Conference Hall
                        </h4>
                      </div>
                      <Link href="/facilities/main-auditorium">
                        <span className="text-xs font-semibold text-sky-300 hover:text-white flex items-center">
                          View details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Overlapping Badge: Building Front View preview */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white text-slate-900 p-3 rounded-xl shadow-xl border border-slate-200 items-center space-x-3 max-w-xs">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/FrontView.jpg"
                      alt="Ten42 Center Exterior"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-950 block">Modern Architecture</span>
                    <span className="text-[10px] text-slate-500 block">7 Sylvester Idakwo Crescent, Barnawa GRA Kaduna</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSTITUTIONAL INTRODUCTION */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <Badge variant="primary">Institutional Excellence</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
                Built for Meaningful Dialogue & High-Impact Learning
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Ten42 Training and Resource Center is an ecosystem designed to cultivate leadership integrity, advance professional competencies, and host prestigious assemblies. Every room is engineered for acoustical clarity, digital collaboration, and uninterrupted productivity.
              </p>
            </div>

            {/* Pillar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors">
                <div className="w-12 h-12 bg-sky-100 text-sky-900 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Premier Spaces</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  From our 280-seat tiered auditorium to executive boardrooms and hands-on computer training labs.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors">
                <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Certified Training</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Rigorous masterclasses in executive leadership, data analytics, fiduciary stewardship, and grant writing.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors">
                <div className="w-12 h-12 bg-sky-100 text-sky-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Reliable Infrastructure</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Dual generator power redundancy, high-speed fiber internet, and audiovisual recording technology.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Active Community</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Vibrant membership tiers offering credits, exclusive workshops, and high-level professional networking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED FACILITIES SHOWCASE */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <Badge variant="accent">Facility Reservations</Badge>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl mt-2">
                  Spaces Engineered for Purpose
                </h2>
                <p className="text-slate-600 mt-2 max-w-xl text-sm">
                  Transparent pricing in Nigerian Naira, automated conflict-safe reservation workflows, and dedicated technical support.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/facilities">
                  <Button variant="outline">
                    View All Spaces & Rates
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.slice(0, 3).map((facility) => (
                <div
                  key={facility.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-56 w-full bg-slate-100">
                    <Image
                      src={facility.images[0] || '/images/Header2.jpg'}
                      alt={facility.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="primary" className="bg-sky-950/80 text-white border-sky-800 backdrop-blur-xs">
                        <Users className="w-3 h-3 mr-1" />
                        Up to {facility.capacity} guests
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {facility.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {facility.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Standard Rates
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-xl font-extrabold text-sky-950">
                            {formatCurrency(facility.half_day_rate)}
                          </span>
                          <span className="text-xs text-slate-500">/ half-day</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link href={`/facilities/${facility.slug}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                      <Link href={`/facilities/${facility.slug}#reserve`}>
                        <Button variant="accent" size="sm">
                          Reserve Space
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UPCOMING PROGRAMS & TRAINING */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <Badge variant="secondary">Capacity Development</Badge>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl mt-2">
                  Upcoming Masterclasses & Workshops
                </h2>
                <p className="text-slate-600 mt-2 max-w-xl text-sm">
                  Acquire relevant, practical capabilities through structured executive curriculums led by recognized sector experts.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/programs">
                  <Button variant="outline">
                    Browse All Programs
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.slice(0, 2).map((prog) => (
                <div
                  key={prog.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="accent">{prog.category}</Badge>
                      <span className="text-xs font-semibold text-slate-500 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {prog.start_date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      {prog.title}
                    </h3>

                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="mt-5 space-y-1.5 text-xs text-slate-600">
                      <p>
                        <strong className="text-slate-800">Instructor:</strong> {prog.instructor}
                      </p>
                      <p>
                        <strong className="text-slate-800">Venue:</strong> {prog.venue}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Program Fee</span>
                      <span className="text-lg font-bold text-sky-950">
                        {formatCurrency(prog.fee)}
                      </span>
                    </div>
                    <Link href={`/programs#${prog.slug}`}>
                      <Button variant="primary" size="sm">
                        Register Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEMBERSHIP TIERS PREVIEW */}
        <section className="py-20 bg-gradient-to-b from-sky-950 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="accent" className="bg-orange-600/30 text-orange-300 border-orange-500/40">
                Community & Network
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-3 text-white">
                Invest in Your Growth with a Ten42 Membership
              </h2>
              <p className="text-slate-300 mt-3 text-base">
                Join an active cohort of professionals, consultants, and leaders enjoying meeting space credits, training discounts, and quiet focus hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-300 mt-2 min-h-[48px] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="my-6 pt-4 border-t border-white/10">
                      <div className="text-2xl font-black text-orange-400">
                        {formatCurrency(plan.fee)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">per month</div>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-200">
                      {plan.benefits.slice(0, 4).map((b, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10">
                    <Link href={`/membership#apply?plan=${plan.code}`} className="block">
                      <Button variant="outline" className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                        Apply for Tier
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="primary">Frequently Asked Questions</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl mt-2">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
                  <h3 className="text-base font-bold text-slate-900 flex items-start">
                    <HelpCircle className="w-5 h-5 text-sky-800 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm text-slate-600 mt-3 pl-7 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center p-8 rounded-2xl bg-sky-50 border border-sky-100">
              <h3 className="text-lg font-bold text-sky-950">Have a custom or institutional request?</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
                Our operations team is available to assist with multi-day conference scheduling, audio-visual technical setups, and custom catering logistics.
              </p>
              <div className="mt-5">
                <Link href="/contact">
                  <Button variant="primary">Contact Enquiries Desk</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
