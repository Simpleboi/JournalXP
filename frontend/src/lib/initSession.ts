// frontend/src/lib/initSession.ts
import { authFetch } from "./authFetch";

export async function initSession() {
  const { user } = await authFetch("/session/init", { method: "POST" });
  return user; // UserClient
}


// import { getAuth } from "firebase/auth";
// import type { UserData } from "@/types/user";

// // Helper to initialize a user session by calling backend /api/session/init
// export async function initSession(): Promise<UserData> {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   if (!user) throw new Error("No authenticated user");

//   // Force a fresh ID token
//   const idToken = await user.getIdToken(true);

//   const res = await fetch("/api/session/init", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${idToken}`,
//     },
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     const body = await res.json().catch(() => ({}));
//     console.error(`initSession failed: `, res.status, text);
//     throw new Error(body?.error || `Init session failed: ${res.status}`);
//   }

//   const userData: UserData = await res.json();
//   return userData;
// }
