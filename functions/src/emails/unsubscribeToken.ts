import * as crypto from "crypto";

// Secret for signing tokens - in production, use Firebase Functions config
const TOKEN_SECRET = process.env.UNSUBSCRIBE_SECRET || "jxp-unsubscribe-secret-change-in-prod";
const TOKEN_EXPIRY_DAYS = 30;

export type UnsubscribeType = "weeklyDigest" | "productUpdates" | "all";

interface UnsubscribePayload {
  userId: string;
  type: UnsubscribeType;
  exp: number; // Expiry timestamp
}

/**
 * Generate a signed unsubscribe token
 * Contains userId, type, and expiry - signed to prevent tampering
 */
export function generateUnsubscribeToken(
  userId: string,
  type: UnsubscribeType
): string {
  const payload: UnsubscribePayload = {
    userId,
    type,
    exp: Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };

  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");

  // Create HMAC signature
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(encoded)
    .digest("base64url");

  return `${encoded}.${signature}`;
}

/**
 * Verify and decode an unsubscribe token
 * Returns the payload if valid, null if invalid or expired
 */
export function verifyUnsubscribeToken(
  token: string
): UnsubscribePayload | null {
  try {
    const [encoded, signature] = token.split(".");

    if (!encoded || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(encoded)
      .digest("base64url");

    if (signature !== expectedSignature) {
      console.log("[Unsubscribe] Invalid signature");
      return null;
    }

    // Decode payload
    const data = Buffer.from(encoded, "base64url").toString("utf8");
    const payload: UnsubscribePayload = JSON.parse(data);

    // Check expiry
    if (payload.exp < Date.now()) {
      console.log("[Unsubscribe] Token expired");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("[Unsubscribe] Token verification error:", error);
    return null;
  }
}
