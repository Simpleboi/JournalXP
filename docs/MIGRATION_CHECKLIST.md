# Schema Migration Checklist

## ✅ Pre-Migration Checklist

- [ ] Read `SCHEMA_MIGRATION_SUMMARY.md` to understand changes
- [ ] Backup your Firestore data (optional but recommended)
- [ ] Stop any running emulators
- [ ] Rebuild functions: `cd functions && npm run build`

---

## 🚀 Quick Start: Run Migration Now

### Step 1: Check Migration Status

```bash
curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/status"
```

**Expected Response:**
```json
{
  "totalUsers": 1,
  "needsMigration": 1,
  "migrated": 0,
  "usersNeedingMigration": ["BluNi1OALZgSN9sL35mI9SW9IO53"]
}
```

### Step 2: Run the Migration

**Option A: API Endpoint (Recommended for Emulator)**

```bash
curl -X POST "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/user-fields?key=migrate-123"
```

**Option B: CLI Script (For Production)**

```bash
cd functions
npm run migrate:users
```

### Step 3: Verify the Migration

```bash
# Check status again
curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/status"
```

**Expected Response:**
```json
{
  "totalUsers": 1,
  "needsMigration": 0,
  "migrated": 1,
  "usersNeedingMigration": []
}
```

### Step 4: Test Your Frontend

1. Refresh your browser
2. Log in
3. Check that XP displays correctly
4. Verify stats show properly

---

## 📊 What Will Happen

The migration will:

1. ✅ Rename `points` → `xp`
2. ✅ Rename `totalPoints` → `totalXP`
3. ✅ Fix `Rank` → `rank` (capitalization)
4. ✅ Remove deprecated fields: `achievements`, `inventory`, `levelProgress`, `recentAchievement`, `NextRank`
5. ✅ Move `totalTasksCompleted` → `taskStats.totalTasksCompleted`
6. ✅ Move `totalTasksCreated` → `taskStats.totalTasksCreated`
7. ✅ Move `journalCount` → `journalStats.journalCount`
8. ✅ Move `totalJournalEntries` → `journalStats.totalJournalEntries`
9. ✅ Add `xpNeededToNextLevel` (calculated from your current level)
10. ✅ Ensure `rank` defaults to "Bronze III" if missing

---

## 🔍 Verify in Firebase Console

After migration, check your Firestore:

1. Go to [Firebase Console](https://console.firebase.google.com/project/journalxp-4ea0f/firestore)
2. Open `users` collection
3. Open your user document

**Check these changes:**

| Field | Status | Expected |
|-------|--------|----------|
| `xp` | ✅ Exists | Value from old `points` |
| `totalXP` | ✅ Exists | Value from old `totalPoints` |
| `rank` | ✅ Lowercase | "Bronze III" |
| `xpNeededToNextLevel` | ✅ Added | ~105 (for level 2) |
| `taskStats.totalTasksCompleted` | ✅ Moved | 1 |
| `taskStats.totalTasksCreated` | ✅ Moved | 1 |
| `journalStats.journalCount` | ✅ Moved | 0 |
| `journalStats.totalJournalEntries` | ✅ Moved | 0 |
| `points` | ❌ Removed | (deleted) |
| `totalPoints` | ❌ Removed | (deleted) |
| `Rank` | ❌ Removed | (deleted) |
| `achievements` | ❌ Removed | (deleted) |
| `inventory` | ❌ Removed | (deleted) |
| `levelProgress` | ❌ Removed | (deleted) |
| `recentAchievement` | ❌ Removed | (deleted) |
| `NextRank` | ❌ Removed | (deleted) |

---

## 🛠️ If Something Goes Wrong

### Migration Failed

1. Check error logs in terminal
2. Verify emulator is running: `http://127.0.0.1:5002`
3. Try running again (migration is safe to repeat)

### Frontend Shows Wrong Data

1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Call `refreshUserData()` in your app
4. Check browser console for errors

### Can't See XP

1. Verify migration actually ran (check Firestore Console)
2. Check backend logs for errors
3. Ensure emulator is running
4. Try logging out and back in

---

## 📝 Migration Output Example

When you run the migration, you should see:

```
🚀 Starting user field migration...

📊 Found 1 user documents

✅ Updated user BluNi1OALZgSN9sL35mI9SW9IO53
   Fields: points → xp, totalPoints → totalXP, Rank → rank
   Removed: achievements, inventory, levelProgress, recentAchievement, NextRank
   Added xpNeededToNextLevel: 105
   Moved totalTasksCompleted → taskStats
   Moved totalTasksCreated → taskStats
   Moved journalCount → journalStats
   Moved totalJournalEntries → journalStats

============================================================
📊 Migration Summary
============================================================
Total users:     1
✅ Updated:      1
⏭️  Skipped:      0
❌ Errors:       0
============================================================

✨ Migration completed successfully!
```

---

## 🎯 For Production

When ready to migrate production:

### 1. Backup First (IMPORTANT!)

```bash
gcloud firestore export gs://journalxp-4ea0f.appspot.com/backups/$(date +%Y%m%d)
```

### 2. Deploy Updated Functions

```bash
npm run deploy:functions
```

### 3. Run Migration

```bash
# Option A: Via API
curl -X POST "https://journalxp-4ea0f.web.app/api/migrate/user-fields?key=YOUR_SECURE_KEY"

# Option B: Via Script (requires service account)
cd functions
npm run migrate:users
```

### 4. Verify

Check Firebase Console and test your production app.

---

## 📚 More Info

- **Detailed changes**: `SCHEMA_MIGRATION_SUMMARY.md`
- **Troubleshooting**: `MIGRATION_GUIDE.md`
- **Quick reference**: `QUICKSTART_MIGRATION.md`
- **User data flow**: `USER_SHAPE_FLOW.md`

---

## ✅ Post-Migration

After successful migration:

- [ ] Frontend displays XP correctly
- [ ] Stats show properly
- [ ] No console errors
- [ ] New users can sign up
- [ ] Existing users can log in
- [ ] All features work as expected

---

## 🆘 Need Help?

If you encounter issues, check:

1. Firebase Functions logs: `firebase functions:log`
2. Browser console for errors
3. Firestore Console for document state
4. This checklist for common solutions
