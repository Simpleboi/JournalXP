import rateLimit from "express-rate-limit";

/**
 * Standard rate limiter for general API endpoints
 * Limits to 100 requests per 15 minutes per IP
 */
export const standardRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    details: "You have exceeded the rate limit. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}) as any;

/**
 * Strict rate limiter for expensive operations
 * Limits to 20 requests per 15 minutes per IP
 * Use for database-heavy operations, external API calls, or file operations
 */
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: "Too many requests",
    details: "You have exceeded the rate limit for this operation. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
}) as any;

/**
 * Authentication rate limiter
 * Limits to 5 login attempts per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: "Too many authentication attempts",
    details: "You have exceeded the maximum number of authentication attempts. Please try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
}) as any;
