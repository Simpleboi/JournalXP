/**
 * Content Moderation Utilities
 *
 * Provides functions for pre-upload content moderation including:
 * - Blocklist word filtering
 * - PII detection (phone numbers, emails, URLs, social handles)
 * - Basic XSS prevention
 */

import type { ModerationResult } from "../../../shared/types/community";

/**
 * Blocklist of inappropriate words and phrases
 * Includes profanity, slurs, and harmful content
 */
const BLOCKLIST: string[] = [
  // Explicit profanity
  "fuck",
  "shit",
  "ass",
  "bitch",
  "damn",
  "cunt",
  "dick",
  "cock",
  "pussy",
  "whore",
  "slut",
  // Slurs and hate speech (abbreviated list - expand as needed)
  "nigger",
  "nigga",
  "faggot",
  "fag",
  "retard",
  "retarded",
  // Violence-related
  "kill yourself",
  "kys",
  "suicide",
  "self-harm",
  "cut yourself",
  // Drug references (in harmful context)
  "buy drugs",
  "sell drugs",
];

/**
 * Patterns for detecting PII
 */
const PII_PATTERNS = {
  // Phone numbers (various formats)
  phone: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  // Email addresses
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  // URLs (http, https, www)
  url: /(?:https?:\/\/|www\.)[^\s<>"{}|\\^`[\]]+/gi,
  // Social media handles (@username format, minimum 3 chars)
  socialHandle: /@[a-zA-Z0-9_]{3,}/g,
  // SSN pattern
  ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
};

/**
 * Check content against the blocklist
 *
 * @param content - Text content to check
 * @returns ModerationResult indicating if content passed
 */
export function checkBlocklist(content: string): ModerationResult {
  const lowerContent = content.toLowerCase();

  for (const word of BLOCKLIST) {
    // Use word boundary matching to avoid false positives
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
    if (regex.test(lowerContent)) {
      return {
        passed: false,
        reason: "Content contains inappropriate language. Please revise and try again.",
      };
    }
  }

  return { passed: true };
}

/**
 * Check content for PII patterns
 *
 * @param content - Text content to check
 * @returns ModerationResult indicating if content passed
 */
export function checkForPII(content: string): ModerationResult {
  // Check for phone numbers
  if (PII_PATTERNS.phone.test(content)) {
    return {
      passed: false,
      reason: "Please don't include phone numbers in your response to protect your privacy.",
    };
  }

  // Check for email addresses
  if (PII_PATTERNS.email.test(content)) {
    return {
      passed: false,
      reason: "Please don't include email addresses in your response to protect your privacy.",
    };
  }

  // Check for URLs
  if (PII_PATTERNS.url.test(content)) {
    return {
      passed: false,
      reason: "Links are not allowed in community responses.",
    };
  }

  // Check for social handles
  if (PII_PATTERNS.socialHandle.test(content)) {
    return {
      passed: false,
      reason: "Please don't include social media handles to protect your privacy.",
    };
  }

  // Check for SSN patterns
  if (PII_PATTERNS.ssn.test(content)) {
    return {
      passed: false,
      reason: "Please don't include sensitive identification numbers.",
    };
  }

  return { passed: true };
}

/**
 * Run all moderation checks on content
 *
 * @param content - Text content to check
 * @returns ModerationResult indicating if content passed all checks
 */
export function moderateContent(content: string): ModerationResult {
  // Check blocklist first
  const blocklistResult = checkBlocklist(content);
  if (!blocklistResult.passed) {
    return blocklistResult;
  }

  // Check for PII
  const piiResult = checkForPII(content);
  if (!piiResult.passed) {
    return piiResult;
  }

  return { passed: true };
}

/**
 * Sanitize content for safe storage/display
 * Performs basic XSS prevention
 *
 * @param content - Raw user content
 * @returns Sanitized content safe for storage
 */
export function sanitizeContent(content: string): string {
  return content
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Encode HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    // Remove null bytes
    .replace(/\0/g, "")
    // Normalize whitespace (but preserve newlines for formatting)
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    // Trim
    .trim();
}

/**
 * Escape special regex characters in a string
 *
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
