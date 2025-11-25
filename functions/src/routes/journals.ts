import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdate } from "../lib/xpSystem";
import {
  checkAchievements,
  generateAchievementUpdate,
  extractStatsFromUserData,
} from "../lib/achievementSystem";

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
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
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
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
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
router.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
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
router.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
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
router.delete("/all", requireAuth, async (req: Request, res: Response): Promise<void> => {
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

export default router;
