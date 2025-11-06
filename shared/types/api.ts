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
