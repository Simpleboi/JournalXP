import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../lib/admin";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import { tsToIso } from "../../../shared/utils/date";
import type { AuthMeResponse, ApiError } from "../../../shared/types/api";
import type { UserClient } from "../../../shared/types/user";

const router = Router();

/**
 * Convert Firestore user document to UserClient DTO
 */
function toUserClient(doc: any): UserClient {
  return {
    username: doc.username ?? doc.displayName ?? "New User",
    level: doc.level ?? 1,
    xp: doc.xp ?? 0,
    totalXP: doc.totalXP ?? 0,
    xpNeededToNextLevel: doc.xpNeededToNextLevel ?? 100,
    streak: doc.streak ?? 0,
    rank: doc.rank ?? "Bronze III",
    profilePicture:
      doc.profilePicture ?? doc.photoURL ?? doc.photoUrl ?? undefined,
    journalStats: doc.journalStats ?? {
      journalCount: 0,
      totalJournalEntries: 0,
      totalWordCount: 0,
      averageEntryLength: 0,
      mostUsedWords: [],
    },
    taskStats: doc.taskStats ?? {
      currentTasksCreated: 0,
      currentTasksCompleted: 0,
      currentTasksPending: 0,
      completionRate: 0,
      priorityCompletion: { high: 0, medium: 0, low: 0 },
    },
  };
}

/**
 * GET /api/auth/me
 *
 * Get the currently authenticated user's data
 *
 * This endpoint returns the full user profile for the authenticated user.
 * It's useful for:
 * - Restoring user state after page reload
 * - Verifying authentication status
 * - Getting fresh user data without full session re-init
 *
 * Request: Requires authentication (Bearer token or session cookie)
 * Response: { user: UserClient, authenticated: true, sessionType: "token" | "cookie" }
 */
router.get(
  "/me",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { uid } = (req as AuthenticatedRequest).user!;

      // Fetch user document from Firestore
      const userRef = db.collection("users").doc(uid);
      const snapshot = await userRef.get();

      if (!snapshot.exists) {
        // User authenticated but no document exists
        // This shouldn't happen if session/init was called, but handle it gracefully
        const errorResponse: ApiError = {
          error: "User not found",
          details: "User document does not exist. Please initialize your session.",
          code: "USER_NOT_FOUND",
        };
        res.status(404).json(errorResponse);
        return;
      }

      const userData = snapshot.data()!;

      // Convert to client DTO
      const clientUser = toUserClient({
        ...userData,
        joinDate: tsToIso(userData.joinDate),
        createdAt: tsToIso(userData.createdAt),
        updatedAt: tsToIso(userData.updatedAt),
        lastLogin: tsToIso(userData.lastLogin),
      });

      // Determine session type based on what was used for authentication
      const sessionType = req.headers.authorization ? "token" : "cookie";

      const response: AuthMeResponse = {
        user: clientUser,
        authenticated: true,
        sessionType,
      };

      res.json(response);
    } catch (error: any) {
      console.error("auth/me error:", error);
      const errorResponse: ApiError = {
        error: "Failed to fetch user data",
        details: error.message,
        code: "AUTH_ME_FAILED",
      };
      res.status(500).json(errorResponse);
    }
  }
);

/**
 * GET /api/auth/status
 *
 * Quick authentication status check (lightweight, no DB query)
 *
 * This endpoint only verifies the token/cookie without fetching user data.
 * Useful for quick auth checks in middleware or before making other requests.
 *
 * Request: Requires authentication
 * Response: { authenticated: true, uid: string, sessionType: "token" | "cookie" }
 */
router.get(
  "/status",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { uid, email } = (req as AuthenticatedRequest).user!;
      const sessionType = req.headers.authorization ? "token" : "cookie";

      res.json({
        authenticated: true,
        uid,
        email,
        sessionType,
      });
    } catch (error: any) {
      console.error("auth/status error:", error);
      const errorResponse: ApiError = {
        error: "Failed to check auth status",
        details: error.message,
        code: "AUTH_STATUS_FAILED",
      };
      res.status(500).json(errorResponse);
    }
  }
);

export default router;
