import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDefaultUserData } from "@/utils/defaultUserData";
import { authFetch } from "@/lib/authFetch";

export const ensureUserProfileExists = async (uid: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const defaultData = getDefaultUserData(uid, email);
    await setDoc(userRef, defaultData);
  }
};

// To handle purchasing things via backend API
export const purchaseItem = async (userId: string, item: { id: string; price: number }) => {
  console.log("📦 purchaseItem called:", { userId, itemId: item.id, price: item.price });

  console.log("💳 Calling backend API...");
  const response = await authFetch("/store/purchase", {
    method: "POST",
    body: JSON.stringify({
      itemId: item.id,
      price: item.price,
    }),
  });

  console.log("✅ Purchase response:", response);
  return response;
};
