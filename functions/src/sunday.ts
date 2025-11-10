import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getOpenAI, SUNDAY_SYSTEM_PROMPT } from "./lib/openai";
import { gatherUserContext, formatContextForPrompt } from "./lib/sundayContext";
import { db } from "./lib/admin";

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
 * Handles user messages, gathers context, calls OpenAI, and persists conversations
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

    try {
      // Check conversation limit (25 conversations max for free tier)
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      const conversationCount = userData?.sundayConversationCount ?? 0;

      if (!conversationId) {
        // Only check limit when creating a NEW conversation (not continuing existing one)
        if (conversationCount >= 3) {
          throw new HttpsError(
            "resource-exhausted",
            "CONVERSATION_LIMIT_REACHED"
          );
        }
      }

      // Gather user context for personalized responses (exclude current conversation from past conversations)
      console.log(`[Sunday] Gathering context for user: ${uid}`);
      const userContext = await gatherUserContext(uid, conversationId);
      const contextPrompt = formatContextForPrompt(userContext);

      // Get or create conversation in user's subcollection
      let conversation: {
        messages?: any[];
        createdAt?: Date | any;
        updatedAt?: Date | any;
      };
      let conversationRef;

      if (conversationId) {
        // Load existing conversation from user's subcollection
        conversationRef = db
          .collection("users")
          .doc(uid)
          .collection("sunday_conversations")
          .doc(conversationId);
        const conversationDoc = await conversationRef.get();

        if (!conversationDoc.exists) {
          throw new HttpsError(
            "not-found",
            "Conversation not found"
          );
        }

        conversation = conversationDoc.data() || {
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        // Create new conversation in user's subcollection
        conversationRef = db
          .collection("users")
          .doc(uid)
          .collection("sunday_conversations")
          .doc();
        conversation = {
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Build message history for OpenAI
      const messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [
        {
          role: "system",
          content: SUNDAY_SYSTEM_PROMPT + contextPrompt,
        },
      ];

      // Add conversation history if it exists
      if (conversation.messages && Array.isArray(conversation.messages)) {
        conversation.messages.forEach((msg: any) => {
          if (msg.role === "user" || msg.role === "assistant") {
            messages.push({
              role: msg.role,
              content: msg.content,
            });
          }
        });
      }

      // Add current user message
      messages.push({
        role: "user",
        content: message,
      });

      // Call OpenAI API
      console.log(`[Sunday] Calling OpenAI for user: ${uid}`);
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
      });

      const assistantMessage = completion.choices[0]?.message?.content ||
        "I'm sorry, I'm having trouble responding right now. Could you try again?";

      // Save messages to conversation
      const timestamp = new Date();
      const newMessages = [
        ...(conversation.messages || []),
        {
          id: crypto.randomUUID(),
          role: "user",
          content: message,
          timestamp: timestamp.toISOString(),
        },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantMessage,
          timestamp: timestamp.toISOString(),
        },
      ];

      // Update conversation in Firestore (user's subcollection)
      await conversationRef.set(
        {
          messages: newMessages,
          updatedAt: timestamp,
          createdAt: conversation.createdAt || timestamp,
        },
        { merge: true }
      );

      // Increment conversation count for new conversations
      if (!conversationId) {
        await userRef.set(
          {
            sundayConversationCount: (conversationCount ?? 0) + 1,
          },
          { merge: true }
        );
      }

      console.log(`[Sunday] Successfully responded to user: ${uid}`);

      return {
        text: assistantMessage,
        conversationId: conversationRef.id,
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

      // Generic error
      throw new HttpsError(
        "internal",
        "An error occurred while chatting with Sunday. Please try again."
      );
    }
  }
);
