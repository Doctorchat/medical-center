export type Locale = (typeof locales)[number];

export const locales = ["ro", "ru"] as const;
export const defaultLocale: Locale = "ro";
