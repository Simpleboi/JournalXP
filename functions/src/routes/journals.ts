import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdate } from "../lib/xpSystem";
import {
  checkAchievements,
  generateAchievementUpdate,
  extractStatsFromUserData,
} from "../lib/achievementSystem";
import { standardRateLimit, strictRateLimit } from "../middleware/rateLimit";
import { getOpenAI } from "../lib/openai";

const router = Router();

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
 * Serialize Firestore journal entry document to client-friendly format
 */
function serializeJournalEntry(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    type: data.type || "free-writing",
    content: data.content || "",
    mood: data.mood || "",
    date: tsToISO(data.createdAt) || tsToISO(data.date),
    createdAt: tsToISO(data.createdAt),
    isFavorite: !!data.isFavorite,
    wordCount: data.wordCount || 0,
    tags: data.tags || [],
    linkedEntryIds: data.linkedEntryIds || [],
    timeSpentWriting: data.timeSpentWriting || 0,
  };
}

/**
 * Calculate word count from journal content
 */
function getWordCount(content: string): number {
  if (!content || typeof content !== "string") return 0;
  return content.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Calculate the new streak value based on the last journal entry date
 * Rules:
 * - If no previous entry, start streak at 1
 * - If last entry was yesterday (consecutive day), increment streak
 * - If last entry was today, keep current streak
 * - If last entry was more than 1 day ago, reset streak to 1
 */
function calculateStreak(lastEntryDate: Date | null, currentStreak: number): number {
  if (!lastEntryDate) {
    // First journal entry ever
    return 1;
  }

  // Get start of today (midnight) in user's timezone
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get start of last entry date
  const lastEntry = new Date(lastEntryDate);
  lastEntry.setHours(0, 0, 0, 0);

  // Calculate difference in days
  const diffMs = today.getTime() - lastEntry.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Entry made today already, keep current streak
    return currentStreak;
  } else if (diffDays === 1) {
    // Consecutive day! Increment streak
    return currentStreak + 1;
  } else {
    // More than 1 day gap, reset streak
    return 1;
  }
}

/**
 * GET /api/journals
 * List all journal entries for the authenticated user
 */
router.get("/", standardRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const entriesRef = db.collection("users").doc(uid).collection("journalEntries");
    const snapshot = await entriesRef.orderBy("createdAt", "desc").get();

    const entries = snapshot.docs.map((doc) => serializeJournalEntry(doc.id, doc.data()));
    res.json(entries);
  } catch (error: any) {
    console.error("Error listing journal entries:", error);
    res.status(500).json({ error: "Failed to list journal entries", details: error.message });
  }
});

/**
 * POST /api/journals
 * Create a new journal entry and award XP
 */
router.post("/", standardRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const {
      type = "free-writing",
      content = "",
      mood = "",
      isFavorite = false,
      tags = [],
      linkedEntryIds = [],
      timeSpentWriting = 0,
    } = req.body;

    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "content is required" });
      return;
    }

    const wordCount = getWordCount(content);
    const now = Timestamp.now();

    const userRef = db.collection("users").doc(uid);
    const entryRef = userRef.collection("journalEntries").doc();

    // Variable to store newly unlocked achievements
    let newlyUnlockedAchievements: any[] = [];

    // Use transaction to ensure atomic updates
    await db.runTransaction(async (tx) => {
      // Read current user data to calculate streak and XP
      const userDoc = await tx.get(userRef);
      const userData = userDoc.data() || {};

      const currentStreak = userData.streak || 0;
      const lastJournalEntryDate = userData.lastJournalEntryDate?.toDate() || null;
      const currentTotalXP = userData.totalXP || 0;

      // Get current journal stats
      const currentJournalStats = userData.journalStats || {};
      const currentTotalWordCount = currentJournalStats.totalWordCount || 0;
      const currentTotalEntries = currentJournalStats.totalJournalEntries || 0;

      // Calculate new totals
      const newTotalWordCount = currentTotalWordCount + wordCount;
      const newTotalEntries = currentTotalEntries + 1;
      const newAverageEntryLength = Math.round(newTotalWordCount / newTotalEntries);

      // Calculate new streak based on last entry date
      const newStreak = calculateStreak(lastJournalEntryDate, currentStreak);

      // Update best streak if current streak is higher
      const currentBestStreak = userData.bestStreak || 0;
      const newBestStreak = Math.max(currentBestStreak, newStreak);

      // Calculate XP and level updates (30 XP per journal entry)
      const xpUpdate = calculateXPUpdate(currentTotalXP, 30);

      // Check for newly unlocked achievements with updated stats
      const statsForAchievements = extractStatsFromUserData({
        ...userData,
        journalStats: {
          ...currentJournalStats,
          totalJournalEntries: newTotalEntries,
        },
        streak: newStreak,
        totalXP: xpUpdate.totalXP,
      });

      const achievementCheck = checkAchievements(statsForAchievements);
      newlyUnlockedAchievements = achievementCheck.newlyUnlocked;
      const achievementUpdate = generateAchievementUpdate(achievementCheck.newlyUnlocked);

      // Create the journal entry
      tx.set(entryRef, {
        type,
        content,
        mood,
        isFavorite,
        wordCount,
        tags,
        linkedEntryIds,
        timeSpentWriting,
        createdAt: now,
        date: now, // For backward compatibility
        userId: uid, // Add userId for queries
        isPrivate: false, // Default to not private
        includedInLastSummary: false, // Not yet summarized
      });

      // Update user stats - award 30 XP, update counters, streak, level, rank, and achievements
      const { spendableXPAmount, ...xpUpdateFields } = xpUpdate;

      tx.set(
        userRef,
        {
          ...xpUpdateFields,
          ...achievementUpdate,
          spendableXP: FieldValue.increment(spendableXPAmount),
          journalStats: {
            journalCount: FieldValue.increment(1),
            totalJournalEntries: FieldValue.increment(1),
            totalWordCount: FieldValue.increment(wordCount),
            totalXPfromJournals: FieldValue.increment(30),
            averageEntryLength: newAverageEntryLength,
          },
          streak: newStreak,
          bestStreak: newBestStreak,
          lastJournalEntryDate: now,
        },
        { merge: true }
      );
    });

    const created = await entryRef.get();
    const response: any = {
      entry: serializeJournalEntry(entryRef.id, created.data()!),
    };

    // Include newly unlocked achievements in response
    if (newlyUnlockedAchievements.length > 0) {
      response.achievementsUnlocked = newlyUnlockedAchievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        points: a.points,
        category: a.category,
      }));
    }

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error creating journal entry:", error);
    res.status(500).json({ error: "Failed to create journal entry", details: error.message });
  }
});

/**
 * PATCH /api/journals/:id
 * Update a journal entry (favorite status, tags, linked entries)
 */
router.patch("/:id", standardRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;
    const { isFavorite, tags, linkedEntryIds } = req.body;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Journal entry id is required" });
      return;
    }

    const entryRef = db
      .collection("users")
      .doc(uid)
      .collection("journalEntries")
      .doc(id);

    const updateData: any = {};

    if (typeof isFavorite === "boolean") {
      updateData.isFavorite = isFavorite;
    }

    if (Array.isArray(tags)) {
      updateData.tags = tags;
    }

    if (Array.isArray(linkedEntryIds)) {
      updateData.linkedEntryIds = linkedEntryIds;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    await entryRef.update(updateData);

    const updated = await entryRef.get();
    if (!updated.exists) {
      res.status(404).json({ error: "Journal entry not found" });
      return;
    }

    res.json(serializeJournalEntry(id, updated.data()!));
  } catch (error: any) {
    console.error("Error updating journal entry:", error);
    if (error.code === 5) {
      // NOT_FOUND error code
      res.status(404).json({ error: "Journal entry not found" });
    } else {
      res.status(500).json({ error: "Failed to update journal entry", details: error.message });
    }
  }
});

/**
 * DELETE /api/journals/:id
 * Delete a journal entry
 */
router.delete("/:id", strictRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Journal entry id is required" });
      return;
    }

    const userRef = db.collection("users").doc(uid);
    const entryRef = userRef.collection("journalEntries").doc(id);

    await db.runTransaction(async (tx) => {
      const entrySnap = await tx.get(entryRef);
      if (!entrySnap.exists) {
        throw new Error("Journal entry not found");
      }

      const entryData = entrySnap.data()!;
      const wordCount = entryData.wordCount || 0;

      // Read user data to recalculate average
      const userSnap = await tx.get(userRef);
      const userData = userSnap.data() || {};
      const currentJournalStats = userData.journalStats || {};
      const currentTotalWordCount = currentJournalStats.totalWordCount || 0;
      const currentTotalEntries = currentJournalStats.totalJournalEntries || 0;

      // Calculate new totals after deletion
      const newTotalWordCount = Math.max(0, currentTotalWordCount - wordCount);
      const newTotalEntries = Math.max(0, currentTotalEntries - 1);
      const newAverageEntryLength = newTotalEntries > 0
        ? Math.round(newTotalWordCount / newTotalEntries)
        : 0;

      // Delete the entry
      tx.delete(entryRef);

      // Update user stats - decrement counters, remove word count, and update average
      tx.set(
        userRef,
        {
          journalStats: {
            journalCount: FieldValue.increment(-1),
            totalWordCount: FieldValue.increment(-wordCount),
            averageEntryLength: newAverageEntryLength,
          },
        },
        { merge: true }
      );
    });

    res.status(204).send();
  } catch (error: any) {
    console.error("Error deleting journal entry:", error);
    if (error.message === "Journal entry not found") {
      res.status(404).json({ error: "Journal entry not found" });
    } else {
      res.status(500).json({ error: "Failed to delete journal entry", details: error.message });
    }
  }
});

/**
 * DELETE /api/journals/all
 * Delete all journal entries for the authenticated user
 */
router.delete("/all", strictRateLimit, requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;

    const userRef = db.collection("users").doc(uid);
    const entriesRef = userRef.collection("journalEntries");

    // Get all journal entries
    const snapshot = await entriesRef.get();
    const totalEntries = snapshot.size;

    if (totalEntries === 0) {
      res.json({
        success: true,
        message: "No journal entries to delete",
        deleted: 0,
      });
      return;
    }

    // Delete all entries in batches (Firestore batch limit is 500)
    const batchSize = 500;
    let deletedCount = 0;

    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = snapshot.docs.slice(i, i + batchSize);

      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      deletedCount += batchDocs.length;
    }

    // Reset journal stats to zero
    await userRef.set(
      {
        journalStats: {
          journalCount: 0,
          totalJournalEntries: 0,
          totalWordCount: 0,
          averageEntryLength: 0,
          mostUsedWords: [],
          totalXPfromJournals: 0,
        },
        // Note: We keep XP, level, rank - only resetting the journal stats counters
      },
      { merge: true }
    );

    res.json({
      success: true,
      message: `Successfully deleted all ${deletedCount} journal entries`,
      deleted: deletedCount,
    });
  } catch (error: any) {
    console.error("Error deleting all journal entries:", error);
    res.status(500).json({
      error: "Failed to delete all journal entries",
      details: error.message,
    });
  }
});

/**
 * POST /api/journals/self-reflection/generate
 * Generate self-reflection based on recent journal entries
 */
router.post(
  "/self-reflection/generate",
  strictRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const uid = (req as any).user.uid as string;
      const userRef = db.collection("users").doc(uid);

      // Use transaction for atomic counter updates and consistency
      const result = await db.runTransaction(async (tx) => {
        // 1. Read user document
        const userDoc = await tx.get(userRef);
        const userData = userDoc.data();

        if (!userData) {
          throw new Error("User not found");
        }

        // 2. Check AI consent
        const aiConsent = userData.aiDataConsent;
        if (!aiConsent || !aiConsent.journalAnalysisEnabled) {
          const error: any = new Error("Journal analysis not enabled");
          error.code = "AI_CONSENT_REQUIRED";
          error.status = 403;
          throw error;
        }

        // Check analysis mode preference (default to metadata-only for safety)
        const useFullContent = aiConsent.allowFullContentAnalysis === true;

        // 3. Check/reset daily limit
        const now = new Date();
        const stats = userData.selfReflectionStats || {
          generationCount: 0,
          dailyGenerationCount: 0,
          dailyResetAt: new Date(now.setHours(24, 0, 0, 0)).toISOString(),
          totalReflectionsGenerated: 0,
        };

        // Reset if past midnight
        if (new Date(stats.dailyResetAt) <= now) {
          stats.dailyGenerationCount = 0;
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          stats.dailyResetAt = tomorrow.toISOString();
        }

        // Check daily limit (30 for testing, change back to 3 for production)
        if (stats.dailyGenerationCount >= 30) {
          const error: any = new Error("Daily generation limit reached");
          error.code = "DAILY_LIMIT_REACHED";
          error.status = 429;
          error.nextResetAt = stats.dailyResetAt;
          throw error;
        }

        // 4. Fetch last 15 journal entries
        const entriesRef = userRef.collection("journalEntries");
        const entriesSnapshot = await entriesRef
          .orderBy("createdAt", "desc")
          .limit(15)
          .get();

        // 5. Validate minimum 15 entries
        if (entriesSnapshot.size < 15) {
          const error: any = new Error("Insufficient journal entries");
          error.code = "INSUFFICIENT_ENTRIES";
          error.status = 400;
          error.requiredEntries = 15;
          error.currentEntries = entriesSnapshot.size;
          throw error;
        }

        // 6. Extract data (content if user consented, otherwise metadata only)
        const entries = entriesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const baseEntry = {
            id: doc.id,
            mood: data.mood || "neutral",
            wordCount: data.wordCount || 0,
            date: tsToISO(data.createdAt) || tsToISO(data.date) || "",
            type: data.type || "free-writing",
          };

          // Include content only if user explicitly consented
          if (useFullContent) {
            return {
              ...baseEntry,
              content: data.content || "",
            };
          }

          return baseEntry;
        });

        // Calculate mood distribution
        const moodCounts: Record<string, number> = {};
        entries.forEach((entry) => {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });
        const dominantMoods = Object.entries(moodCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([mood, count]) => `${mood} (${count})`)
          .join(", ");

        // Calculate average word count
        const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);
        const avgWordCount = Math.round(totalWords / entries.length);

        // Date range
        const oldestEntry = entries[entries.length - 1];
        const newestEntry = entries[0];
        const dateRange = `${oldestEntry.date.split("T")[0]} to ${newestEntry.date.split("T")[0]}`;

        // Return entries and metadata for OpenAI call (done outside transaction)
        return {
          entries,
          dominantMoods,
          avgWordCount,
          dateRange,
          oldestEntry,
          newestEntry,
          stats,
          useFullContent,
        };
      });

      // 7. Call OpenAI (outside transaction to avoid holding lock)
      const openai = getOpenAI();
      if (!openai) {
        throw new Error("OpenAI not configured");
      }

      const systemPrompt = `You are an empathetic mental health insights analyst.
Analyze journal entry patterns to provide supportive, growth-oriented insights.

Your role is to:
- Identify emotional patterns WITHOUT judgment
- Highlight growth indicators and positive developments
- Notice recurring themes worth exploring
- Recognize strengths and resilience factors

Guidelines:
- Be warm, specific, and encouraging
- Avoid clinical language or diagnoses
- Focus on patterns and themes
- Maintain user privacy and confidence
- Emphasize growth and understanding
- Write in second person ("you've shown", "your patterns suggest")`;

      // Build user prompt based on analysis mode
      let userPrompt = `Analyze these ${result.entries.length} journal entries:

`;

      if (result.useFullContent) {
        // Full content analysis - include actual journal content
        userPrompt += `Journal Entries:\n`;
        userPrompt += result.entries.map((e: any, i: number) => {
          return `${i + 1}. ${e.date.split("T")[0]} - Mood: ${e.mood}, Type: ${e.type}
Content: "${e.content}"
`;
        }).join("\n");
      } else {
        // Metadata only analysis
        userPrompt += `Entry Metadata:
${result.entries.map((e: any, i: number) => `${i + 1}. ${e.date} - Mood: ${e.mood}, ${e.wordCount} words, Type: ${e.type}`).join("\n")}
`;
      }

      userPrompt += `
Summary Statistics:
- Dominant Moods: ${result.dominantMoods}
- Average Entry Length: ${result.avgWordCount} words
- Date Range: ${result.dateRange}

Provide a structured reflection with exactly these four sections:

1. EMOTIONAL_PATTERNS (2-3 sentences):
Identify emotional trends and mood patterns across the entries.

2. GROWTH_TRAJECTORY (2-3 sentences):
Highlight positive developments, progress, and areas of growth.

3. RECURRING_THEMES (2-3 sentences):
Notice themes, topics, or situations that appear repeatedly.

4. IDENTIFIED_STRENGTHS (2-3 sentences):
Recognize resilience factors, coping strategies, and personal strengths.

Format your response as:
EMOTIONAL_PATTERNS: [your response]
GROWTH_TRAJECTORY: [your response]
RECURRING_THEMES: [your response]
IDENTIFIED_STRENGTHS: [your response]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      const aiResponse = completion.choices[0].message.content || "";

      // Parse the structured response
      const parseSection = (text: string, sectionName: string): string => {
        const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, "s");
        const match = text.match(regex);
        return match ? match[1].trim() : "";
      };

      const reflection = {
        emotionalPatterns: parseSection(aiResponse, "EMOTIONAL_PATTERNS"),
        growthTrajectory: parseSection(aiResponse, "GROWTH_TRAJECTORY"),
        recurringThemes: parseSection(aiResponse, "RECURRING_THEMES"),
        identifiedStrengths: parseSection(aiResponse, "IDENTIFIED_STRENGTHS"),
      };

      // Generate summary (first 2 sentences of emotional patterns)
      const summary = reflection.emotionalPatterns.split(". ").slice(0, 2).join(". ") + ".";

      // 8. Store result in summaries collection and update user stats
      await db.runTransaction(async (tx) => {
        const userDoc = await tx.get(userRef);
        const userData = userDoc.data() || {};
        const stats = userData.selfReflectionStats || {
          generationCount: 0,
          dailyGenerationCount: 0,
          dailyResetAt: new Date(Date.now() + 86400000).toISOString(),
          totalReflectionsGenerated: 0,
        };

        // Increment counters
        stats.dailyGenerationCount += 1;
        stats.generationCount = (stats.generationCount || 0) + 1;
        stats.totalReflectionsGenerated = (stats.totalReflectionsGenerated || 0) + 1;
        stats.lastGeneratedAt = new Date().toISOString();

        // Calculate metadata
        const generationNumber = stats.dailyGenerationCount;
        const remainingToday = 30 - stats.dailyGenerationCount;
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const expiresAt = endOfDay.toISOString();
        const analysisMode = result.useFullContent ? 'full-content' : 'metadata';

        // Store in summaries collection
        const summaryRef = userRef.collection("summaries").doc("self_reflection_latest");
        tx.set(summaryRef, {
          userId: uid,
          type: "self_reflection_summary",
          summary,
          reflection,
          basedOn: {
            entriesAnalyzed: result.entries.length,
            oldestEntryDate: result.oldestEntry.date,
            newestEntryDate: result.newestEntry.date,
            journalIds: result.entries.map((e) => e.id),
          },
          metadata: {
            generationNumber,
            remainingToday,
            expiresAt,
            analysisMode,
          },
          generatedAt: new Date().toISOString(),
          tokenCount: completion.usage?.total_tokens || 0,
        });

        // Update user stats
        tx.set(userRef, { selfReflectionStats: stats }, { merge: true });
      });

      // 9. Return reflection data
      const generationNumber = result.stats.dailyGenerationCount + 1;
      const remainingToday = 30 - generationNumber;
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const analysisMode = result.useFullContent ? 'full-content' : 'metadata';

      res.json({
        reflection,
        summary,
        metadata: {
          entriesAnalyzed: result.entries.length,
          generationNumber,
          remainingToday,
          expiresAt: endOfDay.toISOString(),
          analysisMode,
        },
      });
    } catch (error: any) {
      console.error("Error generating self-reflection:", error);

      // Handle specific error codes
      if (error.code === "AI_CONSENT_REQUIRED") {
        res.status(403).json({
          error: error.message,
          code: error.code,
        });
      } else if (error.code === "DAILY_LIMIT_REACHED") {
        res.status(429).json({
          error: error.message,
          code: error.code,
          nextResetAt: error.nextResetAt,
        });
      } else if (error.code === "INSUFFICIENT_ENTRIES") {
        res.status(400).json({
          error: error.message,
          code: error.code,
          requiredEntries: error.requiredEntries,
          currentEntries: error.currentEntries,
        });
      } else {
        res.status(500).json({
          error: "Failed to generate self-reflection",
          details: error.message,
        });
      }
    }
  }
);

export default router;
