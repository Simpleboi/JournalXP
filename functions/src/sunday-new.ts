/**
 * Sunday AI Chat - Refactored with Summary-Based Context
 *
 * Uses summarization architecture for extremely low token usage
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getOpenAI, SUNDAY_SYSTEM_PROMPT } from "./lib/openai";
import { db } from "./lib/admin";
import { estimateTokens, sanitizeInput } from "./lib/summaryUtils";
import { compressSundayMemory, initializeSundayMemory, compressPreviousConversations } from "./summarization/sundayMemory";
import type { SundayChatSession, SundayMessage } from "@shared/types/sunday";
import type {
  ProfileSummary,
  RecentJournalSummary,
  HabitTaskSummary,
  SundayMemorySummary,
} from "@shared/types/summaries";
import { MESSAGE_RETENTION_POLICY } from "@shared/types/sunday";

/**
 * Request type for Sunday chat
 */
interface JxpChatRequest {
  message: string;
  conversationId?: string;
}

/**
 * Response type for Sunday chat
 */
interface JxpChatResponse {
  text: string;
  conversationId: string;
  error?: string;
}

/**
 * Firebase callable function for Sunday AI therapist chat
 * REFACTORED: Uses summary-based context loading
 */
export const jxpChat = onCall<JxpChatRequest, Promise<JxpChatResponse>>(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    // Check authentication
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated to chat with Sunday"
      );
    }

    const uid = request.auth.uid;
    const { message, conversationId } = request.data;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "Message is required and must be a non-empty string"
      );
    }

    // Sanitize input to prevent prompt injection
    const sanitizedMessage = sanitizeInput(message.trim());

    try {
      // Check user permissions and conversation limits
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (!userData) {
        throw new HttpsError("not-found", "User not found");
      }

      // Check AI consent
      if (!userData.aiDataConsent?.sundayEnabled) {
        throw new HttpsError(
          "permission-denied",
          "Sunday AI is not enabled. Please enable in settings."
        );
      }

      const conversationCount = userData.sundayConversationCount ?? 0;

      if (!conversationId) {
        // Only check limit when creating a NEW conversation
        if (conversationCount >= 25) {
          throw new HttpsError(
            "resource-exhausted",
            "CONVERSATION_LIMIT_REACHED"
          );
        }
      }

      console.log(`[Sunday] Processing message for user: ${uid}`);

      // ========================================
      // GET OR CREATE CHAT SESSION
      // ========================================

      let chatRef;
      let chatData: SundayChatSession;
      let isNewChat = false;

      if (conversationId) {
        // Load existing chat
        chatRef = db.collection(`users/${uid}/sundayChats`).doc(conversationId);
        const chatDoc = await chatRef.get();

        if (!chatDoc.exists) {
          throw new HttpsError("not-found", "Conversation not found");
        }

        chatData = chatDoc.data() as SundayChatSession;
      } else {
        // Create new chat session
        isNewChat = true;
        chatRef = db.collection(`users/${uid}/sundayChats`).doc();

        chatData = {
          id: chatRef.id,
          userId: uid,
          startedAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          totalMessages: 0,
          userMessages: 0,
          assistantMessages: 0,
          messagesRetained: 0,
          summarizedMessageCount: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await chatRef.set(chatData);

        // Initialize Sunday memory if this is the first conversation
        if (conversationCount === 0) {
          await initializeSundayMemory(uid);
        } else {
          // Compress messages from previous conversations (runs in background)
          compressPreviousConversations(uid).catch(err =>
            console.error("[Sunday] Previous conversation compression failed:", err)
          );
        }
      }

      // ========================================
      // LOAD CONTEXT (SUMMARY-BASED, EFFICIENT)
      // ========================================

      console.log(`[Sunday] Loading summaries for user: ${uid}`);

      // Load all summaries in parallel
      const [
        profileSummaryDoc,
        journalSummaryDoc,
        habitTaskSummaryDoc,
        memorySummaryDoc,
        recentMessagesSnapshot,
      ] = await Promise.all([
        db.collection(`users/${uid}/summaries`).doc("profile_summary").get(),
        db.collection(`users/${uid}/summaries`).doc("recent_journal_summary").get(),
        db.collection(`users/${uid}/summaries`).doc("habit_task_summary").get(),
        db.collection(`users/${uid}/summaries`).doc("sunday_memory_summary").get(),
        db
          .collection(`users/${uid}/sundayChats/${chatRef.id}/messages`)
          .orderBy("timestamp", "desc")
          .limit(MESSAGE_RETENTION_POLICY.KEEP_RECENT)
          .get(),
      ]);

      // Extract summaries
      const profileSummary = (profileSummaryDoc.data() as ProfileSummary | undefined)?.summary ||
        "New user, no profile data yet.";

      const journalSummary = (journalSummaryDoc.data() as RecentJournalSummary | undefined)?.summary ||
        "No recent journal entries.";

      const habitTaskSummary = (habitTaskSummaryDoc.data() as HabitTaskSummary | undefined)?.summary ||
        "No habits or tasks tracked yet.";

      const memorySummary = (memorySummaryDoc.data() as SundayMemorySummary | undefined)?.summary ||
        "First conversation with this user.";

      // Extract recent message history
      const messageHistory = recentMessagesSnapshot.docs
        .reverse()
        .map(doc => {
          const data = doc.data() as SundayMessage;
          return {
            role: data.role,
            content: data.content,
          };
        });

      console.log(`[Sunday] Loaded ${messageHistory.length} recent messages`);

      // ========================================
      // BUILD PROMPT WITH SUMMARIES
      // ========================================

      const contextPrompt = `
## USER CONTEXT (Summary-Based)

**Profile:** ${profileSummary}

**Recent Journal Patterns (Past 7 Days):** ${journalSummary}

**Habits & Tasks:** ${habitTaskSummary}

**Previous Conversations & Therapeutic Memory:** ${memorySummary}

---

You are Sunday, an empathetic AI wellness companion. Use the context above to provide personalized, emotionally attuned support. Reference past patterns when relevant, but focus on the user's current message. Be warm, compassionate, and practical.
`;

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        {
          role: "system",
          content: SUNDAY_SYSTEM_PROMPT + "\n\n" + contextPrompt,
        },
        ...messageHistory,
        {
          role: "user",
          content: sanitizedMessage,
        },
      ];

      // Log token usage
      const estimatedContextTokens = estimateTokens(contextPrompt);
      const estimatedHistoryTokens = estimateTokens(messageHistory.map(m => m.content).join(" "));
      console.log(`[Sunday] Context tokens: ~${estimatedContextTokens}, History tokens: ~${estimatedHistoryTokens}`);

      // ========================================
      // CALL AI MODEL
      // ========================================

      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.8,
        max_tokens: 500,
      });

      const assistantMessage =
        completion.choices[0]?.message?.content ||
        "I'm having trouble responding right now. Could you try again?";

      console.log(`[Sunday] Generated response (${estimateTokens(assistantMessage)} tokens)`);

      // ========================================
      // SAVE MESSAGES
      // ========================================

      const timestamp = new Date().toISOString();
      const batch = db.batch();

      // User message
      const userMsgRef = db.collection(`users/${uid}/sundayChats/${chatRef.id}/messages`).doc();
      const userMessageDoc: SundayMessage = {
        id: userMsgRef.id,
        chatId: chatRef.id,
        role: "user",
        content: sanitizedMessage,
        timestamp,
        tokenCount: estimateTokens(sanitizedMessage),
        isSummarized: false,
        createdAt: timestamp,
      };
      batch.set(userMsgRef, userMessageDoc);

      // Assistant message
      const assistantMsgRef = db.collection(`users/${uid}/sundayChats/${chatRef.id}/messages`).doc();
      const assistantMessageDoc: SundayMessage = {
        id: assistantMsgRef.id,
        chatId: chatRef.id,
        role: "assistant",
        content: assistantMessage,
        timestamp,
        tokenCount: estimateTokens(assistantMessage),
        isSummarized: false,
        createdAt: timestamp,
      };
      batch.set(assistantMsgRef, assistantMessageDoc);

      // Update chat metadata
      const updatedChatData: Partial<SundayChatSession> = {
        lastMessageAt: timestamp,
        totalMessages: chatData.totalMessages + 2,
        userMessages: chatData.userMessages + 1,
        assistantMessages: chatData.assistantMessages + 1,
        messagesRetained: chatData.messagesRetained + 2,
        updatedAt: timestamp,
      };

      // Auto-generate title from first message
      if (isNewChat) {
        updatedChatData.title = sanitizedMessage.substring(0, 50) + (sanitizedMessage.length > 50 ? "..." : "");
      }

      batch.update(chatRef, updatedChatData);

      // Update user stats
      const userUpdates: any = {
        totalSundayMessages: (userData.totalSundayMessages || 0) + 1,
        lastSundayChat: timestamp,
        updatedAt: timestamp,
      };

      if (isNewChat) {
        userUpdates.sundayConversationCount = conversationCount + 1;
      }

      batch.update(userRef, userUpdates);

      await batch.commit();

      // ========================================
      // CHECK IF MEMORY COMPRESSION NEEDED
      // ========================================

      const totalMessages = chatData.totalMessages + 2;

      if (totalMessages >= MESSAGE_RETENTION_POLICY.TRIGGER_THRESHOLD) {
        console.log(`[Sunday] Triggering memory compression (${totalMessages} messages)`);
        // Run compression in background (don't await to keep response fast)
        compressSundayMemory(uid, chatRef.id).catch(err =>
          console.error("[Sunday] Memory compression failed:", err)
        );
      }

      console.log(`✅ [Sunday] Successfully responded to user: ${uid}`);

      return {
        text: assistantMessage,
        conversationId: chatRef.id,
      };
    } catch (error: any) {
      console.error("[Sunday] Error:", error);

      // Handle OpenAI specific errors
      if (error.code === "insufficient_quota") {
        throw new HttpsError(
          "resource-exhausted",
          "Sunday is temporarily unavailable. Please try again later."
        );
      }

      // Handle rate limiting
      if (error.status === 429) {
        throw new HttpsError(
          "resource-exhausted",
          "Too many requests. Please wait a moment and try again."
        );
      }

      // Re-throw HttpsErrors
      if (error instanceof HttpsError) {
        throw error;
      }

      // Generic error
      throw new HttpsError(
        "internal",
        "An error occurred while chatting with Sunday. Please try again."
      );
    }
  }
);
