import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ten42 Training & Resource Center | Training for Right Living...',
  description:
    'Premier training, learning, and facility reservation hub. Multi-level conference auditorium, executive boardrooms, practical computer labs, and professional memberships.',
  keywords: [
    'Ten42',
    'Training and Resource Center',
    'Auditorium Rental Lagos',
    'Executive Boardroom',
    'Meeting Rooms',
    'Corporate Training',
    'Leadership Development',
  ],
  icons: {
    icon: '/images/Ten42-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
