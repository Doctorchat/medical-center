import { DateTime } from "luxon";

export function formatDateTime(dateTimeString: string, locale?: string) {
  const currentYear = DateTime.now().year;

  const dateTime = DateTime.fromFormat(dateTimeString, "yyyy-MM-dd HH:mm:ss");

  const formatString =
    dateTime.year === currentYear ? "d LLLL, HH:mm" : "d LLLL yyyy, HH:mm";

  return dateTime.setLocale(locale || "ro").toFormat(formatString);
}
