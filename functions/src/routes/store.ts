import { Router, Request, Response } from "express";
import { db, FieldValue } from "../lib/admin";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /api/store/purchase
 * Purchase an item from the store
 * Deducts spendableXP and adds item to inventory
 */
router.post("/purchase", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user.uid as string;
    const { itemId, price } = req.body;

    // Validation
    if (!itemId || typeof itemId !== "string") {
      res.status(400).json({ error: "itemId is required and must be a string" });
      return;
    }

    if (!price || typeof price !== "number" || price <= 0) {
      res.status(400).json({ error: "price is required and must be a positive number" });
      return;
    }

    const userRef = db.collection("users").doc(uid);

    // Use transaction to ensure atomic operation
    const result = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      const userData = userDoc.data()!;
      const currentSpendableXP = userData.spendableXP || 0;
      const currentInventory = userData.inventory || [];

      // Check if user already owns this item
      if (currentInventory.includes(itemId)) {
        throw new Error("You already own this item");
      }

      // Check if user has enough spendable XP
      if (currentSpendableXP < price) {
        throw new Error(`Not enough XP. You have ${currentSpendableXP} XP but need ${price} XP.`);
      }

      // Deduct XP and add item to inventory
      transaction.update(userRef, {
        spendableXP: FieldValue.increment(-price),
        inventory: FieldValue.arrayUnion(itemId),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        newSpendableXP: currentSpendableXP - price,
        newInventory: [...currentInventory, itemId],
      };
    });

    res.json({
      success: true,
      message: "Item purchased successfully",
      spendableXP: result.newSpendableXP,
      inventory: result.newInventory,
    });
  } catch (error: any) {
    console.error("Error purchasing item:", error);

    // Handle specific error messages
    if (error.message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else if (error.message === "You already own this item") {
      res.status(400).json({ error: "You already own this item" });
    } else if (error.message.includes("Not enough XP")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to purchase item", details: error.message });
    }
  }
});

export default router;
