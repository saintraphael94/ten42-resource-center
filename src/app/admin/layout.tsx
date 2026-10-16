import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'Ten42 Operations & Administrative Dashboard',
  description: 'Operations management, facility reservations, memberships, front desk visitor register, and financial records for Ten42 Center.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

