# Firestore Data Migration Guide

This guide explains how to update existing Firestore documents when you change field names in your code (e.g., `points` → `xp`).

## Problem

You've updated your code to use `xp` instead of `points`, but existing user documents in Firestore still have the old field names. This causes the frontend to not see the data.

## Solutions

### Option 1: Automated Migration Script (Recommended)

I've created a migration script that automatically updates all user documents.

#### Step 1: Set Up Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `journalxp-4ea0f`
3. Click the gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file as `functions/creds/service-account.json`

**Important**: Add this to `.gitignore` (already done if you have `*.json` in creds/)

```bash
# Create creds directory if it doesn't exist
mkdir -p functions/creds

# Move your downloaded file there
mv ~/Downloads/journalxp-4ea0f-*.json functions/creds/service-account.json
```

#### Step 2: Run the Migration

```bash
cd functions
npm run migrate:users
```

This will:
- ✅ Find all user documents with `points` field
- ✅ Copy `points` value to `xp`
- ✅ Delete the old `points` field
- ✅ Update the `updatedAt` timestamp
- ✅ Show a summary of changes

#### Example Output

```
🚀 Starting user field migration...

📊 Found 5 user documents

✅ Updated user abc123
   Fields: points → xp
✅ Updated user def456
   Fields: points → xp
⏭️  Skipped user ghi789 (already migrated or no changes needed)

============================================================
📊 Migration Summary
============================================================
Total users:     5
✅ Updated:      2
⏭️  Skipped:      3
❌ Errors:       0
============================================================

✨ Migration completed successfully!
```

#### Adding More Field Migrations

Edit `functions/src/scripts/migrateUserFields.ts` and add to the `FIELD_MIGRATIONS` object:

```typescript
const FIELD_MIGRATIONS = {
  points: "xp",
  oldFieldName: "newFieldName",
  // Add more here
};
```

---

### Option 2: Firebase Console (Manual - Small Datasets Only)

For a small number of users, you can manually update documents in the Firebase Console.

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database**
4. Open the `users` collection
5. For each document:
   - Click on the document
   - Add a new field `xp` with the value from `points`
   - Delete the `points` field
   - Click **Update**

⚠️ **Not recommended for production or large datasets** - too time-consuming and error-prone.

---

### Option 3: Cloud Function Trigger (For Ongoing Migrations)

If you need to migrate fields as users log in, you can update the session initialization:

Edit `functions/src/routes/session.ts`:

```typescript
// In the POST /init endpoint, after fetching user data
if (userData.points !== undefined && userData.xp === undefined) {
  // Migrate on-the-fly
  await userRef.update({
    xp: userData.points,
    points: FieldValue.delete(),
  });

  // Refresh data
  const freshSnap = await userRef.get();
  userData = freshSnap.data();
}
```

This migrates users lazily as they log in. Good for gradual migrations without downtime.

---

### Option 4: Firestore Rules + Default Values (Read-Time Migration)

If you want to handle old fields at read time without modifying the database:

Update `functions/src/routes/session.ts` in the `toUserClient` function:

```typescript
function toUserClient(doc: any): UserClient {
  return {
    username: doc.username ?? doc.displayName ?? "New User",
    level: doc.level ?? 1,
    // Handle both old and new field names
    xp: doc.xp ?? doc.points ?? 0,
    totalXP: doc.totalXP ?? doc.totalPoints ?? 0,
    // ... rest of fields
  };
}
```

This allows your code to work with both old and new field names without changing the database. Good for backwards compatibility during transition periods.

---

## Which Option Should I Use?

| Scenario | Recommended Option |
|----------|-------------------|
| You have existing users in production | **Option 1** (Migration Script) |
| You have < 10 users and don't want to run scripts | **Option 2** (Manual Console) |
| You want to migrate gradually over time | **Option 3** (On-Login Migration) |
| You need backwards compatibility | **Option 4** (Read-Time Fallback) |

---

## Best Practices

### Before Running a Migration

1. ✅ **Backup your data**
   ```bash
   # Export Firestore data
   gcloud firestore export gs://journalxp-4ea0f.appspot.com/backups/$(date +%Y%m%d)
   ```

2. ✅ **Test on development/staging first**
   - Test migration script on emulator
   - Test on a staging Firebase project

3. ✅ **Review the migration script**
   - Check the field mappings
   - Understand what will change

### After Running a Migration

1. ✅ **Verify the data**
   - Check Firebase Console
   - Test frontend functionality
   - Verify user data loads correctly

2. ✅ **Monitor for errors**
   - Check Cloud Functions logs
   - Monitor user complaints

3. ✅ **Update documentation**
   - Document field name changes
   - Update type definitions

---

## Troubleshooting

### "Service account file not found"
Create the `functions/creds` directory and add your service account JSON there.

### "Permission denied"
Make sure your service account has the **Firebase Admin** role in the Firebase Console.

### "Migration script hangs"
Check your internet connection and Firebase project access. The script needs to connect to Firestore.

### "Some users still showing old data"
1. Check if migration actually ran (look at Firestore Console)
2. Clear browser cache and reload frontend
3. Call `refreshUserData()` in your app

### "Frontend still shows undefined for xp"
The backend might still be sending old field names. Check `toUserClient()` function in `functions/src/routes/session.ts`.

---

## Example: Complete Migration Workflow

```bash
# 1. Create backup (optional but recommended)
# gcloud firestore export gs://your-bucket/backup

# 2. Download service account
# (Do this from Firebase Console → Project Settings → Service Accounts)

# 3. Place service account file
mkdir -p functions/creds
mv ~/Downloads/journalxp-*.json functions/creds/service-account.json

# 4. Run migration
cd functions
npm run migrate:users

# 5. Verify in Firebase Console
# Open Firestore and check that 'xp' field exists and 'points' is gone

# 6. Test frontend
npm run dev:front
# Log in and check that XP displays correctly

# 7. Deploy updated functions
npm run build
firebase deploy --only functions
```

---

## Adding New Migrations

To add more field migrations in the future:

1. Update the script at `functions/src/scripts/migrateUserFields.ts`
2. Add your field mapping:
   ```typescript
   const FIELD_MIGRATIONS = {
     points: "xp",
     coins: "currency",  // New migration
     badges: "achievements",  // Another one
   };
   ```
3. Run: `npm run migrate:users`

The script is reusable for future schema changes!

---

## Need Help?

- Check Firebase logs: `firebase functions:log`
- Check Firestore Console: https://console.firebase.google.com
- Verify your service account has correct permissions
