'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { App, ConfigProvider } from 'antd';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

import ro from 'antd/es/locale/ro_RO';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

interface TailwindColors extends DefaultColors {
  dc: {
    blue: string;
    teal: string;
    red: string;
  };
}

const fullConfig = resolveConfig(tailwindConfig);
const twThemeColors = fullConfig?.theme?.colors as TailwindColors;

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ConfigProvider
        locale={ro}
        theme={{
          token: {
            colorPrimary: twThemeColors?.dc?.blue,
            colorError: twThemeColors?.dc?.red,
          },
          components: {
            Menu: {
              itemSelectedBg: twThemeColors?.dc?.blue,
              itemSelectedColor: '#fff',
            },
          },
        }}
      >
        <App>{children}</App>
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
