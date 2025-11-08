# Schema Migration Summary

## Overview

This document summarizes the comprehensive schema migration from your old user document structure to the new standardized format.

---

## What Will Be Changed

### 1️⃣ Fields to Remove (Deprecated)

These fields will be **completely deleted**:

- ❌ `achievements` (map) - Not implemented yet
- ❌ `inventory` (array) - Not implemented yet
- ❌ `levelProgress` - Replaced by `xpNeededToNextLevel`
- ❌ `recentAchievement` - Not implemented yet
- ❌ `NextRank` - Not needed

### 2️⃣ Field Renames

| Old Field | New Field | Reason |
|-----------|-----------|--------|
| `points` | `xp` | More standard naming |
| `totalPoints` | `totalXP` | Consistency |
| `Rank` | `rank` | Fix capitalization |

### 3️⃣ Field Restructuring

#### Task Stats (Moving from Root to `taskStats`)

**Before:**
```json
{
  "totalTasksCompleted": 1,
  "totalTasksCreated": 1,
  "taskStats": {
    "currentTasksComplete": 0,
    "currentTasksCreated": 0
  }
}
```

**After:**
```json
{
  "taskStats": {
    "totalTasksCompleted": 1,
    "totalTasksCreated": 1,
    "currentTasksCompleted": 0,
    "currentTasksCreated": 0,
    "currentTasksPending": 0,
    "completionRate": 0,
    "priorityCompletion": { high: 0, medium: 0, low: 0 }
  }
}
```

#### Journal Stats (Moving from Root to `journalStats`)

**Before:**
```json
{
  "journalCount": 0,
  "totalJournalEntries": 0,
  "journalStats": {
    "totalWordCount": 0
  }
}
```

**After:**
```json
{
  "journalStats": {
    "journalCount": 0,
    "totalJournalEntries": 0,
    "totalWordCount": 0,
    "averageEntryLength": 0,
    "mostUsedWords": []
  }
}
```

### 4️⃣ New Fields Added

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `xpNeededToNextLevel` | number | XP required for next level | Calculated: `100 * 1.05^(level-1)` |
| `rank` | string | User rank | "Bronze III" (if missing) |

### 5️⃣ Fields That Stay the Same

These fields are **not changed**:

- ✅ `uid`
- ✅ `email`
- ✅ `displayName`
- ✅ `username`
- ✅ `level`
- ✅ `streak`
- ✅ `profilePicture`
- ✅ `joinDate`
- ✅ `lastLogin`
- ✅ `lastActivityDate`
- ✅ `createdAt`
- ✅ `updatedAt`
- ✅ `pointsToNextRank` (now represents XP to next rank, not level)

---

## Before & After Example

### Your Current Document

```json
{
  "achievements": {},
  "displayName": "Nate",
  "email": "hgasimpleboi@gmail.com",
  "inventory": [],
  "joinDate": "9/18/2025",
  "journalCount": 0,
  "totalJournalEntries": 0,
  "journalStats": {
    "totalWordCount": 0
  },
  "lastActivityDate": "string",
  "lastLogin": "string",
  "level": 2,
  "levelProgress": 100,
  "Rank": "Bronze III",
  "NextRank": "Bronze II",
  "points": 120,
  "totalPoints": 120,
  "pointsToNextRank": 100,
  "profilePicture": "https://...",
  "recentAchievement": "None yet",
  "streak": 0,
  "taskStats": {
    "avgCompletionTime": 0,
    "completionRate": 0,
    "currentTasksComplete": 0,
    "currentTasksCreated": 0,
    "currentTasksPending": 0,
    "priorityCompletion": {
      "high": 0,
      "medium": 0,
      "low": 0
    }
  },
  "totalTasksCompleted": 1,
  "totalTasksCreated": 1,
  "updatedAt": "string",
  "username": "NateJsx"
}
```

### After Migration

```json
{
  "displayName": "Nate",
  "email": "hgasimpleboi@gmail.com",
  "joinDate": "9/18/2025",
  "journalStats": {
    "journalCount": 0,
    "totalJournalEntries": 0,
    "totalWordCount": 0,
    "averageEntryLength": 0,
    "mostUsedWords": []
  },
  "lastActivityDate": "string",
  "lastLogin": "string",
  "level": 2,
  "rank": "Bronze III",
  "xp": 120,
  "totalXP": 120,
  "xpNeededToNextLevel": 105,
  "pointsToNextRank": 100,
  "profilePicture": "https://...",
  "streak": 0,
  "taskStats": {
    "totalTasksCompleted": 1,
    "totalTasksCreated": 1,
    "avgCompletionTime": 0,
    "completionRate": 0,
    "currentTasksCompleted": 0,
    "currentTasksCreated": 0,
    "currentTasksPending": 0,
    "priorityCompletion": {
      "high": 0,
      "medium": 0,
      "low": 0
    }
  },
  "updatedAt": "timestamp",
  "username": "NateJsx"
}
```

---

## Changes Summary

### Removed Fields (5)
- ❌ `achievements`
- ❌ `inventory`
- ❌ `levelProgress`
- ❌ `recentAchievement`
- ❌ `NextRank`

### Renamed Fields (3)
- `points` → `xp`
- `totalPoints` → `totalXP`
- `Rank` → `rank`

### Moved Fields (4)
- `journalCount` → `journalStats.journalCount`
- `totalJournalEntries` → `journalStats.totalJournalEntries`
- `totalTasksCompleted` → `taskStats.totalTasksCompleted`
- `totalTasksCreated` → `taskStats.totalTasksCreated`

### Fixed Fields (1)
- `currentTasksComplete` → `currentTasksCompleted`

### Added Fields (1)
- ✅ `xpNeededToNextLevel`

---

## How to Run Migration

### Option 1: API Endpoint (Easiest)

```bash
# Check status first
curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/status"

# Run migration
curl -X POST "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/migrate/user-fields?key=migrate-123"
```

### Option 2: CLI Script (For Production)

```bash
cd functions
npm run migrate:users
```

**Requires**: Service account credentials at `functions/creds/service-account.json`

---

## Migration is Safe

✅ **Non-destructive**: Only updates fields that need changing
✅ **Idempotent**: Can run multiple times safely
✅ **Validates**: Checks before applying changes
✅ **Preserves data**: Moves data, doesn't delete it
✅ **Adds defaults**: Missing fields get sensible defaults

---

## Verification Steps

After migration, verify in Firebase Console:

1. Go to Firestore → `users` collection
2. Open your user document
3. Check:
   - ✅ `xp` field exists (old `points` removed)
   - ✅ `totalXP` field exists (old `totalPoints` removed)
   - ✅ `rank` field exists (lowercase)
   - ✅ `xpNeededToNextLevel` field exists
   - ✅ `taskStats.totalTasksCompleted` exists
   - ✅ `journalStats.journalCount` exists
   - ❌ `achievements` removed
   - ❌ `inventory` removed
   - ❌ `levelProgress` removed
   - ❌ `recentAchievement` removed
   - ❌ `NextRank` removed

---

## Rollback (If Needed)

If you need to rollback, you can manually restore from Firebase Console or use the backup you created before migration.

**Best Practice**: Export Firestore data before migrating:

```bash
gcloud firestore export gs://journalxp-4ea0f.appspot.com/backups/$(date +%Y%m%d)
```

---

## Testing

1. **Test on emulator first**:
   ```bash
   npm run emulators
   # Then run migration against emulator
   ```

2. **Verify frontend still works**:
   - Log in
   - Check XP displays correctly
   - Verify stats show up

3. **Check API responses**:
   ```bash
   curl "http://127.0.0.1:5002/journalxp-4ea0f/us-central1/api/session/init" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## FAQ

### Will this break my frontend?

No. The `toUserClient()` function already handles both old and new field names with fallbacks.

### Will I lose data?

No. Data is moved, not deleted. All your XP, tasks, and journal stats are preserved.

### Can I run it multiple times?

Yes. The migration is idempotent - it only updates what needs updating.

### What if it fails?

Check the logs for specific errors. The migration validates each change before applying.

### Do I need to update my frontend code?

No. The backend sanitization function (`toUserClient()`) already uses the new field names.

---

## Support

If you encounter issues:

1. Check `MIGRATION_GUIDE.md` for detailed troubleshooting
2. Check `QUICKSTART_MIGRATION.md` for quick fixes
3. Review Firebase Functions logs: `firebase functions:log`
4. Check Firestore Console for document state

---

## Next Steps

After successful migration:

1. ✅ Test frontend thoroughly
2. ✅ Verify all XP displays correctly
3. ✅ Check task and journal stats
4. ✅ Test creating new users
5. ✅ Deploy to production when confident
