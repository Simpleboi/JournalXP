import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// To verify the user with firebase
export async function verifyFirebaseUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing auth token" });
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).uid = decoded.uid;
    return next();
  } 
  catch (e) {
    console.error("Verification ID Token Failed: ", e);
    return res.status(401).json({ error: "Invalid auth token" });
  }
}
