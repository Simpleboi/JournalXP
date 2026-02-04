import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";
import { calculateXPUpdateWithBonus } from "../lib/xpSystem";
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
function serializeJournalEntry(
  id: string,
  data: FirebaseFirestore.DocumentData,
) {
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
    templateId: data.templateId || null,
    structuredData: data.structuredData || null,
  };
}

/**
 * Calculate word count from journal content
 */
function getWordCount(content: string): number {
  if (!content || typeof content !== "string") return 0;
  return content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Common stop words to filter out from word frequency tracking
 */
const STOP_WORDS = new Set([
  // Articles
  "a",
  "an",
  "the",
  // Pronouns
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  // Verbs (common)
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "would",
  "should",
  "could",
  "ought",
  "will",
  "shall",
  "can",
  "may",
  "might",
  "must",
  // Prepositions
  "at",
  "by",
  "for",
  "from",
  "in",
  "into",
  "of",
  "on",
  "to",
  "with",
  "about",
  "against",
  "between",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "up",
  "down",
  "out",
  "off",
  "over",
  "under",
  "again",
  // Conjunctions
  "and",
  "but",
  "or",
  "nor",
  "so",
  "yet",
  "both",
  "either",
  "neither",
  "not",
  "only",
  "than",
  "when",
  "while",
  "if",
  "because",
  "as",
  "until",
  // Other common words
  "just",
  "also",
  "very",
  "really",
  "even",
  "still",
  "already",
  "always",
  "never",
  "ever",
  "now",
  "then",
  "here",
  "there",
  "where",
  "how",
  "all",
  "each",
  "every",
  "any",
  "some",
  "no",
  "most",
  "other",
  "such",
  "own",
  "same",
  "too",
  "more",
  "less",
  "much",
  "many",
  "few",
  "little",
  "lot",
  "like",
  "get",
  "got",
  "getting",
  "make",
  "made",
  "making",
  "go",
  "going",
  "went",
  "gone",
  "come",
  "came",
  "coming",
  "take",
  "took",
  "taking",
  "see",
  "saw",
  "seeing",
  "know",
  "knew",
  "knowing",
  "think",
  "thought",
  "thinking",
  "want",
  "wanted",
  "wanting",
  "feel",
  "felt",
  "feeling",
  "say",
  "said",
  "saying",
  "tell",
  "told",
  "telling",
  "ask",
  "asked",
  "asking",
  "use",
  "used",
  "using",
  "find",
  "found",
  "finding",
  "give",
  "gave",
  "giving",
  "try",
  "tried",
  "trying",
  "call",
  "called",
  "calling",
  "keep",
  "kept",
  "keeping",
  "let",
  "become",
  "became",
  "becoming",
  "seem",
  "seemed",
  "seeming",
  "leave",
  "left",
  "leaving",
  "put",
  "show",
  "showed",
  "showing",
  "begin",
  "began",
  "beginning",
  "start",
  "started",
  "starting",
  // Time words
  "today",
  "yesterday",
  "tomorrow",
  "day",
  "week",
  "month",
  "year",
  "time",
  "morning",
  "afternoon",
  "evening",
  "night",
  // Misc
  "thing",
  "things",
  "something",
  "anything",
  "nothing",
  "everything",
  "someone",
  "anyone",
  "everyone",
  "nobody",
  "people",
  "person",
  "way",
  "well",
  "back",
  "first",
  "last",
  "long",
  "new",
  "old",
  "good",
  "bad",
  "right",
  "wrong",
  "best",
  "worst",
  "better",
  "worse",
  "big",
  "small",
  "able",
  "dont",
  "didnt",
  "wont",
  "cant",
  "im",
  "ive",
  "youre",
  "youve",
  "hes",
  "shes",
  "its",
  "were",
  "theyre",
  "theyve",
  "isnt",
  "arent",
  "wasnt",
  "werent",
  "hasnt",
  "havent",
  "hadnt",
  "doesnt",
  "didnt",
  "wont",
  "wouldnt",
  "shouldnt",
  "couldnt",
  "mustnt",
  "lets",
  "thats",
  "whos",
  "whats",
  "heres",
  "theres",
  "wheres",
  "whens",
  "whys",
  "hows",
  "alls",
  "eachs",
]);

/**
 * Extract meaningful words from content (filters stop words, short words, numbers)
 * Returns a map of word -> count
 */
function extractMeaningfulWords(content: string): Record<string, number> {
  if (!content || typeof content !== "string") return {};

  const wordCounts: Record<string, number> = {};

  // Normalize: lowercase, remove punctuation except apostrophes within words
  const words = content
    .toLowerCase()
    .replace(/[^\w\s']/g, " ") // Replace punctuation with spaces
    .split(/\s+/)
    .filter((word) => {
      // Remove leading/trailing apostrophes
      word = word.replace(/^'+|'+$/g, "");
      return (
        word.length >= 3 && // At least 3 characters
        !STOP_WORDS.has(word) && // Not a stop word
        !/^\d+$/.test(word) // Not a number
      );
    });

  for (const word of words) {
    const cleanWord = word.replace(/^'+|'+$/g, "");
    if (cleanWord.length >= 3) {
      wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
    }
  }

  return wordCounts;
}

/**
 * Calculate the top N most used words from a frequency map
 */
function getTopWords(
  wordFrequency: Record<string, number>,
  limit: number = 10,
): string[] {
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * Merge word counts into existing frequency map
 */
function mergeWordCounts(
  existing: Record<string, number>,
  newCounts: Record<string, number>,
  operation: "add" | "subtract" = "add",
): Record<string, number> {
  const result = { ...existing };
  const multiplier = operation === "add" ? 1 : -1;

  for (const [word, count] of Object.entries(newCounts)) {
    result[word] = (result[word] || 0) + count * multiplier;
    // Remove words with zero or negative count
    if (result[word] <= 0) {
      delete result[word];
    }
  }

  return result;
}

/**
 * Map journal entry type to typeBreakdown key
 */
function getTypeBreakdownKey(type: string): "freeWriting" | "guided" | "gratitude" {
  switch (type) {
    case "guided":
      return "guided";
    case "gratitude":
      return "gratitude";
    case "free-writing":
    default:
      return "freeWriting";
  }
}

/**
 * Calculate the new streak value based on the last journal entry date
 * Rules:
 * - If no previous entry, start streak at 1
 * - If last entry was yesterday (consecutive day), increment streak
 * - If last entry was today, keep current streak
 * - If last entry was more than 1 day ago, reset streak to 1
 */
function calculateStreak(
  lastEntryDate: Date | null,
  currentStreak: number,
): number {
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
router.get(
  "/",
  standardRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const uid = (req as any).user.uid as string;
      const entriesRef = db
        .collection("users")
        .doc(uid)
        .collection("journalEntries");
      const snapshot = await entriesRef.orderBy("createdAt", "desc").get();

      const entries = snapshot.docs.map((doc) =>
        serializeJournalEntry(doc.id, doc.data()),
      );
      res.json(entries);
    } catch (error: any) {
      console.error("Error listing journal entries:", error);
      res
        .status(500)
        .json({
          error: "Failed to list journal entries",
          details: error.message,
        });
    }
  },
);

/**
 * POST /api/journals
 * Create a new journal entry and award XP
 */
router.post(
  "/",
  standardRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
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
        templateId = null,
        structuredData = null,
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
        const lastJournalEntryDate =
          userData.lastJournalEntryDate?.toDate() || null;
        const currentTotalXP = userData.totalXP || 0;

        // Get current journal stats
        const currentJournalStats = userData.journalStats || {};
        const currentTotalWordCount = currentJournalStats.totalWordCount || 0;
        const currentTotalEntries =
          currentJournalStats.totalJournalEntries || 0;
        const currentWordFrequency = currentJournalStats.wordFrequency || {};

        // Calculate new totals
        const newTotalWordCount = currentTotalWordCount + wordCount;
        const newTotalEntries = currentTotalEntries + 1;
        const newAverageEntryLength = Math.round(
          newTotalWordCount / newTotalEntries,
        );

        // Extract and merge word frequencies
        const entryWordCounts = extractMeaningfulWords(content);
        const newWordFrequency = mergeWordCounts(currentWordFrequency, entryWordCounts, "add");
        const newMostUsedWords = getTopWords(newWordFrequency, 10);

        // Update type breakdown (current entries count)
        const currentTypeBreakdown = currentJournalStats.typeBreakdown || {
          freeWriting: 0,
          guided: 0,
          gratitude: 0,
        };
        const typeKey = getTypeBreakdownKey(type);
        const newTypeBreakdown = {
          ...currentTypeBreakdown,
          [typeKey]: (currentTypeBreakdown[typeKey] || 0) + 1,
        };

        // Update lifetime type breakdown (never decrements)
        const currentLifetimeTypeBreakdown = currentJournalStats.lifetimeTypeBreakdown || {
          freeWriting: 0,
          guided: 0,
          gratitude: 0,
        };
        const newLifetimeTypeBreakdown = {
          ...currentLifetimeTypeBreakdown,
          [typeKey]: (currentLifetimeTypeBreakdown[typeKey] || 0) + 1,
        };

        // Update longest entry if this entry is longer
        const currentLongestEntry = currentJournalStats.longestEntry || 0;
        const newLongestEntry = Math.max(currentLongestEntry, wordCount);

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
        const achievementUpdate = generateAchievementUpdate(
          achievementCheck.newlyUnlocked,
        );

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
          templateId,
          structuredData,
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
              totalWordsWritten: FieldValue.increment(wordCount),
              totalXPfromJournals: FieldValue.increment(30),
              averageEntryLength: newAverageEntryLength,
              wordFrequency: newWordFrequency,
              mostUsedWords: newMostUsedWords,
              typeBreakdown: newTypeBreakdown,
              lifetimeTypeBreakdown: newLifetimeTypeBreakdown,
              longestEntry: newLongestEntry,
            },
            streak: newStreak,
            bestStreak: newBestStreak,
            lastJournalEntryDate: now,
          },
          { merge: true },
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
      res
        .status(500)
        .json({
          error: "Failed to create journal entry",
          details: error.message,
        });
    }
  },
);

/**
 * PATCH /api/journals/:id
 * Update a journal entry (favorite status, tags, linked entries)
 */
router.patch(
  "/:id",
  standardRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
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
        res
          .status(500)
          .json({
            error: "Failed to update journal entry",
            details: error.message,
          });
      }
    }
  },
);

/**
 * DELETE /api/journals/:id
 * Delete a journal entry
 */
router.delete(
  "/:id",
  strictRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
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
        const entryContent = entryData.content || "";
        const entryType = entryData.type || "free-writing";

        // Read user data to recalculate average
        const userSnap = await tx.get(userRef);
        const userData = userSnap.data() || {};
        const currentJournalStats = userData.journalStats || {};
        const currentTotalWordCount = currentJournalStats.totalWordCount || 0;
        const currentTotalEntries =
          currentJournalStats.totalJournalEntries || 0;
        const currentWordFrequency = currentJournalStats.wordFrequency || {};

        // Calculate new totals after deletion
        const newTotalWordCount = Math.max(
          0,
          currentTotalWordCount - wordCount,
        );
        const newTotalEntries = Math.max(0, currentTotalEntries - 1);
        const newAverageEntryLength =
          newTotalEntries > 0
            ? Math.round(newTotalWordCount / newTotalEntries)
            : 0;

        // Update word frequencies by subtracting deleted entry's words
        const entryWordCounts = extractMeaningfulWords(entryContent);
        const newWordFrequency = mergeWordCounts(currentWordFrequency, entryWordCounts, "subtract");
        const newMostUsedWords = getTopWords(newWordFrequency, 10);

        // Update type breakdown by decrementing the deleted entry's type
        const currentTypeBreakdown = currentJournalStats.typeBreakdown || {
          freeWriting: 0,
          guided: 0,
          gratitude: 0,
        };
        const typeKey = getTypeBreakdownKey(entryType);
        const newTypeBreakdown = {
          ...currentTypeBreakdown,
          [typeKey]: Math.max(0, (currentTypeBreakdown[typeKey] || 0) - 1),
        };

        // Recalculate longest entry if we're deleting the longest one
        const currentLongestEntry = currentJournalStats.longestEntry || 0;
        let newLongestEntry = currentLongestEntry;
        if (wordCount >= currentLongestEntry) {
          // Need to find the new longest entry from remaining entries
          const remainingEntriesSnap = await tx.get(
            userRef.collection("journalEntries")
              .orderBy("wordCount", "desc")
              .limit(2) // Get top 2 in case the first one is the entry being deleted
          );
          newLongestEntry = 0;
          remainingEntriesSnap.docs.forEach((doc) => {
            if (doc.id !== id) {
              const docWordCount = doc.data().wordCount || 0;
              if (docWordCount > newLongestEntry) {
                newLongestEntry = docWordCount;
              }
            }
          });
        }

        // Delete the entry
        tx.delete(entryRef);

        // Update user stats - decrement counters, remove word count, update average, and word frequencies
        tx.set(
          userRef,
          {
            journalStats: {
              journalCount: FieldValue.increment(-1),
              totalWordCount: FieldValue.increment(-wordCount),
              averageEntryLength: newAverageEntryLength,
              wordFrequency: newWordFrequency,
              mostUsedWords: newMostUsedWords,
              typeBreakdown: newTypeBreakdown,
              longestEntry: newLongestEntry,
            },
          },
          { merge: true },
        );
      });

      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting journal entry:", error);
      if (error.message === "Journal entry not found") {
        res.status(404).json({ error: "Journal entry not found" });
      } else {
        res
          .status(500)
          .json({
            error: "Failed to delete journal entry",
            details: error.message,
          });
      }
    }
  },
);

/**
 * DELETE /api/journals/all
 * Delete all journal entries for the authenticated user
 */
router.delete(
  "/all",
  strictRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
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
            wordFrequency: {},
            typeBreakdown: {
              freeWriting: 0,
              guided: 0,
              gratitude: 0,
            },
            longestEntry: 0,
          },
          // Note: We keep XP, level, rank - only resetting the journal stats counters
        },
        { merge: true },
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
  },
);

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
- Identify mood triggers and coping strategies
- Provide actionable suggestions and thought-provoking questions
- Gently highlight potential blind spots

Guidelines:
- Be warm, specific, and encouraging
- Avoid clinical language or diagnoses
- Focus on patterns and themes
- Maintain user privacy and confidence
- Emphasize growth and understanding
- Write in second person ("you've shown", "your patterns suggest")
- Never use em dashes (—) or en dashes (–) in your responses. Use commas, periods, or other punctuation instead.
- For actionable suggestions, be specific and practical
- For blind spots, be gentle and frame as opportunities for exploration`;

      // Build user prompt based on analysis mode
      let userPrompt = `Analyze these ${result.entries.length} journal entries:

`;

      if (result.useFullContent) {
        // Full content analysis - include actual journal content
        userPrompt += `Journal Entries:\n`;
        userPrompt += result.entries
          .map((e: any, i: number) => {
            return `${i + 1}. ${e.date.split("T")[0]} - Mood: ${e.mood}, Type: ${e.type}
Content: "${e.content}"
`;
          })
          .join("\n");
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

Provide a structured reflection with exactly these ten sections. Each section should be 2-3 paragraphs long, with each paragraph being 2-3 sentences. Be thorough but concise.

1. EMOTIONAL_PATTERNS (2-3 paragraphs):
Identify emotional trends and mood patterns across the entries. Explore the nuances of how emotions shift over time and how the user processes different emotional states.

2. GROWTH_TRAJECTORY (2-3 paragraphs):
Highlight positive developments, progress, and areas of growth. Discuss specific examples of how the user has evolved and challenges they've overcome.

3. RECURRING_THEMES (2-3 paragraphs):
Notice themes, topics, or situations that appear repeatedly. Analyze what these patterns might mean and what insights can be drawn from their persistence.

4. IDENTIFIED_STRENGTHS (2-3 paragraphs):
Recognize resilience factors, coping strategies, and personal strengths. Elaborate on specific strengths demonstrated and how the user can leverage these qualities.

5. ACTIONABLE_SUGGESTIONS (2-3 specific suggestions):
Provide 2-3 specific, practical things the user could try based on their patterns. Be concrete and actionable. Format as a numbered list with brief explanations.

6. MOOD_TRIGGERS (2-3 paragraphs):
Identify what situations, topics, or circumstances seem to correlate with mood shifts, both positive and negative. Help the user understand what affects their emotional state.

7. JOURNALING_PROMPTS (3-4 prompts):
Provide 3-4 personalized journaling prompts based on themes they haven't explored deeply or areas that could benefit from more reflection. Format as a numbered list.

8. QUESTIONS_FOR_REFLECTION (3-4 questions):
Offer 3-4 thought-provoking questions to help the user dig deeper into their patterns and experiences. These should encourage self-discovery. Format as a numbered list.

9. COPING_STRATEGIES_WORKING (2-3 paragraphs):
Identify what behaviors, activities, or approaches seem to help when the user is struggling. Highlight patterns of resilience and effective self-care.

10. BLIND_SPOTS (2-3 paragraphs):
Gently highlight areas the user might be avoiding or not fully exploring. Frame these as opportunities for growth rather than criticisms. Be compassionate but honest.

Format your response as:
EMOTIONAL_PATTERNS: [your response]
GROWTH_TRAJECTORY: [your response]
RECURRING_THEMES: [your response]
IDENTIFIED_STRENGTHS: [your response]
ACTIONABLE_SUGGESTIONS: [your response]
MOOD_TRIGGERS: [your response]
JOURNALING_PROMPTS: [your response]
QUESTIONS_FOR_REFLECTION: [your response]
COPING_STRATEGIES_WORKING: [your response]
BLIND_SPOTS: [your response]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 6000,
      });

      const aiResponse = completion.choices[0].message.content || "";

      // Parse the structured response
      const parseSection = (text: string, sectionName: string): string => {
        const regex = new RegExp(
          `${sectionName}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`,
          "s",
        );
        const match = text.match(regex);
        return match ? match[1].trim() : "";
      };

      const reflection = {
        emotionalPatterns: parseSection(aiResponse, "EMOTIONAL_PATTERNS"),
        growthTrajectory: parseSection(aiResponse, "GROWTH_TRAJECTORY"),
        recurringThemes: parseSection(aiResponse, "RECURRING_THEMES"),
        identifiedStrengths: parseSection(aiResponse, "IDENTIFIED_STRENGTHS"),
        actionableSuggestions: parseSection(
          aiResponse,
          "ACTIONABLE_SUGGESTIONS",
        ),
        moodTriggers: parseSection(aiResponse, "MOOD_TRIGGERS"),
        journalingPrompts: parseSection(aiResponse, "JOURNALING_PROMPTS"),
        questionsForReflection: parseSection(
          aiResponse,
          "QUESTIONS_FOR_REFLECTION",
        ),
        copingStrategiesWorking: parseSection(
          aiResponse,
          "COPING_STRATEGIES_WORKING",
        ),
        blindSpots: parseSection(aiResponse, "BLIND_SPOTS"),
      };

      // Generate summary (first 2 sentences of emotional patterns)
      const summary =
        reflection.emotionalPatterns.split(". ").slice(0, 2).join(". ") + ".";

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
        stats.totalReflectionsGenerated =
          (stats.totalReflectionsGenerated || 0) + 1;
        stats.lastGeneratedAt = new Date().toISOString();

        // Calculate metadata
        const generationNumber = stats.dailyGenerationCount;
        const remainingToday = 30 - stats.dailyGenerationCount;
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const expiresAt = endOfDay.toISOString();
        const analysisMode = result.useFullContent
          ? "full-content"
          : "metadata";

        // Store in summaries collection
        const summaryRef = userRef
          .collection("summaries")
          .doc("self_reflection_latest");
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
      const analysisMode = result.useFullContent ? "full-content" : "metadata";

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
  },
);

/**
 * POST /api/journals/self-reflection/dig-deeper
 * Expand on a specific section of the self-reflection with more detail
 */
router.post(
  "/self-reflection/dig-deeper",
  strictRateLimit,
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const uid = (req as any).user.uid as string;
      const { section, currentContent } = req.body;

      // Validate input
      const validSections = [
        "emotionalPatterns",
        "growthTrajectory",
        "recurringThemes",
        "identifiedStrengths",
        "actionableSuggestions",
        "moodTriggers",
        "journalingPrompts",
        "questionsForReflection",
        "copingStrategiesWorking",
        "blindSpots",
      ];

      if (!section || !validSections.includes(section)) {
        res.status(400).json({
          error: "Invalid section",
          code: "INVALID_SECTION",
          validSections,
        });
        return;
      }

      if (!currentContent || typeof currentContent !== "string") {
        res.status(400).json({
          error: "Current content is required",
          code: "MISSING_CONTENT",
        });
        return;
      }

      // Check AI consent
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (!userData?.aiDataConsent?.journalAnalysisEnabled) {
        res.status(403).json({
          error: "Journal analysis not enabled",
          code: "AI_CONSENT_REQUIRED",
        });
        return;
      }

      // Section display names for the prompt
      const sectionNames: Record<string, string> = {
        emotionalPatterns: "Emotional Patterns",
        growthTrajectory: "Growth Trajectory",
        recurringThemes: "Recurring Themes",
        identifiedStrengths: "Identified Strengths",
        actionableSuggestions: "Actionable Suggestions",
        moodTriggers: "Mood Triggers",
        journalingPrompts: "Journaling Prompts",
        questionsForReflection: "Questions for Reflection",
        copingStrategiesWorking: "Coping Strategies Working",
        blindSpots: "Blind Spots / Areas to Explore",
      };

      const openai = getOpenAI();
      if (!openai) {
        throw new Error("OpenAI not configured");
      }

      const systemPrompt = `You are an empathetic mental health insights analyst helping a user dig deeper into their self-reflection insights.

Your role is to:
- Expand on the existing insight with more depth and nuance
- Provide additional examples or perspectives
- Offer more specific guidance or questions
- Maintain a warm, supportive, and encouraging tone

Guidelines:
- Write 3-4 detailed paragraphs expanding on the topic
- Be specific and actionable where appropriate
- Avoid clinical language or diagnoses
- Write in second person ("you", "your")
- Never use em dashes (—) or en dashes (–) in your responses
- Build upon what was already said, don't just repeat it`;

      const userPrompt = `The user wants to dig deeper into their "${sectionNames[section]}" insight.

Here is what was originally provided:
---
${currentContent}
---

Please expand on this insight with additional depth, perspectives, examples, or actionable guidance. Provide 3-4 paragraphs of expanded content that builds upon the original insight.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const expandedContent = completion.choices[0].message.content || "";

      res.json({
        expandedContent,
        section,
      });
    } catch (error: any) {
      console.error("Error in dig-deeper:", error);
      res.status(500).json({
        error: "Failed to expand section",
        details: error.message,
      });
    }
  },
);

export default router;
