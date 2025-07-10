import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  DocumentReference,
  getDocs,
} from "firebase/firestore";
import { collection, writeBatch, Timestamp } from "firebase/firestore";

/**
 * @returns a DocumentReference for the given user ID.
 */
export const userDocRef = (userId: string): DocumentReference => {
  return doc(db, "users", userId);
};


/**
 * This function updates the user submission
 */
export const awardJournalEntry = async (userId: string): Promise<void> => {
  const ref = userDocRef(userId);
  await updateDoc(ref, {
    journalCount: increment(1),
    totalJournalEntries: increment(1),
    points: increment(30),
  });
};


/**
 * @param wordCount - a string to represent the total words in an entry
*/
export const addWordsToTotal = async(userId: string, wordCount: number): Promise<void> => {
  const ref = userDocRef(userId);
  await updateDoc(ref, {
    "journalStats.totalWordCount": increment(wordCount)
  })
}



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
 * @param userId - a string that represents the user's id
 * This functions only works if the user has less than 500 entries. If it's more, then idk
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

/**
 * @param journalContent - a string that represents the content in an entry
 * @returns a number that represents the total word count.
 */
export function getWordCount(journalContent: string): number {
  let wordCount = 0;
  let totalStrings = journalContent.split(" ");
  for (let i = 0; i < totalStrings.length; i++) {
    wordCount += 1;
  }
  return wordCount;
}

/**
 * This function is used to convert a server Time Stamp into a string
*/
export const timestampToIsoString = (
  ts: Timestamp | string
): string => {
  if (typeof ts === 'string') {
    return ts;
  }
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString();
  }
  // Fallback for custom objects with toDate()
  if ((ts as any)?.toDate instanceof Function) {
    return (ts as any).toDate().toISOString();
  }
  throw new Error('Invalid timestamp format');
};
