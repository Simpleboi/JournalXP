import { getAuth } from "firebase/auth";

/**
 * Default API base URL
 * In development, this will be proxied by Vite to the local backend/emulator
 * In production, this points to the Cloud Functions API
 */
const DEFAULT_BASE =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_DEV || "http://127.0.0.1:5001/journalxp-4ea0f/us-central1/api"
    : import.meta.env.VITE_API_PROD || "https://api-qqraybadna-uc.a.run.app";

/**
 * Authenticated fetch wrapper
 *
 * This function automatically:
 * 1. Gets a fresh Firebase ID token from the current user
 * 2. Adds the token to the Authorization header
 * 3. Includes credentials (cookies) in the request
 * 4. Handles errors with structured error messages
 *
 * @param path - API endpoint path (e.g., "/session/init")
 * @param init - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws Error with structured error message on failure
 *
 * @example
 * ```typescript
 * const user = await authFetch("/auth/me");
 * const result = await authFetch("/session/logout", { method: "POST" });
 * ```
 */
export async function authFetch(path: string, init?: RequestInit) {
  try {
    // Get fresh ID token from Firebase Auth
    // This ensures the token is not expired
    const token = await getAuth().currentUser?.getIdToken(true);

    // Construct full URL
    const url = path.startsWith("http")
      ? path
      : `${DEFAULT_BASE}${path.startsWith("/") ? path : `/${path}`}`;

    console.log(`🔐 authFetch: ${init?.method || "GET"} ${url}`);

    // Make authenticated request
    const res = await fetch(url, {
      ...init,
      // Include credentials only in production (emulator has CORS issues with credentials)
      credentials: import.meta.env.MODE === "production" ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        // Add Authorization header if token is available
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // Handle non-OK responses
    if (!res.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        // If JSON parsing fails, use status text
        errorData = { error: res.statusText };
      }

      // Create structured error message
      const errorMessage = errorData.error || `Request failed: ${res.status}`;
      const errorDetails = errorData.details || "";
      const errorCode = errorData.code || "UNKNOWN_ERROR";

      const error = new Error(
        errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage
      );
      (error as any).code = errorCode;
      (error as any).status = res.status;

      throw error;
    }

    // Parse and return JSON response
    return res.json();
  } catch (error: any) {
    console.error("authFetch error:", error);
    throw error;
  }
}

/**
 * Unauthenticated fetch wrapper (no token required)
 *
 * Use this for public endpoints that don't require authentication
 *
 * @param path - API endpoint path
 * @param init - Fetch options
 * @returns Parsed JSON response
 */
export async function publicFetch(path: string, init?: RequestInit) {
  const url = path.startsWith("http")
    ? path
    : `${DEFAULT_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  console.log(`🌐 publicFetch: ${init?.method || "GET"} ${url}`);

  const res = await fetch(url, {
    ...init,
    credentials: import.meta.env.MODE === "production" ? "include" : "omit",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: res.statusText };
    }

    const errorMessage = errorData.error || `Request failed: ${res.status}`;
    throw new Error(errorMessage);
  }

  return res.json();
}
