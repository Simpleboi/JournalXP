import type { Request, Response, NextFunction } from "express";
import { admin } from "../lib/admin";

/**
 * Extended Request interface with authenticated user data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
    firebase?: {
      sign_in_provider?: string;
    };
  };
}

/**
 * Authentication middleware that verifies Firebase ID tokens or session cookies
 *
 * This middleware supports two authentication methods:
 * 1. Authorization header with Bearer token (Firebase ID token)
 * 2. HTTP-only session cookie (__session)
 *
 * If authentication succeeds, the decoded user data is attached to req.user
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let decoded;

    // Method 1: Check for Authorization header with Bearer token
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/i);

    if (match) {
      const idToken = match[1];

      try {
        // Verify the Firebase ID token
        decoded = await admin.auth().verifyIdToken(idToken, true); // checkRevoked = true
      } catch (tokenError: any) {
        // Specific error handling for token verification
        if (tokenError.code === "auth/id-token-expired") {
          res.status(401).json({
            error: "Token expired",
            details: "Your session has expired. Please sign in again.",
            code: "TOKEN_EXPIRED"
          });
          return;
        } else if (tokenError.code === "auth/id-token-revoked") {
          res.status(401).json({
            error: "Token revoked",
            details: "Your session has been revoked. Please sign in again.",
            code: "TOKEN_REVOKED"
          });
          return;
        } else if (tokenError.code === "auth/argument-error") {
          res.status(401).json({
            error: "Invalid token",
            details: "The authentication token is malformed or invalid.",
            code: "INVALID_TOKEN"
          });
          return;
        }
        throw tokenError; // Re-throw unknown errors
      }
    }
    // Method 2: Check for session cookie (__session)
    else {
      const sessionCookie = req.cookies?.__session;

      if (sessionCookie) {
        try {
          // Verify the session cookie
          decoded = await admin.auth().verifySessionCookie(sessionCookie, true); // checkRevoked = true
        } catch (cookieError: any) {
          if (cookieError.code === "auth/session-cookie-expired") {
            res.status(401).json({
              error: "Session expired",
              details: "Your session has expired. Please sign in again.",
              code: "SESSION_EXPIRED"
            });
            return;
          } else if (cookieError.code === "auth/session-cookie-revoked") {
            res.status(401).json({
              error: "Session revoked",
              details: "Your session has been revoked. Please sign in again.",
              code: "SESSION_REVOKED"
            });
            return;
          }
          throw cookieError;
        }
      } else {
        // No authentication method provided
        res.status(401).json({
          error: "Authentication required",
          details: "No authentication token or session cookie provided.",
          code: "NO_AUTH"
        });
        return;
      }
    }

    // Attach decoded user data to request
    (req as AuthenticatedRequest).user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      email_verified: decoded.email_verified,
      firebase: decoded.firebase,
    };

    next();
  } catch (error: any) {
    console.error("requireAuth error:", error);
    res.status(401).json({
      error: "Unauthorized",
      details: error.message || "Authentication failed",
      code: "AUTH_FAILED"
    });
  }
}
