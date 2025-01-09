'use client';
import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="p-5">{children}</main>
    </div>
  );
}
