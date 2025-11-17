import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/requireAuth";
import { db, FieldValue } from "../lib/admin";

const router = Router();

/**
 * POST /store/purchase
 * Purchase an item from the store
 *
 * Body: { itemId: string, price: number }
 *
 * Deducts totalXP and adds item to inventory
 */
router.post("/purchase", requireAuth, async (req, res): Promise<any> => {
  try {
    const { itemId, price } = req.body;
    const uid = (req as AuthenticatedRequest).user?.uid;

    if (!uid) {
      return res.status(401).json({
        error: "Unauthorized",
        details: "User not authenticated",
        code: "NO_AUTH",
      });
    }

    if (!itemId || typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        error: "Invalid request",
        details: "itemId and price are required, price must be positive",
        code: "INVALID_REQUEST",
      });
    }

    const userRef = db.collection("users").doc(uid);

    // Use transaction to ensure atomic update
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const userData = userDoc.data();
      const currentTotalXP = userData?.totalXP || 0;
      const currentInventory = userData?.inventory || [];

      // Check if user already owns the item
      if (currentInventory.includes(itemId)) {
        throw new Error("You already own this item");
      }

      // Check if user has enough XP
      if (currentTotalXP < price) {
        throw new Error(`Not enough XP. You need ${price} XP but only have ${currentTotalXP} XP.`);
      }

      // Deduct XP and add item to inventory
      transaction.update(userRef, {
        totalXP: FieldValue.increment(-price),
        inventory: FieldValue.arrayUnion(itemId),
      });
    });

    // Fetch updated user data
    const updatedUserDoc = await userRef.get();
    const updatedUserData = updatedUserDoc.data();

    res.json({
      success: true,
      message: "Item purchased successfully",
      totalXP: updatedUserData?.totalXP || 0,
      inventory: updatedUserData?.inventory || [],
    });
  } catch (error: any) {
    console.error("Purchase error:", error);

    if (error.message === "User not found") {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (error.message.includes("Not enough XP") || error.message.includes("already own")) {
      return res.status(400).json({
        error: error.message,
        code: "PURCHASE_FAILED",
      });
    }

    res.status(500).json({
      error: "Failed to purchase item",
      details: error.message,
      code: "INTERNAL_ERROR",
    });
  }
});

export default router;
