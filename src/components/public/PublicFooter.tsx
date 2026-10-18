import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ArrowRight, Shield } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-sky-950 text-slate-300 border-t border-sky-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-white rounded-lg p-1">
                <Image
                  src="/images/Ten42-logo.png"
                  alt="Ten42 Center"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-white">Ten</span>
                  <span className="text-xl font-black text-orange-500">42</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                  Training & Resource Center
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 italic">
              &quot;Training for Right Living...&quot;
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              A world-class institutional center dedicated to human capital development, leadership training, professional certifications, and premier collaborative meeting spaces.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore The Center
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-orange-500" />
                  About Ten42
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-white transition-colors flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-orange-500" />
                  Auditorium & Facilities
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white transition-colors flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-orange-500" />
                  Executive Programs
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-white transition-colors flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-orange-500" />
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors flex items-center">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-orange-500" />
                  News & Impact Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours & Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Facility Hours
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-medium text-white">Monday – Friday</span>
                  <span className="text-xs text-slate-400">8:00 AM – 6:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-medium text-white">Saturday</span>
                  <span className="text-xs text-slate-400">9:00 AM – 5:00 PM</span>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-medium text-slate-400">Sunday</span>
                  <span className="text-xs text-slate-500">Closed (Reserved for Special Bookings)</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed text-slate-300">
                  7 Sylvester Idakwo Crescent, Barnawa GRA Kaduna
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-xs text-slate-300">+234 800 000 1042</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-xs text-slate-300">info@ten42.org</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center text-xs text-sky-400 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Staff Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-sky-900/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 Ten42 Training and Resource Center. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Booking Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Help Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
