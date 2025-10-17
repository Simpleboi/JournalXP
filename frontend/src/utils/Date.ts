export function parseLocalDate(yyyyMMdd: string): Date {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1); // local midnight
}

export function formatLocalDate(yyyyMMdd?: string | null): string {
  if (!yyyyMMdd) return "";
  return parseLocalDate(yyyyMMdd).toLocaleDateString();
}

export function combineLocalDateTime(yyyyMMdd: string, hhmm?: string | null): Date {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  if (!hhmm) return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
  const [hh, mm] = hhmm.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
}
