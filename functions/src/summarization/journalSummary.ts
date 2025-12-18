/**
 * Cloud Function: Update Recent Journal Summary
 *
 * Triggers when new journal entries are created.
 * Generates a summary of the last 7 days of journal entries.
 */

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { db } from "../lib/admin";
import { getOpenAI } from "../lib/openai";
import { estimateTokens, extractThemes, summarizeMoods } from "../lib/summaryUtils";
import type { RecentJournalSummary } from "@shared/types/summaries";

/**
 * Configuration
 */
const CONFIG = {
  MIN_ENTRIES_FOR_SUMMARY: 3, // Trigger summary after this many unsummarized entries
  WINDOW_DAYS: 7, // Analyze last N days
  MAX_TOKENS: 300, // Max tokens for summary generation
} as const;

/**
 * Triggered when a new journal entry is created
 */
export const updateRecentJournalSummary = onDocumentCreated(
  "users/{userId}/journalEntries/{entryId}",
  async (event) => {
    const userId = event.params.userId;
    const entryId = event.params.entryId;

    console.log(`[Journal Summary] Triggered for user ${userId}, entry ${entryId}`);

    try {
      // Check if user has AI consent
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (!userData?.aiDataConsent?.journalAnalysisEnabled) {
        console.log(`[Journal Summary] User ${userId} has not enabled journal analysis`);
        return;
      }

      // Check how many unsummarized entries exist
      const unsummarizedCount = await db
        .collection(`users/${userId}/journalEntries`)
        .where("includedInLastSummary", "==", false)
        .where("isPrivate", "==", false)
        .count()
        .get();

      const count = unsummarizedCount.data().count;
      console.log(`[Journal Summary] User ${userId} has ${count} unsummarized entries`);

      if (count < CONFIG.MIN_ENTRIES_FOR_SUMMARY) {
        console.log(`[Journal Summary] Not enough entries yet (need ${CONFIG.MIN_ENTRIES_FOR_SUMMARY})`);
        return;
      }

      // Fetch last N days of entries (metadata only, NO raw content)
      const windowStart = new Date();
      windowStart.setDate(windowStart.getDate() - CONFIG.WINDOW_DAYS);

      const entriesSnapshot = await db
        .collection(`users/${userId}/journalEntries`)
        .where("createdAt", ">=", windowStart.toISOString())
        .where("isPrivate", "==", false)
        .orderBy("createdAt", "desc")
        .get();

      if (entriesSnapshot.empty) {
        console.log(`[Journal Summary] No entries in window for user ${userId}`);
        return;
      }

      // Extract ONLY metadata (no raw content)
      const metadata = entriesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          mood: data.mood,
          type: data.type,
          wordCount: data.wordCount || 0,
          tags: data.tags || [],
          timestamp: data.createdAt,
          isFavorite: data.isFavorite || false,
        };
      });

      console.log(`[Journal Summary] Analyzing ${metadata.length} entries`);

      // Calculate statistics
      const moodCounts: Record<string, number> = {};
      let totalWords = 0;

      for (const entry of metadata) {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
        totalWords += entry.wordCount;
      }

      const dominantMoods = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([mood, count]) => ({ mood, count }));

      const recurringThemes = extractThemes(metadata);
      const avgWordCount = Math.round(totalWords / metadata.length);

      // Generate AI summary
      const openai = getOpenAI();
      const prompt = `Analyze these journal entry patterns from the past ${CONFIG.WINDOW_DAYS} days:

Total entries: ${metadata.length}
Mood distribution: ${summarizeMoods(dominantMoods)}
Recurring themes/tags: ${recurringThemes.join(", ") || "none"}
Total words written: ${totalWords}
Average entry length: ${avgWordCount} words

Write a 150-200 word summary focusing on:
1. Mood trends and emotional patterns
2. Recurring themes or topics
3. Behavioral patterns (consistency, word count trends)
4. Progress indicators or positive developments
5. Potential concerns or areas needing attention

DO NOT reference specific entry content. Focus on patterns and insights.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are a mental health data analyst. Provide insightful, compassionate pattern analysis based on journal metadata. Be specific but avoid clinical diagnoses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: CONFIG.MAX_TOKENS,
      });

      const summary = completion.choices[0]?.message?.content || "Unable to generate summary.";

      console.log(`[Journal Summary] Generated summary (${estimateTokens(summary)} tokens)`);

      // Detect patterns
      const positivePatterns: string[] = [];
      const concerningPatterns: string[] = [];

      // Simple pattern detection based on moods
      const totalEntries = metadata.length;
      const positiveMoods = ["happy", "peaceful", "grateful", "hopeful", "inspired", "loved"];
      const negativeMoods = ["sad", "anxious", "angry", "frustrated", "overwhelmed", "lonely"];

      const positiveCount = dominantMoods
        .filter(m => positiveMoods.includes(m.mood.toLowerCase()))
        .reduce((sum, m) => sum + m.count, 0);

      const negativeCount = dominantMoods
        .filter(m => negativeMoods.includes(m.mood.toLowerCase()))
        .reduce((sum, m) => sum + m.count, 0);

      if (positiveCount > totalEntries * 0.5) {
        positivePatterns.push("Predominantly positive emotional state");
      }

      if (metadata.length >= 5) {
        positivePatterns.push("Consistent journaling practice");
      }

      if (negativeCount > totalEntries * 0.6) {
        concerningPatterns.push("High frequency of difficult emotions");
      }

      // Create summary document
      const summaryDoc: RecentJournalSummary = {
        type: "recent_journal_summary",
        userId,
        summary,
        windowStart: windowStart.toISOString(),
        windowEnd: new Date().toISOString(),
        entriesAnalyzed: metadata.length,
        dominantMoods,
        recurringThemes,
        positivePatterns,
        concerningPatterns,
        totalWordCount: totalWords,
        averageWordCount: avgWordCount,
        generatedAt: new Date().toISOString(),
        tokenCount: estimateTokens(summary),
      };

      // Save summary to Firestore
      await db
        .collection(`users/${userId}/summaries`)
        .doc("recent_journal_summary")
        .set(summaryDoc);

      // Mark entries as summarized
      const batch = db.batch();
      entriesSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          includedInLastSummary: true,
          lastSummarizedAt: new Date().toISOString(),
        });
      });
      await batch.commit();

      // Update user's summary status
      await userRef.set(
        {
          summaryStatus: {
            lastJournalSummaryUpdate: new Date().toISOString(),
          },
        },
        { merge: true }
      );

      console.log(`✅ [Journal Summary] Updated summary for user ${userId}`);
    } catch (error) {
      console.error(`❌ [Journal Summary] Error for user ${userId}:`, error);
      // Don't throw - we don't want to fail the journal entry creation
    }
  }
);
