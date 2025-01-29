import React from "react";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { Providers } from "@/providers";
import "@/assets/styles/globals.scss";

import favicon from "./favicon.svg";
import { Locale } from "@/i18n/config";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Centru Medical | DoctorChat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/svg" href={favicon.src} />
      </head>
      <body className={`${onest.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers locale={locale as Locale}>
            <AntdRegistry>{children}</AntdRegistry>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
