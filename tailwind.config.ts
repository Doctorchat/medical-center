import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dc: {
          blue: '#1c1f62',
          teal: '#92d4d2',
          red: '#e81f41',
        },
      },
    },
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        xxl: '1600px',
      },
    },

    screens: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
  },
  plugins: [],
};
export default config;
