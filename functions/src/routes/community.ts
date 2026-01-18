import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdate, didLevelUp } from "../lib/xpSystem";
import {
  checkAchievements,
  generateAchievementUpdate,
  extractStatsFromUserData,
} from "../lib/achievementSystem";
import { standardRateLimit, strictRateLimit } from "../middleware/rateLimit";
import { moderateContent, sanitizeContent } from "../lib/moderation";
import { generateAnonymousName } from "../lib/anonymousNames";
import type {
  CommunityPrompt,
  CommunityResponse,
  CommunityResponseServer,
  CommunityPromptWithResponses,
  GetPromptsResponse,
  CreateResponseRequest,
  CreateResponseResponse,
  HeartToggleResult,
  ReportSubmission,
  GetUserHistoryResponse,
  GetReportsResponse,
  ResolveReportRequest,
  COMMUNITY_CONSTANTS,
} from "../../../shared/types/community";

const router = Router();

// Constants
const MAX_RESPONSE_LENGTH = 500;
const MAX_RESPONSES_PER_DAY = 15;
const XP_PER_RESPONSE = 20;
const REPORT_THRESHOLD_FOR_HIDE = 3;

/**
 * Convert Firestore Timestamp to ISO string
 */
function tsToISO(v: any): string | null {
  if (v && typeof v.toDate === "function") return v.toDate().toISOString();
  if (v && typeof v.seconds === "number")
    return new Date(v.seconds * 1000).toISOString();
  return v ?? null;
}

/**
 * Get the start of the next day (midnight) for daily limit reset
 */
function getNextMidnight(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

/**
 * Check if daily limit should be reset based on dailyResetAt timestamp
 */
function shouldResetDailyLimit(dailyResetAt: string | undefined): boolean {
  if (!dailyResetAt) return true;
  return new Date(dailyResetAt) <= new Date();
}

/**
 * Serialize a community prompt from Firestore
 */
function serializePrompt(id: string, data: FirebaseFirestore.DocumentData): CommunityPrompt {
  return {
    id,
    text: data.text || "",
    category: data.category || "reflection",
    activeDate: data.activeDate || "",
    expiresAt: tsToISO(data.expiresAt) || "",
    createdAt: tsToISO(data.createdAt) || "",
    responseCount: data.responseCount || 0,
    isActive: data.isActive !== false,
    order: data.order || 0,
  };
}

/**
 * Serialize a community response for the client
 */
function serializeResponse(
  id: string,
  data: FirebaseFirestore.DocumentData,
  currentUserId: string,
  heartedByUser: boolean
): CommunityResponse {
  return {
    id,
    promptId: data.promptId || "",
    anonymousName: data.anonymousName || "Anonymous",
    content: data.content || "",
    createdAt: tsToISO(data.createdAt) || "",
    heartCount: data.heartCount || 0,
    hasHearted: heartedByUser,
    isOwn: data.userId === currentUserId,
  };
}

/**
 * GET /community/prompts
 * Get active prompts with their responses
 */
router.get("/prompts", standardRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;

    // Get user's community stats to check daily limit
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};
    let communityStats = userData.communityStats || {
      totalResponses: 0,
      totalHeartsGiven: 0,
      totalHeartsReceived: 0,
      responsesToday: 0,
      dailyResetAt: getNextMidnight(),
      totalXPfromCommunity: 0,
    };

    // Reset daily count if needed
    if (shouldResetDailyLimit(communityStats.dailyResetAt)) {
      communityStats.responsesToday = 0;
      communityStats.dailyResetAt = getNextMidnight();
      await userRef.set({ communityStats }, { merge: true });
    }

    // Get active prompts
    const promptsRef = db.collection("communityPrompts");
    const promptsSnapshot = await promptsRef
      .where("isActive", "==", true)
      .orderBy("order", "asc")
      .get();

    const promptsWithResponses: CommunityPromptWithResponses[] = [];

    for (const promptDoc of promptsSnapshot.docs) {
      const prompt = serializePrompt(promptDoc.id, promptDoc.data());

      // Get responses for this prompt (not hidden or deleted)
      const responsesRef = db.collection("communityResponses");
      const responsesSnapshot = await responsesRef
        .where("promptId", "==", promptDoc.id)
        .where("isHidden", "==", false)
        .where("isDeleted", "==", false)
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

      // Check which responses the user has hearted
      const responseIds = responsesSnapshot.docs.map((d) => d.id);
      const heartedSet = new Set<string>();

      // Batch check hearts (max 10 at a time for Firestore IN query)
      for (let i = 0; i < responseIds.length; i += 10) {
        const batch = responseIds.slice(i, i + 10);
        for (const responseId of batch) {
          const heartDoc = await db
            .collection("communityResponses")
            .doc(responseId)
            .collection("hearts")
            .doc(uid)
            .get();
          if (heartDoc.exists) {
            heartedSet.add(responseId);
          }
        }
      }

      // Serialize responses
      const responses = responsesSnapshot.docs.map((doc) =>
        serializeResponse(doc.id, doc.data(), uid, heartedSet.has(doc.id))
      );

      // Check if user has responded to this prompt
      const userResponseQuery = await responsesRef
        .where("promptId", "==", promptDoc.id)
        .where("userId", "==", uid)
        .limit(1)
        .get();

      const hasResponded = !userResponseQuery.empty;
      const userResponseId = hasResponded ? userResponseQuery.docs[0].id : undefined;

      promptsWithResponses.push({
        prompt,
        responses,
        hasResponded,
        userResponseId,
      });
    }

    const response: GetPromptsResponse = {
      prompts: promptsWithResponses,
      responsesToday: communityStats.responsesToday,
      maxResponsesPerDay: MAX_RESPONSES_PER_DAY,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting community prompts:", error);
    res.status(500).json({ error: "Failed to get prompts", details: error.message });
  }
});

/**
 * POST /community/responses
 * Create a new response to a prompt
 */
router.post("/responses", strictRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { promptId, content } = req.body as CreateResponseRequest;

    // Validate input
    if (!promptId || typeof promptId !== "string") {
      res.status(400).json({ error: "promptId is required" });
      return;
    }

    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "content is required" });
      return;
    }

    if (content.length > MAX_RESPONSE_LENGTH) {
      res.status(400).json({
        error: `Content exceeds maximum length of ${MAX_RESPONSE_LENGTH} characters`,
        code: "CONTENT_TOO_LONG",
      });
      return;
    }

    // Moderate content
    const moderationResult = moderateContent(content);
    if (!moderationResult.passed) {
      res.status(400).json({
        error: moderationResult.reason,
        code: "MODERATION_FAILED",
      });
      return;
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(content);

    const userRef = db.collection("users").doc(uid);
    const promptRef = db.collection("communityPrompts").doc(promptId);
    const responseRef = db.collection("communityResponses").doc();

    let responseData: CommunityResponse;
    let xpAwarded = 0;
    let newTotalXP = 0;
    let newLevel = 0;
    let leveledUp = false;
    let responsesToday = 0;
    let newlyUnlockedAchievements: any[] = [];

    // Use transaction for atomic updates
    await db.runTransaction(async (tx) => {
      // Verify prompt exists and is active
      const promptDoc = await tx.get(promptRef);
      if (!promptDoc.exists) {
        throw new Error("Prompt not found");
      }
      const promptData = promptDoc.data()!;
      if (!promptData.isActive) {
        throw new Error("Prompt is no longer active");
      }

      // Get user data
      const userDoc = await tx.get(userRef);
      const userData = userDoc.data() || {};
      const currentTotalXP = userData.totalXP || 0;
      const currentLevel = userData.level || 1;

      // Get/initialize community stats
      let communityStats = userData.communityStats || {
        totalResponses: 0,
        totalHeartsGiven: 0,
        totalHeartsReceived: 0,
        responsesToday: 0,
        dailyResetAt: getNextMidnight(),
        totalXPfromCommunity: 0,
      };

      // Reset daily count if needed
      if (shouldResetDailyLimit(communityStats.dailyResetAt)) {
        communityStats.responsesToday = 0;
        communityStats.dailyResetAt = getNextMidnight();
      }

      // Check daily limit
      if (communityStats.responsesToday >= MAX_RESPONSES_PER_DAY) {
        const error: any = new Error("Daily response limit reached");
        error.code = "DAILY_LIMIT_REACHED";
        error.status = 429;
        throw error;
      }

      // Check if user already responded to this prompt
      const existingResponseQuery = await db
        .collection("communityResponses")
        .where("promptId", "==", promptId)
        .where("userId", "==", uid)
        .limit(1)
        .get();

      if (!existingResponseQuery.empty) {
        const error: any = new Error("You have already responded to this prompt");
        error.code = "ALREADY_RESPONDED";
        error.status = 400;
        throw error;
      }

      // Generate anonymous name
      const anonymousName = generateAnonymousName(uid, responseRef.id, currentLevel);

      // Create response document
      const now = Timestamp.now();
      const responseServerData: Omit<CommunityResponseServer, "id"> = {
        promptId,
        userId: uid,
        anonymousName,
        content: sanitizedContent,
        createdAt: now.toDate().toISOString(),
        heartCount: 0,
        reportCount: 0,
        isHidden: false,
        isDeleted: false,
      };

      tx.set(responseRef, {
        ...responseServerData,
        createdAt: now,
      });

      // Increment prompt response count
      tx.update(promptRef, {
        responseCount: FieldValue.increment(1),
      });

      // Calculate XP update
      const xpUpdate = calculateXPUpdate(currentTotalXP, XP_PER_RESPONSE);
      xpAwarded = XP_PER_RESPONSE;
      newTotalXP = xpUpdate.totalXP;
      newLevel = xpUpdate.level;
      leveledUp = didLevelUp(currentLevel, newLevel);

      // Update community stats
      communityStats.totalResponses += 1;
      communityStats.responsesToday += 1;
      communityStats.totalXPfromCommunity += XP_PER_RESPONSE;

      responsesToday = communityStats.responsesToday;

      // Check for achievements
      const statsForAchievements = extractStatsFromUserData({
        ...userData,
        totalXP: xpUpdate.totalXP,
      });
      const achievementCheck = checkAchievements(statsForAchievements);
      newlyUnlockedAchievements = achievementCheck.newlyUnlocked;
      const achievementUpdate = generateAchievementUpdate(achievementCheck.newlyUnlocked);

      // Update user document
      const { spendableXPAmount, ...xpUpdateFields } = xpUpdate;
      tx.set(
        userRef,
        {
          ...xpUpdateFields,
          ...achievementUpdate,
          spendableXP: FieldValue.increment(spendableXPAmount),
          communityStats,
          "milestones.firstCommunityPost": userData.milestones?.firstCommunityPost || now,
        },
        { merge: true }
      );

      // Prepare response data
      responseData = {
        id: responseRef.id,
        promptId,
        anonymousName,
        content: sanitizedContent,
        createdAt: now.toDate().toISOString(),
        heartCount: 0,
        hasHearted: false,
        isOwn: true,
      };
    });

    const response: CreateResponseResponse = {
      response: responseData!,
      xpAwarded,
      newTotalXP,
      newLevel,
      leveledUp,
      responsesToday,
    };

    if (newlyUnlockedAchievements.length > 0) {
      response.achievements = newlyUnlockedAchievements.map((a) => a.id);
    }

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error creating community response:", error);

    if (error.code === "DAILY_LIMIT_REACHED") {
      res.status(429).json({
        error: error.message,
        code: error.code,
      });
    } else if (error.code === "ALREADY_RESPONDED") {
      res.status(400).json({
        error: error.message,
        code: error.code,
      });
    } else if (error.message === "Prompt not found" || error.message === "Prompt is no longer active") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create response", details: error.message });
    }
  }
});

/**
 * POST /community/responses/:id/heart
 * Toggle heart on a response
 */
router.post("/responses/:id/heart", standardRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Response id is required" });
      return;
    }

    const responseRef = db.collection("communityResponses").doc(id);
    const heartRef = responseRef.collection("hearts").doc(uid);
    const userRef = db.collection("users").doc(uid);

    let result: HeartToggleResult;

    await db.runTransaction(async (tx) => {
      const responseDoc = await tx.get(responseRef);
      if (!responseDoc.exists) {
        throw new Error("Response not found");
      }

      const responseData = responseDoc.data()!;
      if (responseData.isDeleted || responseData.isHidden) {
        throw new Error("Response is not available");
      }

      const heartDoc = await tx.get(heartRef);
      const isCurrentlyHearted = heartDoc.exists;

      if (isCurrentlyHearted) {
        // Remove heart
        tx.delete(heartRef);
        tx.update(responseRef, {
          heartCount: FieldValue.increment(-1),
        });

        // Update user stats
        tx.set(
          userRef,
          {
            "communityStats.totalHeartsGiven": FieldValue.increment(-1),
          },
          { merge: true }
        );

        // Update response author's stats
        if (responseData.userId) {
          const authorRef = db.collection("users").doc(responseData.userId);
          tx.set(
            authorRef,
            {
              "communityStats.totalHeartsReceived": FieldValue.increment(-1),
            },
            { merge: true }
          );
        }

        result = {
          hearted: false,
          heartCount: (responseData.heartCount || 1) - 1,
        };
      } else {
        // Add heart
        tx.set(heartRef, {
          userId: uid,
          createdAt: Timestamp.now(),
        });
        tx.update(responseRef, {
          heartCount: FieldValue.increment(1),
        });

        // Update user stats
        tx.set(
          userRef,
          {
            "communityStats.totalHeartsGiven": FieldValue.increment(1),
          },
          { merge: true }
        );

        // Update response author's stats
        if (responseData.userId) {
          const authorRef = db.collection("users").doc(responseData.userId);
          tx.set(
            authorRef,
            {
              "communityStats.totalHeartsReceived": FieldValue.increment(1),
            },
            { merge: true }
          );
        }

        result = {
          hearted: true,
          heartCount: (responseData.heartCount || 0) + 1,
        };
      }
    });

    res.json(result!);
  } catch (error: any) {
    console.error("Error toggling heart:", error);
    if (error.message === "Response not found" || error.message === "Response is not available") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to toggle heart", details: error.message });
    }
  }
});

/**
 * POST /community/reports
 * Report a response for moderation
 */
router.post("/reports", strictRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { responseId, reason, details } = req.body as ReportSubmission;

    // Validate input
    if (!responseId || typeof responseId !== "string") {
      res.status(400).json({ error: "responseId is required" });
      return;
    }

    const validReasons = ["inappropriate", "spam", "harassment", "other"];
    if (!reason || !validReasons.includes(reason)) {
      res.status(400).json({ error: "Valid reason is required", validReasons });
      return;
    }

    const responseRef = db.collection("communityResponses").doc(responseId);
    const reportRef = db.collection("communityReports").doc();

    await db.runTransaction(async (tx) => {
      // Verify response exists
      const responseDoc = await tx.get(responseRef);
      if (!responseDoc.exists) {
        throw new Error("Response not found");
      }

      const responseData = responseDoc.data()!;

      // Check if user already reported this response
      const existingReportQuery = await db
        .collection("communityReports")
        .where("responseId", "==", responseId)
        .where("reporterId", "==", uid)
        .limit(1)
        .get();

      if (!existingReportQuery.empty) {
        const error: any = new Error("You have already reported this response");
        error.code = "ALREADY_REPORTED";
        error.status = 400;
        throw error;
      }

      // Create report
      tx.set(reportRef, {
        responseId,
        reporterId: uid,
        reason,
        details: details || null,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      // Increment report count on response
      const newReportCount = (responseData.reportCount || 0) + 1;
      const updates: any = {
        reportCount: FieldValue.increment(1),
      };

      // Auto-hide if threshold reached
      if (newReportCount >= REPORT_THRESHOLD_FOR_HIDE) {
        updates.isHidden = true;
      }

      tx.update(responseRef, updates);
    });

    res.status(201).json({ success: true, message: "Report submitted" });
  } catch (error: any) {
    console.error("Error submitting report:", error);
    if (error.code === "ALREADY_REPORTED") {
      res.status(400).json({ error: error.message, code: error.code });
    } else if (error.message === "Response not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to submit report", details: error.message });
    }
  }
});

/**
 * GET /community/my-responses
 * Get user's response history
 */
router.get("/my-responses", standardRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;

    // Get user's responses
    const responsesRef = db.collection("communityResponses");
    const responsesSnapshot = await responsesRef
      .where("userId", "==", uid)
      .where("isDeleted", "==", false)
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    // Get prompt details for each response
    const responses = await Promise.all(
      responsesSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const promptDoc = await db.collection("communityPrompts").doc(data.promptId).get();
        const promptData = promptDoc.data();

        return {
          id: doc.id,
          promptText: promptData?.text || "Unknown prompt",
          promptCategory: promptData?.category || "reflection",
          content: data.content,
          anonymousName: data.anonymousName,
          createdAt: tsToISO(data.createdAt) || "",
          heartCount: data.heartCount || 0,
        };
      })
    );

    // Get user stats
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data() || {};
    const communityStats = userData.communityStats || {};

    const response: GetUserHistoryResponse = {
      responses,
      totalResponses: communityStats.totalResponses || 0,
      totalHeartsReceived: communityStats.totalHeartsReceived || 0,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting user responses:", error);
    res.status(500).json({ error: "Failed to get responses", details: error.message });
  }
});

/**
 * GET /community/admin/reports
 * Get pending reports (admin only)
 */
router.get("/admin/reports", strictRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;

    // Check if user is admin (you may want to implement proper admin checking)
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData?.isAdmin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const reportsRef = db.collection("communityReports");
    const reportsSnapshot = await reportsRef
      .where("status", "==", "pending")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const reports = await Promise.all(
      reportsSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Get response details
        const responseDoc = await db.collection("communityResponses").doc(data.responseId).get();
        const responseData = responseDoc.data();

        // Get prompt details
        let promptText = "Unknown prompt";
        if (responseData?.promptId) {
          const promptDoc = await db.collection("communityPrompts").doc(responseData.promptId).get();
          promptText = promptDoc.data()?.text || "Unknown prompt";
        }

        return {
          id: doc.id,
          responseId: data.responseId,
          reporterId: data.reporterId,
          reason: data.reason,
          details: data.details,
          status: data.status,
          createdAt: tsToISO(data.createdAt) || "",
          responseContent: responseData?.content || "[Deleted]",
          responseAnonymousName: responseData?.anonymousName || "Unknown",
          promptText,
        };
      })
    );

    const response: GetReportsResponse = {
      reports,
      totalPending: reports.length,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting reports:", error);
    res.status(500).json({ error: "Failed to get reports", details: error.message });
  }
});

/**
 * POST /community/admin/reports/:id/resolve
 * Resolve a report (admin only)
 */
router.post("/admin/reports/:id/resolve", strictRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;
    const { resolution, notes } = req.body as ResolveReportRequest;

    // Check if user is admin
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData?.isAdmin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    if (!id) {
      res.status(400).json({ error: "Report id is required" });
      return;
    }

    const validResolutions = ["remove_content", "dismiss", "warn_user"];
    if (!resolution || !validResolutions.includes(resolution)) {
      res.status(400).json({ error: "Valid resolution is required", validResolutions });
      return;
    }

    const reportRef = db.collection("communityReports").doc(id);

    await db.runTransaction(async (tx) => {
      const reportDoc = await tx.get(reportRef);
      if (!reportDoc.exists) {
        throw new Error("Report not found");
      }

      const reportData = reportDoc.data()!;

      // Update report
      tx.update(reportRef, {
        status: resolution === "dismiss" ? "dismissed" : "resolved",
        reviewedAt: Timestamp.now(),
        reviewedBy: uid,
        resolution: notes || resolution,
      });

      // If removing content, mark response as deleted
      if (resolution === "remove_content") {
        const responseRef = db.collection("communityResponses").doc(reportData.responseId);
        tx.update(responseRef, {
          isDeleted: true,
          isHidden: true,
        });
      }
    });

    res.json({ success: true, message: "Report resolved" });
  } catch (error: any) {
    console.error("Error resolving report:", error);
    if (error.message === "Report not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to resolve report", details: error.message });
    }
  }
});

export default router;
