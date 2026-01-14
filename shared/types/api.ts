/**
 * Shared TypeScript interfaces for API requests and responses
 * Used by both frontend and backend for type safety
 */

import type { UserClient } from "./user";

/**
 * Standard error response structure
 */
export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

/**
 * Session initialization response
 */
export interface SessionInitResponse {
  user: UserClient;
  sessionCookie?: boolean; // Indicates if session cookie was set
  expiresAt?: string; // ISO timestamp when session expires
  message?: string;
}

/**
 * Session logout response
 */
export interface SessionLogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Auth me response (current authenticated user)
 */
export interface AuthMeResponse {
  user: UserClient;
  authenticated: boolean;
  sessionType: "token" | "cookie";
}

/**
 * Session refresh response
 */
export interface SessionRefreshResponse {
  user: UserClient;
  expiresAt?: string;
  message?: string;
}

/**
 * Generic success response
 */
export interface SuccessResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Self-reflection generation request
 */
export interface SelfReflectionGenerateRequest {
  // Empty - all params inferred from user
}

/**
 * Self-reflection generation response
 */
export interface SelfReflectionGenerateResponse {
  reflection: {
    emotionalPatterns: string;
    growthTrajectory: string;
    recurringThemes: string;
    identifiedStrengths: string;
  };
  summary: string;
  metadata: {
    entriesAnalyzed: number;
    generationNumber: number;
    remainingToday: number;
    expiresAt: string;
    analysisMode: 'metadata' | 'full-content'; // Indicates which analysis mode was used
  };
}

/**
 * Self-reflection error response
 */
export interface SelfReflectionErrorResponse extends ApiError {
  code: 'INSUFFICIENT_ENTRIES' | 'DAILY_LIMIT_REACHED' | 'AI_CONSENT_REQUIRED' | 'RATE_LIMIT_EXCEEDED';
  requiredEntries?: number;
  currentEntries?: number;
  nextResetAt?: string;
}
