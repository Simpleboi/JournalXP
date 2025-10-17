import { Timestamp } from "firebase/firestore";

/**
 * This function converts a firestore timestamp into a JS date object
 * @param ts - a firestore timestamp
 * @returns a JS date object
 * */
function toDate(ts: Timestamp | Date): Date {
  return ts instanceof Timestamp ? ts.toDate() : ts;
}

/**
 * Check if currentDate is the next day (for streak continuation)
 * @param previous - a JS date object
 * @param current - a JS date onject
 */
function isNextDay(previous: Date, current: Date): boolean {
  const prev = new Date(previous);
  const curr = new Date(current);

  prev.setHours(0, 0, 0, 0);
  curr.setHours(0, 0, 0, 0);

  const diffInDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays === 1;
}

// Check if more than 24 hours have passed (for streak reset)
function isLongerThan24Hours(previous: Date, current: Date): boolean {
  const diffMs = current.getTime() - previous.getTime();
  return diffMs > 24 * 60 * 60 * 1000;
}

// Check if it's the same day or not
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
