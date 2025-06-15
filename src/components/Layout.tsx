
import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
