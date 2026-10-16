'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Users,
  CreditCard,
  UserCheck,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Reservations', href: '/admin/reservations', icon: CalendarCheck },
    { name: 'Front Desk & Visitors', href: '/admin/visitors', icon: UserCheck },
    { name: 'Members & Plans', href: '/admin/members', icon: Users },
    { name: 'Payments & Receipts', href: '/admin/payments', icon: CreditCard },
    { name: 'Facilities & Spaces', href: '/admin/facilities', icon: Building2 },
    { name: 'Programs & Training', href: '/admin/programs', icon: GraduationCap },
    { name: 'Enquiries & Helpdesk', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true;
    if (href !== '/admin' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-sky-950 text-white p-4 flex items-center justify-between border-b border-sky-900 sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-8 h-8 bg-white rounded p-0.5">
            <Image src="/images/Ten42-logo.png" alt="Ten42" fill className="object-contain" />
          </div>
          <span className="font-bold text-sm tracking-wide">Ten42 Operations</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-sky-900"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-sky-950 text-slate-200 border-r border-sky-900 flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand identity header */}
        <div className="p-6 border-b border-sky-900/80 flex items-center space-x-3">
          <div className="relative w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0">
            <Image src="/images/Ten42-logo.png" alt="Ten42 Center" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-lg font-black text-white">Ten</span>
              <span className="text-lg font-black text-orange-500">42</span>
              <span className="text-xs font-semibold text-sky-400 ml-1.5">Ops</span>
            </div>
            <span className="text-[10px] text-slate-400">Operations Control</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-sky-900 text-white font-bold border-l-4 border-orange-500 pl-2'
                    : 'text-slate-400 hover:text-white hover:bg-sky-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Staff Info & Return link */}
        <div className="p-4 border-t border-sky-900/80 bg-sky-950/90 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-800 text-sky-200 flex items-center justify-center font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-white">Duty Supervisor</span>
              <span className="text-[10px] text-emerald-400">Authenticated Staff</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-sky-300 hover:text-white pt-2 border-t border-sky-900/60 transition-colors"
          >
            <span>Visit Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ten42 Management Operations</h1>
            <p className="text-xs text-slate-500">
              Training for Right Living... | Timezone: Africa/Lagos
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <Link href="/admin/visitors">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100 transition-colors">
                <UserCheck className="w-3.5 h-3.5 mr-1 text-sky-800" />
                Quick Check-In
              </span>
            </Link>
            <Link href="/admin/reservations">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100 transition-colors">
                <CalendarCheck className="w-3.5 h-3.5 mr-1 text-orange-600" />
                Review Bookings
              </span>
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}

