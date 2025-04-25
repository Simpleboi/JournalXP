import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export const saveJournalEntry = async (userId: string, entry: any) => {
  const userEntriesRef = collection(db, "users", userId, "journalEntries");
  await addDoc(userEntriesRef, {
    ...entry,
    createdAt: Timestamp.now(),
  });
};

export const getJournalEntries = async (userId: string) => {
  const entriesRef = collection(db, "users", userId, "journalEntries");
  const q = query(entriesRef);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
