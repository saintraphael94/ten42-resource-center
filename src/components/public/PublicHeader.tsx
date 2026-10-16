'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, CalendarCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PublicHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Programs & Training', href: '/programs' },
    { name: 'Membership', href: '/membership' },
    { name: 'News & Events', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top institutional ribbon */}
      <div className="bg-sky-950 text-sky-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium tracking-wide">Ten42 Training and Resource Center</span>
            <span className="hidden md:inline text-sky-400">|</span>
            <span className="hidden md:inline italic text-sky-300">Training for Right Living...</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">Tel: +234 800 000 1042</span>
            <Link
              href="/admin"
              className="inline-flex items-center space-x-1 text-sky-200 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand title */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/Ten42-logo.png"
                alt="Ten42 Center Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-xl font-black tracking-tight text-sky-950">Ten</span>
                <span className="text-xl font-black tracking-tight text-orange-600">42</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Training & Resource Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-sky-900 bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-sky-950 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link href="/facilities">
              <Button variant="accent" size="sm" className="shadow-xs">
                <CalendarCheck className="w-4 h-4 mr-1.5" />
                Book a Facility
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(item.href)
                  ? 'bg-sky-50 text-sky-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            <Link href="/facilities" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="accent" className="w-full">
                <CalendarCheck className="w-4 h-4 mr-2" />
                Book a Facility
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Staff Administration
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

