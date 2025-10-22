import { db } from "@/lib/firebaseAdmin"

// This returns the user reference
export const UserRef = (uid: string) => {
    return db.collection("users").doc(uid);
}