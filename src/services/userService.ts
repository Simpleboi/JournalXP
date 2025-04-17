import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDefaultUserData } from "@/utils/defaultUserData";

export const ensureUserProfileExists = async (uid: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const defaultData = getDefaultUserData(email);
    await setDoc(userRef, defaultData);
  }
};
