import type { Request, Response, NextFunction } from "express";
import { admin } from "../lib/admin";

// This processes a user request
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = req.headers.authorization || "";
    const match = auth.match(/^Bearer (.+)$/i);
    if (!match) {
      return res.status(401).json({ error: "Missing Bearer token" });
    }
    const decoded = await admin.auth().verifyIdToken(match[1]);
    (req as any).user = decoded;
    return next();
  } catch (error: any) {
    return res.status(401).json({
      error: error.message || "Unauthorized",
    });
  }
}
