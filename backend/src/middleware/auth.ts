import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export async function verifyFirebaseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing auth token" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).uid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid auth token" });
  }
}
