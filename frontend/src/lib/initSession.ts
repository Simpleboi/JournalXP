// frontend/src/lib/initSession.ts
import { getAuth } from "firebase/auth";
import type { UserData } from "@/types/user";


// Helper to initialize a user session by calling backend /api/session/init
export async function initSession(): Promise<UserData> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  // Force a fresh ID token
  const idToken = await user.getIdToken(true);

  const res = await fetch("/api/session/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Init session failed: ${res.status}`);
  }

  const userData: UserData = await res.json();
  return userData;
}
