import React from 'react';
import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Providers } from '@/providers';
import '@/assets/styles/globals.scss';

import favicon from './favicon.svg';

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
      <head>
        <link rel="icon" type="image/svg" href={favicon.src} />
      </head>
      <body className={`${onest.className} antialiased`}>
        <Providers>
          <AntdRegistry>{children}</AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
