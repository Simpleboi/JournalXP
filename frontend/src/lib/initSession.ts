import { authFetch } from "./authFetch";
import type { SessionInitResponse } from "@shared/types/api";
import type { UserClient } from "@shared/types/user";

/**
 * Initialize or refresh a user session
 *
 * This function:
 * 1. Sends the user's Firebase ID token to the backend
 * 2. Backend verifies the token and creates/updates user document
 * 3. Optionally creates a session cookie for persistent auth
 * 4. Returns the user's data
 *
 * @param createCookie - Whether to create a session cookie (default: true)
 * @returns User data
 *
 * @example
 * ```typescript
 * // Initialize session with cookie (recommended)
 * const user = await initSession();
 *
 * // Initialize session without cookie (token-only auth)
 * const user = await initSession(false);
 * ```
 */
export async function initSession(
  createCookie: boolean = import.meta.env.MODE === "production"
): Promise<UserClient> {
  try {
    console.log("🔄 Initializing session...");

    // Call backend session init endpoint
    const response: SessionInitResponse = await authFetch("/session/init", {
      method: "POST",
      body: JSON.stringify({ createCookie }),
    });

    const { user, sessionCookie, expiresAt, message } = response;

    console.log("✅", message || "Session initialized");

    if (sessionCookie && expiresAt) {
      console.log(`🍪 Session cookie created, expires: ${expiresAt}`);
    }

    return user;
  } catch (error: any) {
    console.error("❌ Session initialization failed:", error);
    throw error;
  }
}

/**
 * Logout the current user
 *
 * This function:
 * 1. Calls the backend logout endpoint
 * 2. Clears the session cookie
 * 3. Optionally revokes all refresh tokens
 *
 * @param revokeTokens - Whether to revoke all refresh tokens (default: false)
 *
 * @example
 * ```typescript
 * // Simple logout (clears cookie only)
 * await logoutSession();
 *
 * // Logout and revoke all tokens (signs out from all devices)
 * await logoutSession(true);
 * ```
 */
export async function logoutSession(
  revokeTokens: boolean = false
): Promise<void> {
  try {
    console.log("🚪 Logging out...");

    await authFetch("/session/logout", {
      method: "POST",
      body: JSON.stringify({ revokeTokens }),
    });

    console.log("✅ Logged out successfully");
  } catch (error: any) {
    console.error("❌ Logout failed:", error);
    // Don't throw - logout should always succeed on client side
    // even if the backend call fails
  }
}

/**
 * Refresh the current session
 *
 * Updates the lastLogin timestamp without full re-initialization
 *
 * @returns Updated user data
 */
export async function refreshSession(): Promise<UserClient> {
  try {
    console.log("🔄 Refreshing session...");

    const response = await authFetch("/session/refresh", {
      method: "POST",
    });

    console.log("✅ Session refreshed");
    return response.user;
  } catch (error: any) {
    console.error("❌ Session refresh failed:", error);
    throw error;
  }
}

/**
 * Get current authenticated user data
 *
 * Fetches fresh user data from the backend without re-initializing the session
 *
 * @returns Current user data
 */
export async function getCurrentUser(): Promise<UserClient> {
  try {
    const response = await authFetch("/auth/me");
    return response.user;
  } catch (error: any) {
    console.error("❌ Failed to get current user:", error);
    throw error;
  }
}
