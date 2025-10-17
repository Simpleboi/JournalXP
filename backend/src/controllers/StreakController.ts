// functions/src/streakOnEntryCreate.ts
import * as admin from "firebase-admin";
import { db } from "@/lib/firebaseAdmin";

/**
 * Trigger when a new journal entry is added:
 * /users/{userId}/entries/{entryId}
 */
// export const updateStreakOnEntryCreate = functions.onDocumentCreated(
//   "users/{userId}/entries/{entryId}",
//   async (event) => {
//     const { userId } = event.params;
//     const userRef = db.collection("users").doc(userId);

//     // Use server time (UTC) so client clocks don't matter
//     const now = admin.firestore.Timestamp.now();

//     await db.runTransaction(async (tx) => {
//       const snap = await tx.get(userRef);
//       if (!snap.exists) return;

//       const data = snap.data() || {};
//       const last = (data.lastJournalDate as admin.firestore.Timestamp | undefined)?.toDate();
//       const curr = now.toDate();

//       let streak = typeof data.streak === "number" ? data.streak : 0;

//       if (!last) {
//         streak = 1; // first ever entry
//       } else if (isNextDay(last, curr, data.timezone)) {
//         streak += 1; // continued
//       } else if (isSameDay(last, curr, data.timezone)) {
//         // same calendar day → don't change streak
//       } else {
//         streak = 1; // broke streak, start over at 1 for today’s entry
//       }

//       tx.update(userRef, {
//         streak,
//         lastJournalDate: now,
//       });
//     });
//   }
// );

/** Calendar helpers with optional user timezone (IANA, e.g. "America/Chicago"). */
// function startOfLocalDay(d: Date, tz = "UTC") {
//   // Compute local midnight via toLocaleString trick (no extra libs)
//   const s = d.toLocaleString("en-CA", { timeZone: tz });
//   // s like "2025-10-17, 01:23:45" on many environments; we only need the date part
//   const datePart = s.split(",")[0]; // "YYYY-MM-DD"
//   const [y, m, day] = datePart.split("-").map(Number);
//   // Construct a Date in that local day, then return its UTC equivalent
//   return new Date(Date.UTC(y, m - 1, day, 0, 0, 0, 0));
// }

// function dayDiff(a: Date, b: Date, tz?: string) {
//   const A = startOfLocalDay(a, tz);
//   const B = startOfLocalDay(b, tz);
//   return Math.round((B.getTime() - A.getTime()) / 86_400_000);
// }

// function isSameDay(a: Date, b: Date, tz?: string) {
//   return dayDiff(a, b, tz) === 0;
// }

// function isNextDay(a: Date, b: Date, tz?: string) {
//   return dayDiff(a, b, tz) === 1;
// }
