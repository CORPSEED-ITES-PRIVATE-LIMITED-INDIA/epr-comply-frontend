/** Backend dates arrive as `DD-MM-YYYY` or `DD-MM-YYYY HH:mm:ss`. */
export function parseApiDate(value) {
  if (!value) return 0;

  const match = String(value).match(
    /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/,
  );

  if (match) {
    const [, d, m, y, hh = "0", mm = "0", ss = "0"] = match;
    return new Date(+y, +m - 1, +d, +hh, +mm, +ss).getTime();
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const pad = (n) => String(n).padStart(2, "0");

/**
 * Formats the backend's `DD-MM-YYYY[ HH:mm:ss]` timestamps.
 *
 * Replaces the dayjs + customParseFormat pair the Vite build used, so no date
 * library reaches the browser bundle.
 *
 * Supported patterns: "MMM D, YYYY" and "DD-MM-YYYY".
 */
export function formatApiDate(value, pattern = "DD-MM-YYYY", fallback = "N/A") {
  const time = parseApiDate(value);
  if (!time) return fallback;

  const date = new Date(time);

  if (pattern === "MMM D, YYYY") {
    return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

/** ISO-8601 string for `article:published_time` / sitemap `lastModified`. */
export function toIsoDate(value) {
  const time = parseApiDate(value);
  return time ? new Date(time).toISOString() : undefined;
}

/** Strips tags from editor HTML so it can be used in a meta description. */
export function stripHtml(html = "", maxLength) {
  const text = String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
