export function parseLocalDate(yyyyMMdd: string): Date {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1); // local midnight
}

export function formatLocalDate(yyyyMMdd?: string | null): string {
  if (!yyyyMMdd) return "";
  return parseLocalDate(yyyyMMdd).toLocaleDateString();
}

export function combineLocalDateTime(
  yyyyMMdd: string,
  hhmm?: string | null
): Date {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  if (!hhmm) return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
  const [hh, mm] = hhmm.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0, 0);
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function getDueAt(task: {
  dueDate?: string | null;
  dueTime?: string | null;
}): Date | null {
  if (!task.dueDate) return null;
  // If time provided → exact local moment; else → end of local day
  return combineLocalDateTime(task.dueDate, task.dueTime ?? null);
}

export function isOverdue(task: {
  dueDate?: string | null;
  dueTime?: string | null;
}): boolean {
  const dueAt = getDueAt(task);
  if (!dueAt) return false;
  return new Date().getTime() > dueAt.getTime();
}

// "Due Today" only if same calendar day AND not overdue
export function isDueToday(task: {
  dueDate?: string | null;
  dueTime?: string | null;
}): boolean {
  if (!task.dueDate) return false;
  const dueAt = getDueAt(task)!;
  const today = startOfDay(new Date());
  const dueDay = startOfDay(dueAt);
  return (
    dueDay.getTime() === today.getTime() &&
    new Date().getTime() <= dueAt.getTime()
  );
}
