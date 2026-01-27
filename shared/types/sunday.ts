/**
 * Sunday AI Chat Types
 *
 * Types for Sunday chat sessions, messages, and related data structures.
 */

/**
 * Sunday Chat Session
 *
 * Metadata for a conversation session with Sunday.
 */
export interface SundayChatSession {
  id: string;
  userId: string;

  // Session metadata
  title?: string; // Auto-generated from first message
  startedAt: string; // ISO timestamp
  lastMessageAt: string; // ISO timestamp

  // Message counts
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;

  // Memory management
  messagesRetained: number; // How many raw messages still stored
  summarizedMessageCount: number; // How many were compressed
  lastSummarizedAt?: string; // When last compression happened

  // Status
  isActive: boolean; // False if archived/compressed

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Sunday Message
 *
 * Individual message in a Sunday chat session.
 * Only recent messages are retained; older ones are summarized and deleted.
 */
export interface SundayMessage {
  id: string;
  chatId: string;

  role: "user" | "assistant";
  content: string;

  // Metadata
  timestamp: string; // ISO timestamp
  tokenCount?: number; // Tracked for cost management

  // Summarization tracking
  isSummarized: boolean; // True if included in a memory node
  summarizedInto?: string; // Reference to summary doc

  createdAt: string;
}

/**
 * Message retention policy constants
 */
export const MESSAGE_RETENTION_POLICY = {
  KEEP_RECENT: 20, // Keep last 20 messages in full
  SUMMARIZE_BATCH: 4, // Summarize in batches of 4
  TRIGGER_THRESHOLD: 8, // Trigger compression when total exceeds this
  MAX_MEMORY_NODES: 50, // Keep max 50 memory nodes per user
} as const;

/**
 * Token budget constants for context loading
 */
export const TOKEN_BUDGET = {
  SYSTEM_PROMPT: 200,
  PROFILE_SUMMARY: 100,
  JOURNAL_SUMMARY: 250,
  HABIT_TASK_SUMMARY: 200,
  MEMORY_SUMMARY: 400,
  RECENT_MESSAGES: 800, // 15-20 messages
  USER_MESSAGE: 100,
  TOTAL_CONTEXT: 2050, // Safe buffer under 4k
} as const;
