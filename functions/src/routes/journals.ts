import { Router, Request, Response } from "express";
import { db, FieldValue, Timestamp } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
  };
}

/**
 * Calculate word count from journal content
 */
function getWordCount(content: string): number {
  if (!content || typeof content !== "string") return 0;
  return content.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

// ============================================================================
// ROUTES
// ============================================================================

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
    } = req.body;

    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "content is required" });
      return;
    }

    const wordCount = getWordCount(content);
    const now = Timestamp.now();

    const userRef = db.collection("users").doc(uid);
    const entryRef = userRef.collection("journalEntries").doc();

    // Use transaction to ensure atomic updates
    await db.runTransaction(async (tx) => {
      // Create the journal entry
      tx.set(entryRef, {
        type,
        content,
        mood,
        isFavorite,
        wordCount,
        createdAt: now,
        date: now, // For backward compatibility
      });

      // Update user stats - award 30 XP and update counters
      tx.set(
        userRef,
        {
          points: FieldValue.increment(30),
          totalPoints: FieldValue.increment(30),
          journalCount: FieldValue.increment(1),
          totalJournalEntries: FieldValue.increment(1),
          "journalStats.totalWordCount": FieldValue.increment(wordCount),
        },
        { merge: true }
      );
    });

    const created = await entryRef.get();
    res.status(201).json(serializeJournalEntry(entryRef.id, created.data()!));
  } catch (error: any) {
    console.error("Error creating journal entry:", error);
    res.status(500).json({ error: "Failed to create journal entry", details: error.message });
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

      // Delete the entry
      tx.delete(entryRef);

      // Update user stats - decrement counters and remove word count
      tx.set(
        userRef,
        {
          journalCount: FieldValue.increment(-1),
          "journalStats.totalWordCount": FieldValue.increment(-wordCount),
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

export default router;
