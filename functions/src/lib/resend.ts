import { Resend } from "resend";

// Initialize Resend lazily to avoid errors when API key is not set
// In production, set RESEND_API_KEY in Firebase Functions config
// For local dev, add to functions/.env
let _resend: Resend | null = null;

/**
 * Get the Resend client instance.
 * Returns null if RESEND_API_KEY is not configured.
 */
function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Export a proxy object that lazily initializes
export const resend = {
  emails: {
    send: async (params: Parameters<Resend["emails"]["send"]>[0]) => {
      const client = getResendClient();
      if (!client) {
        throw new Error("Resend API key not configured");
      }
      return client.emails.send(params);
    },
  },
};

// Email sender address - update this after verifying your domain in Resend
export const FROM_EMAIL = "JournalXP <noreply@journalxp.app>";

// Unsubscribe URL base - update for production
export const UNSUBSCRIBE_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://journalxp.app/unsubscribe"
    : "http://localhost:5173/unsubscribe";
