import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Badge } from '@/components/ui/Badge';

export default function NewsPage() {
  const articles = [
    {
      title: 'Ten42 Unveils State-of-the-Art 280-Seat Conference Auditorium in Barnawa, Kaduna',
      date: 'October 10, 2026',
      readTime: '4 min read',
      category: 'Facility Announcement',
      image: '/images/Header2.jpg',
      excerpt:
        'Equipped with advanced acoustic engineering, integrated stage display screens, and full power redundancy, Ten42 officially commissions its flagship multi-tier conference hall.',
    },
    {
      title: 'Ethics and Fiduciary Stewardship: 2026 Executive Governance Workshop',
      date: 'September 28, 2026',
      readTime: '6 min read',
      category: 'Thought Leadership',
      image: '/images/Ten42-B-Room.png',
      excerpt:
        'A comprehensive summary of key takeaways from our recent symposium examining how institutional integrity shapes economic durability in emerging markets.',
    },
    {
      title: 'Ten42 Announces Subsidized Membership Tiers for Young Researchers and Students',
      date: 'September 15, 2026',
      readTime: '3 min read',
      category: 'Community Impact',
      image: '/images/Ten42-Comp-Room.jpg',
      excerpt:
        'In line with our mission of "Training for Right Living", Ten42 rolls out affordable student and early-career membership passes providing meeting and study access.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />

      <main className="flex-grow bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <Badge variant="accent">Center News & Publications</Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mt-3">
              Announcements, Events & Insights
            </h1>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Stay informed on center developments, upcoming symposiums, thought leadership articles, and institutional milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" className="bg-sky-950/85 text-white border-sky-800 text-[10px]">
                        <Tag className="w-3 h-3 mr-1" />
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/contact?subject=Press Inquiry: ${encodeURIComponent(item.title)}`}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center"
                  >
                    Read More & Inquire <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

