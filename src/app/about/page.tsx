import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Compass, Award, Shield, Users, ArrowRight } from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-sky-950 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <Badge variant="accent">About Ten42</Badge>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-3">
                Dedicated to Integrity, Leadership, & Human Potential
              </h1>
              <p className="text-lg text-slate-300 mt-4 leading-relaxed">
                Founded on the premise that societal transformation begins with intentional learning, Ten42 Training and Resource Center provides the physical and intellectual infrastructure for leaders to flourish.
              </p>
            </div>
          </div>
        </section>

        {/* Narrative & Photo */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative h-96 w-full">
                  <Image
                    src="/images/FrontView.jpg"
                    alt="Ten42 Center Building Exterior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-600 italic">
                    The modern, purpose-built Ten42 Training & Resource Center facility located in Lagos, Nigeria.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <Badge variant="primary">Our Story & Ethos</Badge>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  &quot;Training for Right Living...&quot;
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  At Ten42, our motto—<em>Training for Right Living...</em>—is not merely a tagline; it is our foundational philosophy. We believe that professional skill without ethical grounding produces fragility, whereas skill paired with integrity fosters lasting institutional and community value.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  To achieve this vision, we have developed a center of distinction. Our facilities span a tiered 280-seat conference auditorium with acoustic engineering, smart executive suites for confidential governance meetings, and high-tech computer training laboratories.
                </p>

                <div className="pt-2">
                  <Link href="/facilities">
                    <Button variant="accent">
                      Explore Our Facilities <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-12 h-12 bg-sky-100 text-sky-900 rounded-xl flex items-center justify-center mb-5">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  To provide world-class learning facilities, rigorous character-focused executive training, and collaborative resource spaces that empower individuals and organizations to lead with excellence, ethical stewardship, and measurable impact.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center mb-5">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  To be West Africa&apos;s most trusted institutional hub for human capital development, renowned for producing visionary leaders and delivering exceptional conference and learning experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="secondary">Guiding Pillars</Badge>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Our Core Values</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-sky-950 text-white flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Integrity & Ethics</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Every program, partnership, and operational process is anchored in unwavering honesty and moral transparency.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Operational Excellence</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  We maintain zero-tolerance for mediocrity in our facility standards, audiovisual delivery, and guest hospitality.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Community Collaboration</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  We cultivate an inclusive environment where students, executives, and organizations cross-pollinate ideas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

