/**
 * Community Service
 * Handles API calls for the Community Reflections feature
 */

import { authFetch } from '@/lib/authFetch';
import type {
  GetPromptsResponse,
  CreateResponseRequest,
  CreateResponseResponse,
  HeartToggleResult,
  ReportSubmission,
  GetUserHistoryResponse,
} from '@shared/types/community';

const BASE_URL = '/community';

/**
 * Get active prompts with their responses
 */
export const getPrompts = async (): Promise<GetPromptsResponse> => {
  return authFetch(`${BASE_URL}/prompts`);
};

/**
 * Create a response to a prompt
 * Awards 20 XP on success
 */
export const createResponse = async (
  request: CreateResponseRequest
): Promise<CreateResponseResponse> => {
  return authFetch(`${BASE_URL}/responses`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

/**
 * Toggle heart on a response
 */
export const toggleHeart = async (responseId: string): Promise<HeartToggleResult> => {
  return authFetch(`${BASE_URL}/responses/${responseId}/heart`, {
    method: 'POST',
  });
};

/**
 * Report a response for moderation
 */
export const reportResponse = async (report: ReportSubmission): Promise<void> => {
  return authFetch(`${BASE_URL}/reports`, {
    method: 'POST',
    body: JSON.stringify(report),
  });
};

/**
 * Get the current user's response history
 */
export const getMyResponses = async (options?: {
  limit?: number;
  offset?: number;
}): Promise<GetUserHistoryResponse> => {
  const params = new URLSearchParams();
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.offset) params.set('offset', options.offset.toString());

  const queryString = params.toString();
  const url = `${BASE_URL}/my-responses${queryString ? `?${queryString}` : ''}`;
  return authFetch(url);
};
