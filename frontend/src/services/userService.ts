import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { getDefaultUserData } from "@/utils/defaultUserData";

export const ensureUserProfileExists = async (uid: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const defaultData = getDefaultUserData(uid, email);
    await setDoc(userRef, defaultData);
  }
};

// To handle purchasing things
export const purchaseItem = async (userId: string, item: { id: string; price: number }) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (!userData) throw new Error("User data not found");

  if (userData.xp < item.price) {
    throw new Error("Not enough XP");
  }

  await updateDoc(userRef, {
    xp: increment(-item.price),
    inventory: arrayUnion(item.id),
  });
};
