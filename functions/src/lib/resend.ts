import { Resend } from "resend";

// Initialize Resend with API key from environment
// In production, set RESEND_API_KEY in Firebase Functions config
// For local dev, add to functions/.env
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address - update this after verifying your domain in Resend
export const FROM_EMAIL = "JournalXP <noreply@journalxp.app>";

// Unsubscribe URL base - update for production
export const UNSUBSCRIBE_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://journalxp.app/unsubscribe"
    : "http://localhost:5173/unsubscribe";

export { resend };
