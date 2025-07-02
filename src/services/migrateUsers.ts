import admin from "firebase-admin";
const serviceAccount = require("../../admin.json") as admin.ServiceAccount;
import { getRankByLevel } from "@/features/progress/CurrentRank";


// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to handle migration of data changes
async function migrateUsers() {
  try {
    const usersSnapshot = await db.collection("users").get();

    // base case
    if (usersSnapshot.empty) {
      console.log("No users found.");
      return;
    }

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const updates: Record<string, any> = {};

      // Add rank if missing
      if (!userData.rank && userData.level !== undefined) {
        updates.rank = getRankByLevel(userData.level);
      }

      // Remove deprecated field 'nextRank'
      if ("nextRank" in userData) {
        updates.nextRank = admin.firestore.FieldValue.delete(); // remove the key
      }

      // Only update if we have something to change
      if (Object.keys(updates).length > 0) {
        await db.collection("users").doc(userId).update(updates);
        console.log(`✅ Updated user: ${userId}`);
      } else {
        console.log(`ℹ️ No changes needed for user: ${userId}`);
      }
    }
    console.log("✅ Migration completed successfully.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrateUsers();
