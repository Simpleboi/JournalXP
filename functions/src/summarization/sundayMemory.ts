/**
 * Sunday Memory Compression
 *
 * Compresses old Sunday chat messages into memory nodes.
 * Maintains therapeutic continuity while reducing token usage.
 *
 * Messages are embedded in session documents (not subcollections).
 */

import { db } from "../lib/admin";
import { getOpenAI } from "../lib/openai";
import { estimateTokens, extractTheme } from "../lib/summaryUtils";
import type { SundayMemorySummary, MemoryNode } from "@shared/types/summaries";
import type { SundayChatSession, SundayMessage } from "@shared/types/sunday";
import { MESSAGE_RETENTION_POLICY } from "@shared/types/sunday";

/**
 * Compresses old messages from a Sunday chat into memory
 *
 * @param userId - User ID
 * @param chatId - Chat session ID
 */
export async function compressSundayMemory(userId: string, chatId: string): Promise<void> {
  console.log(`[Sunday Memory] Compressing memory for user ${userId}, chat ${chatId}`);

  try {
    // Load chat document with embedded messages
    const chatRef = db.collection(`users/${userId}/sundayChats`).doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      console.log("[Sunday Memory] Chat not found");
      return;
    }

    const chatData = chatDoc.data() as SundayChatSession;
    const messages = chatData.messages || [];

    // Find oldest unsummarized messages
    const unsummarized = messages
      .filter(m => !m.isSummarized)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .slice(0, MESSAGE_RETENTION_POLICY.SUMMARIZE_BATCH);

    if (unsummarized.length === 0) {
      console.log("[Sunday Memory] No messages to compress");
      return;
    }

    console.log(`[Sunday Memory] Found ${unsummarized.length} messages to compress`);

    // Extract conversation snippet
    const snippet = unsummarized.map(m => `${m.role}: ${m.content}`).join("\n");

    // Generate memory node using AI
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a therapeutic memory system. Summarize this conversation snippet into a concise memory node (50-100 words).

Focus on:
1. Key themes or topics discussed
2. User's emotional state and concerns
3. Therapeutic techniques or coping strategies discussed
4. Progress, insights, or breakthroughs
5. Actionable takeaways or commitments

Be specific but concise. This summary will help maintain therapeutic continuity in future sessions.`,
        },
        {
          role: "user",
          content: `Summarize this conversation:\n\n${snippet}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const memoryNodeSummary = completion.choices[0]?.message?.content || "Unable to summarize conversation.";

    console.log(`[Sunday Memory] Generated memory node (${estimateTokens(memoryNodeSummary)} tokens)`);

    // Load existing sunday_memory_summary
    const memorySummaryRef = db
      .collection(`users/${userId}/summaries`)
      .doc("sunday_memory_summary");

    const memorySummaryDoc = await memorySummaryRef.get();
    const existingData = memorySummaryDoc.data() as SundayMemorySummary | undefined;

    // Create new memory node
    const newNode: MemoryNode = {
      id: `node_${Date.now()}`,
      theme: extractTheme(snippet),
      createdFrom: [chatId],
      summary: memoryNodeSummary,
      timestamp: new Date().toISOString(),
    };

    const existingNodes = existingData?.memoryNodes || [];
    const updatedNodes = [...existingNodes, newNode];

    // Limit to MAX_MEMORY_NODES (remove oldest if needed)
    const finalNodes = updatedNodes.slice(-MESSAGE_RETENTION_POLICY.MAX_MEMORY_NODES);

    // Regenerate full memory summary
    const fullMemorySummary = await regenerateFullMemorySummary(
      userId,
      finalNodes,
      existingData
    );

    // Update summary document
    const updatedSummary: SundayMemorySummary = {
      type: "sunday_memory_summary",
      userId,
      summary: fullMemorySummary.summary,
      memoryNodes: finalNodes,
      effectiveTechniques: fullMemorySummary.effectiveTechniques,
      userPreferences: fullMemorySummary.userPreferences,
      triggerPatterns: fullMemorySummary.triggerPatterns,
      progressAreas: fullMemorySummary.progressAreas,
      conversationsIncluded: (existingData?.conversationsIncluded || 0) + 1,
      lastConversationDate: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      tokenCount: estimateTokens(fullMemorySummary.summary),
    };

    await memorySummaryRef.set(updatedSummary);

    // Remove compressed messages from the session document
    const compressedIds = new Set(unsummarized.map(m => m.id));
    const remainingMessages = messages.filter(m => !compressedIds.has(m.id));

    await chatRef.update({
      messages: remainingMessages,
      summarizedMessageCount: (chatData.summarizedMessageCount || 0) + unsummarized.length,
      lastSummarizedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update user's summary status
    await db.collection("users").doc(userId).set(
      {
        summaryStatus: {
          lastSundayMemoryUpdate: new Date().toISOString(),
        },
      },
      { merge: true }
    );

    console.log(`[Sunday Memory] Compressed ${unsummarized.length} messages into memory node`);
  } catch (error) {
    console.error(`[Sunday Memory] Compression error for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Regenerates the full memory summary from all memory nodes
 */
async function regenerateFullMemorySummary(
  userId: string,
  memoryNodes: MemoryNode[],
  existingData?: SundayMemorySummary
): Promise<{
  summary: string;
  effectiveTechniques: string[];
  userPreferences: string[];
  triggerPatterns: string[];
  progressAreas: string[];
}> {
  if (memoryNodes.length === 0) {
    return {
      summary: "First conversation with this user. No previous therapeutic history.",
      effectiveTechniques: [],
      userPreferences: [],
      triggerPatterns: [],
      progressAreas: [],
    };
  }

  // Combine all memory node summaries
  const allNodeSummaries = memoryNodes.map(node => `${node.theme}: ${node.summary}`).join("\n\n");

  // Use AI to create a cohesive summary
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `You are a therapeutic memory system. Create a comprehensive summary (250-350 words) of a user's therapeutic journey with Sunday AI.

Synthesize these memory nodes into a cohesive narrative covering:
1. Key therapeutic themes and recurring topics
2. User's emotional patterns and triggers
3. Effective techniques and interventions
4. User's preferences and communication style
5. Progress made and areas of growth
6. Current focus areas

Also extract:
- Effective techniques (list 3-5 specific techniques that worked)
- User preferences (communication style, approach preferences)
- Trigger patterns (recurring stressors or challenges)
- Progress areas (specific improvements or breakthroughs)

Format your response as JSON:
{
  "summary": "narrative summary text",
  "effectiveTechniques": ["technique1", "technique2"],
  "userPreferences": ["preference1", "preference2"],
  "triggerPatterns": ["trigger1", "trigger2"],
  "progressAreas": ["area1", "area2"]
}`,
      },
      {
        role: "user",
        content: `Memory nodes to synthesize:\n\n${allNodeSummaries}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(responseText);
    return {
      summary: parsed.summary || "Unable to generate summary.",
      effectiveTechniques: parsed.effectiveTechniques || existingData?.effectiveTechniques || [],
      userPreferences: parsed.userPreferences || existingData?.userPreferences || [],
      triggerPatterns: parsed.triggerPatterns || existingData?.triggerPatterns || [],
      progressAreas: parsed.progressAreas || existingData?.progressAreas || [],
    };
  } catch (error) {
    console.error("[Sunday Memory] Failed to parse AI response:", error);
    return {
      summary: "Error generating comprehensive summary.",
      effectiveTechniques: existingData?.effectiveTechniques || [],
      userPreferences: existingData?.userPreferences || [],
      triggerPatterns: existingData?.triggerPatterns || [],
      progressAreas: existingData?.progressAreas || [],
    };
  }
}

/**
 * Compresses unsummarized messages from ALL previous conversations
 * Called when starting a new conversation to ensure memory is built
 */
export async function compressPreviousConversations(userId: string): Promise<void> {
  console.log(`[Sunday Memory] Compressing previous conversations for user ${userId}`);

  try {
    // Get all chats for this user
    const chatsSnapshot = await db
      .collection(`users/${userId}/sundayChats`)
      .orderBy("lastMessageAt", "desc")
      .get();

    if (chatsSnapshot.empty) {
      console.log("[Sunday Memory] No previous conversations to compress");
      return;
    }

    // Collect all unsummarized messages from older chats (skip the most recent)
    const allUnsummarized: { chatId: string; chatRef: any; message: SundayMessage }[] = [];

    const olderChats = chatsSnapshot.docs.slice(1);

    for (const chatDoc of olderChats) {
      const chatData = chatDoc.data() as SundayChatSession;
      const messages = chatData.messages || [];

      const unsummarized = messages.filter(m => !m.isSummarized);
      for (const msg of unsummarized) {
        allUnsummarized.push({
          chatId: chatDoc.id,
          chatRef: chatDoc.ref,
          message: msg,
        });
      }
    }

    if (allUnsummarized.length < 4) {
      console.log(`[Sunday Memory] Only ${allUnsummarized.length} unsummarized messages, skipping compression`);
      return;
    }

    // Sort by timestamp and take oldest batch (up to 6)
    allUnsummarized.sort((a, b) => a.message.timestamp.localeCompare(b.message.timestamp));
    const toCompress = allUnsummarized.slice(0, 6);

    console.log(`[Sunday Memory] Compressing ${toCompress.length} messages from previous conversations`);

    // Generate memory node
    const snippet = toCompress.map(m => `${m.message.role}: ${m.message.content}`).join("\n");

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a therapeutic memory system. Summarize this conversation snippet into a concise memory node (50-100 words).

Focus on:
1. Key themes or topics discussed
2. User's emotional state and concerns
3. Therapeutic techniques or coping strategies discussed
4. Progress, insights, or breakthroughs
5. Actionable takeaways or commitments

Be specific but concise. This summary will help maintain therapeutic continuity in future sessions.`,
        },
        {
          role: "user",
          content: `Summarize this conversation:\n\n${snippet}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const memoryNodeSummary = completion.choices[0]?.message?.content || "Unable to summarize conversation.";

    // Load existing memory summary
    const memorySummaryRef = db
      .collection(`users/${userId}/summaries`)
      .doc("sunday_memory_summary");

    const memorySummaryDoc = await memorySummaryRef.get();
    const existingData = memorySummaryDoc.data() as SundayMemorySummary | undefined;

    // Create new memory node
    const chatIds = [...new Set(toCompress.map(m => m.chatId))];
    const newNode: MemoryNode = {
      id: `node_${Date.now()}`,
      theme: extractTheme(snippet),
      createdFrom: chatIds,
      summary: memoryNodeSummary,
      timestamp: new Date().toISOString(),
    };

    const existingNodes = existingData?.memoryNodes || [];
    const updatedNodes = [...existingNodes, newNode];
    const finalNodes = updatedNodes.slice(-MESSAGE_RETENTION_POLICY.MAX_MEMORY_NODES);

    // Regenerate full memory summary
    const fullMemorySummary = await regenerateFullMemorySummary(
      userId,
      finalNodes,
      existingData
    );

    // Update summary document
    const updatedSummary: SundayMemorySummary = {
      type: "sunday_memory_summary",
      userId,
      summary: fullMemorySummary.summary,
      memoryNodes: finalNodes,
      effectiveTechniques: fullMemorySummary.effectiveTechniques,
      userPreferences: fullMemorySummary.userPreferences,
      triggerPatterns: fullMemorySummary.triggerPatterns,
      progressAreas: fullMemorySummary.progressAreas,
      conversationsIncluded: (existingData?.conversationsIncluded || 0) + 1,
      lastConversationDate: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      tokenCount: estimateTokens(fullMemorySummary.summary),
    };

    await memorySummaryRef.set(updatedSummary);

    // Remove compressed messages from their respective chat documents
    const compressedIdsByChat = new Map<string, Set<string>>();
    for (const item of toCompress) {
      if (!compressedIdsByChat.has(item.chatId)) {
        compressedIdsByChat.set(item.chatId, new Set());
      }
      compressedIdsByChat.get(item.chatId)!.add(item.message.id);
    }

    for (const chatDoc of olderChats) {
      const idsToRemove = compressedIdsByChat.get(chatDoc.id);
      if (!idsToRemove) continue;

      const chatData = chatDoc.data() as SundayChatSession;
      const remaining = (chatData.messages || []).filter(m => !idsToRemove.has(m.id));

      await chatDoc.ref.update({
        messages: remaining,
        summarizedMessageCount: (chatData.summarizedMessageCount || 0) + idsToRemove.size,
        updatedAt: new Date().toISOString(),
      });
    }

    console.log(`[Sunday Memory] Compressed ${toCompress.length} messages from previous conversations`);
  } catch (error) {
    console.error(`[Sunday Memory] Error compressing previous conversations:`, error);
    // Don't throw - this is a background operation
  }
}

/**
 * Initializes Sunday memory summary for a new user
 */
export async function initializeSundayMemory(userId: string): Promise<void> {
  const memorySummaryRef = db
    .collection(`users/${userId}/summaries`)
    .doc("sunday_memory_summary");

  const existing = await memorySummaryRef.get();

  if (existing.exists) {
    console.log(`[Sunday Memory] Summary already exists for user ${userId}`);
    return;
  }

  const initialSummary: SundayMemorySummary = {
    type: "sunday_memory_summary",
    userId,
    summary: "First conversation with this user. No previous therapeutic history.",
    memoryNodes: [],
    effectiveTechniques: [],
    userPreferences: [],
    triggerPatterns: [],
    progressAreas: [],
    conversationsIncluded: 0,
    lastConversationDate: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    tokenCount: 10,
  };

  await memorySummaryRef.set(initialSummary);
  console.log(`[Sunday Memory] Initialized memory for user ${userId}`);
}
