import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  DocumentReference,
  getDocs,
} from "firebase/firestore";
import { collection, writeBatch } from "firebase/firestore";

/**
 * @returns a DocumentReference for the given user ID.
 */
export const userDocRef = (userId: string): DocumentReference => {
  return doc(db, "users", userId);
};

export const incrementJournalCount = async (userId: string): Promise<void> => {
  const ref = userDocRef(userId);
  await updateDoc(ref, {
    journalCount: increment(1),
    totalJournalEntires: increment(1),
  });
};

/**
 * @param points - an integer value to increase user points
 */
export const addPoints = async (userId: string, points: number) => {
  const ref = userDocRef(userId);
  await updateDoc(ref, {
    points: increment(points),
  });
};

/**
 *
 */
export async function deleteAllJournalEntries(userId: string) {
  const entriesRef = collection(db, "users", userId, "journalEntries");
  const snapShot = await getDocs(entriesRef);
  const docs = snapShot.docs;
  if (docs.length === 0) return;

  // Delete logic
  const batch = writeBatch(db);
  snapShot.docs.forEach((entryDoc) => {
    batch.delete(entryDoc.ref);
  });

  await batch.commit();
}
