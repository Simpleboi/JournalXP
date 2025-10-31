/**
 * @param date - a firestore timestamp function
 * @returns a client-friendly ISO date to use as a string
 * Converts a firestore TimeStamp to client-friendly ISO
 * */
export function tsToIso(date: any): string | null {
  if (!date) {
    return null;
  }
  if (typeof date.toDate === "function") {
    return date.toDate();
  }
  if (date.seconds) {
    return new Date(date.seconds * 1000).toISOString();
  }
  return null;
}
