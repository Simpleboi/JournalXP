import { db } from "@/lib/firebase";
import { DocumentReference, doc } from "firebase/firestore";

/**
 * @returns a DocumentRefernece for the given user ID.
 */
export const userDocRef = (userId: string): DocumentReference => {
  return doc(db, "users", userId);
};
