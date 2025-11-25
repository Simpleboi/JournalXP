/**
 * Template Service
 * Handles API calls for journal templates
 */

import { authFetch } from '@/lib/authFetch';
import type {
  JournalTemplate,
  TemplatePayload,
  TemplateResponse,
  UserTemplatePreferences,
} from '@shared/types/templates';

const BASE_URL = '/templates';

/**
 * Get all templates (pre-built + user's custom templates)
 */
export const getAllTemplates = async (): Promise<JournalTemplate[]> => {
  return authFetch(BASE_URL);
};

/**
 * Get all pre-built templates
 */
export const getPrebuiltTemplates = async (): Promise<JournalTemplate[]> => {
  return authFetch(`${BASE_URL}/prebuilt`);
};

/**
 * Get a specific template by ID
 */
export const getTemplateById = async (id: string): Promise<JournalTemplate> => {
  return authFetch(`${BASE_URL}/${id}`);
};

/**
 * Create a new custom template
 */
export const createTemplate = async (payload: TemplatePayload): Promise<TemplateResponse> => {
  return authFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Update an existing custom template
 */
export const updateTemplate = async (
  id: string,
  updates: Partial<TemplatePayload>
): Promise<TemplateResponse> => {
  return authFetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

/**
 * Delete a custom template
 */
export const deleteTemplate = async (id: string): Promise<void> => {
  return authFetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Track template usage (increments usage count, updates recent list)
 */
export const trackTemplateUsage = async (id: string): Promise<void> => {
  return authFetch(`${BASE_URL}/${id}/use`, {
    method: 'POST',
  });
};

/**
 * Get user's template preferences
 */
export const getTemplatePreferences = async (): Promise<UserTemplatePreferences> => {
  return authFetch(`${BASE_URL}/preferences/me`);
};

/**
 * Update user's template preferences
 */
export const updateTemplatePreferences = async (
  preferences: Partial<UserTemplatePreferences>
): Promise<UserTemplatePreferences> => {
  return authFetch(`${BASE_URL}/preferences/me`, {
    method: 'PUT',
    body: JSON.stringify(preferences),
  });
};

/**
 * Toggle favorite status for a template
 */
export const toggleTemplateFavorite = async (
  id: string
): Promise<{ isFavorite: boolean }> => {
  return authFetch(`${BASE_URL}/${id}/favorite`, {
    method: 'POST',
  });
};
