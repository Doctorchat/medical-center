import { useLocale } from "use-intl";
import { Languages } from "lucide-react";
import { setUserLocale } from "@/i18n/service";
import { Locale } from "@/i18n/config";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function LocaleSwitcher() {
  const locale = useLocale();

  async function onClick(value: string) {
    const locale = value as Locale;
    await setUserLocale(locale);
  }

  return (
    <DropdownMenuItem onClick={() => onClick(locale === "ru" ? "ro" : "ru")}>
      <Languages />
      {locale === "ru" ? "Română" : "Руский"}
    </DropdownMenuItem>
  );
}
