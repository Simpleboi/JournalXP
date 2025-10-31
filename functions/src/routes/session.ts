import { Router } from "express";
import type { Request, Response } from "express";
import { admin, db } from "@/lib/admin";
import { requireAuth } from "@/middleware/requireAuth";

// define a router
const router = Router();

function tsToIso(value: any): string | null {
  if (!value) {
    return null;
  }
  if (typeof value.toDate === "function") {
    return value.toDate();
  }
  if (value.seconds) {
    return new Date(value.seconds * 1000).toISOString();
  }
  return null;
}

// POST /api/session/init
router.post("/init", requireAuth, async (req: Request, res: Response) => {
  const { uid, email, name, picture } = (req as any).user;

  const userRef = db.collection("users").doc(uid);
  const snapShot = await userRef.get();

  // if our user doesn't exist
  if (!snapShot.exists) {
    await userRef.set({
      uid,
      email: email ?? null,
      displayName: name ?? null,
      photoUrl: picture ?? null,
      xp: 0,
      level: 1,
      streak: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
});
