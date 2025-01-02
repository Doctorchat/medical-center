import React from 'react';
import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import './globals.scss';
import { Providers } from '@/providers';

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin-ext'],
});

export const metadata: Metadata = {
  title: 'Centru Medical | DoctorChat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${onest.className} antialiased`}>
        <Providers>
          <AntdRegistry>{children}</AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
