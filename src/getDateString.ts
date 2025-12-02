export default function getDateString(
  date?: null | string,
  ignore31122500 = false,
  locale = "de",
): string | undefined {
  if (!date || (ignore31122500 && date.includes("2500-12-31"))) {
    return undefined;
  }
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
export function getHoursString(
  date?: null | string,
  ignore31122500 = false,
  locale = "de",
): string | undefined {
  if (!date || (ignore31122500 && date.includes("2500-12-31"))) {
    return undefined;
  }
  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
