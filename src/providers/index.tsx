"use client";
import { type ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { App, ConfigProvider } from "antd";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import ro from "antd/es/locale/ro_RO";
import ru from "antd/es/locale/ru_RU";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { DefaultColors } from "tailwindcss/types/generated/colors";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Locale } from "@/i18n/config";

interface TailwindColors extends DefaultColors {
  dc: {
    blue: string;
    teal: string;
    red: string;
  };
}

const ANT_LOCALES = {
  ro,
  ru,
};

const fullConfig = resolveConfig(tailwindConfig);
const twThemeColors = fullConfig?.theme?.colors as TailwindColors;

export const Providers = ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <ConfigProvider
        locale={ANT_LOCALES[locale]}
        theme={{
          token: {
            colorPrimary: twThemeColors?.dc?.blue,
            colorError: twThemeColors?.dc?.red,
          },
          components: {
            Menu: {
              itemSelectedBg: twThemeColors?.dc?.blue,
              itemSelectedColor: "#fff",
            },
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <App>{children}</App>
          </NuqsAdapter>
        </QueryClientProvider>
        <ProgressBar
          height="4px"
          color="#e81f41"
          options={{ showSpinner: true }}
          shallowRouting
        />
      </ConfigProvider>
    </SessionProvider>
  );
};
