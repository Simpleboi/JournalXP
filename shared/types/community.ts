/**
 * Shared TypeScript interfaces for Community Reflections feature
 * Used by both frontend and backend for type safety
 */

/**
 * Prompt category types
 */
export type PromptCategory =
  | "gratitude"
  | "growth"
  | "reflection"
  | "connection"
  | "mindfulness";

/**
 * Community prompt as stored in Firestore
 */
export interface CommunityPrompt {
  id: string;
  text: string;
  category: PromptCategory;
  activeDate: string; // YYYY-MM-DD format
  expiresAt: string; // ISO timestamp (30 days after activeDate)
  createdAt: string; // ISO timestamp
  responseCount: number;
  isActive: boolean;
  order: number; // 1-10 for daily ordering
}

/**
 * Community response as returned to users (privacy-safe)
 */
export interface CommunityResponse {
  id: string;
  promptId: string;
  anonymousName: string; // "Level 12 Brave Explorer"
  content: string;
  createdAt: string; // ISO timestamp
  heartCount: number;
  hasHearted: boolean; // Whether the current user has hearted this
  isOwn: boolean; // Whether this is the current user's response
}

/**
 * Community response as stored in Firestore (includes userId)
 */
export interface CommunityResponseServer extends Omit<CommunityResponse, 'hasHearted' | 'isOwn'> {
  userId: string; // For history lookup, not exposed to others
  reportCount: number;
  isHidden: boolean;
  isDeleted: boolean;
}

/**
 * Prompt with its responses and user-specific metadata
 */
export interface CommunityPromptWithResponses {
  prompt: CommunityPrompt;
  responses: CommunityResponse[];
  hasResponded: boolean; // Whether the current user has responded
  userResponseId?: string; // ID of user's response if they responded
}

/**
 * GET /community/prompts response
 */
export interface GetPromptsResponse {
  prompts: CommunityPromptWithResponses[];
  responsesToday: number;
  maxResponsesPerDay: number;
}

/**
 * POST /community/responses request
 */
export interface CreateResponseRequest {
  promptId: string;
  content: string;
}

/**
 * POST /community/responses response
 */
export interface CreateResponseResponse {
  response: CommunityResponse;
  xpAwarded: number;
  newTotalXP: number;
  newLevel: number;
  leveledUp: boolean;
  responsesToday: number;
  achievements?: number[]; // Achievement IDs if any were unlocked
}

/**
 * POST /community/responses/:id/heart response
 */
export interface HeartToggleResult {
  hearted: boolean; // New state
  heartCount: number; // Updated count
}

/**
 * Report reason types
 */
export type ReportReason =
  | "inappropriate"
  | "spam"
  | "harassment"
  | "other";

/**
 * Report status types
 */
export type ReportStatus =
  | "pending"
  | "resolved"
  | "dismissed";

/**
 * POST /community/reports request
 */
export interface ReportSubmission {
  responseId: string;
  reason: ReportReason;
  details?: string;
}

/**
 * Community report as stored in Firestore
 */
export interface CommunityReport {
  id: string;
  responseId: string;
  reporterId: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: string; // ISO timestamp
  reviewedAt?: string; // ISO timestamp
  reviewedBy?: string; // Admin user ID
  resolution?: string;
}

/**
 * Report with response context for admin view
 */
export interface CommunityReportWithContext extends CommunityReport {
  responseContent: string;
  responseAnonymousName: string;
  promptText: string;
}

/**
 * User's response history item
 */
export interface UserResponseHistoryItem {
  id: string;
  promptText: string;
  promptCategory: PromptCategory;
  content: string;
  anonymousName: string;
  createdAt: string;
  heartCount: number;
}

/**
 * GET /community/my-responses response
 */
export interface GetUserHistoryResponse {
  responses: UserResponseHistoryItem[];
  totalResponses: number;
  totalHeartsReceived: number;
}

/**
 * GET /community/admin/reports response
 */
export interface GetReportsResponse {
  reports: CommunityReportWithContext[];
  totalPending: number;
}

/**
 * POST /community/admin/reports/:id/resolve request
 */
export interface ResolveReportRequest {
  resolution: "remove_content" | "dismiss" | "warn_user";
  notes?: string;
}

/**
 * Moderation check result
 */
export interface ModerationResult {
  passed: boolean;
  reason?: string;
}

/**
 * Constants
 */
export const COMMUNITY_CONSTANTS = {
  MAX_RESPONSE_LENGTH: 500,
  MAX_RESPONSES_PER_DAY: 15,
  XP_PER_RESPONSE: 20,
  PROMPTS_PER_DAY: 10,
  PROMPT_VISIBLE_DAYS: 30,
  REPORT_THRESHOLD_FOR_HIDE: 3,
} as const;
