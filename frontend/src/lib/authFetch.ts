import { getAuth } from "firebase/auth";

const DEFAULT_BASE = "https://api-qqraybadna-uc.a.run.app";

// function to verify the user
export async function authFetch(path: string, init?: RequestInit) {
  const token = await getAuth().currentUser?.getIdToken();

  const url = path.startsWith("http")
    ? path
    : `${DEFAULT_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  console.log("authFetch: ", url);

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
}
