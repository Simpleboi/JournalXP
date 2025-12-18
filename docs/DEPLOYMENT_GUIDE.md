# Sunday AI Backend - Deployment Guide

## Quick Start

This guide walks you through deploying the new summary-based Sunday AI architecture.

---

## Prerequisites

✅ Firebase CLI installed (`npm install -g firebase-tools`)
✅ Logged in to Firebase (`firebase login`)
✅ OpenAI API key set in Firebase config
✅ Node.js 22 installed

---

## Step 1: Build Functions

```bash
cd functions
npm install
npm run build
```

**Expected output:**
```
✓ Compiled successfully
```

**Troubleshooting:**
- If you see import errors for `@shared/*`, make sure shared types are accessible
- Check that all new files compile without errors

---

## Step 2: Deploy Firestore Rules

```bash
# From project root
firebase deploy --only firestore:rules
```

**What this does:**
- Updates security rules for new `summaries` and `sundayChats` collections
- Adds protection for summary documents (read-only for users)
- Prevents client-side modification of messages

**Expected output:**
```
✔  firestore: released rules firestore.rules to cloud.firestore
```

---

## Step 3: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

**What this does:**
- Creates composite indexes for efficient queries
- Adds indexes for `journalEntries`, `messages`, `tasks`, etc.

**Expected output:**
```
✔  firestore: deployed indexes in firestore.indexes.json successfully
```

**Note:** Index creation can take several minutes. You can monitor progress in the Firebase Console.

---

## Step 4: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

**What this deploys:**
- `api` - Main Express API (unchanged)
- `jxpChat` - Refactored Sunday AI chat (now uses summaries)
- `updateRecentJournalSummary` - Auto-summarizes journal entries
- `updateHabitTaskSummaryScheduled` - Daily habit/task summary (scheduled)

**Expected output:**
```
✔  functions[api(us-central1)] Successful update operation.
✔  functions[jxpChat(us-central1)] Successful update operation.
✔  functions[updateRecentJournalSummary(us-central1)] Successful create operation.
✔  functions[updateHabitTaskSummaryScheduled(us-central1)] Successful create operation.
```

**Troubleshooting:**
- If deployment fails, check `firebase debug.log`
- Ensure OpenAI API key is set: `firebase functions:config:get openai.key`
- If key is missing: `firebase functions:config:set openai.key="your-key-here"`

---

## Step 5: Run Migration Script (IMPORTANT!)

This backfills summaries for existing users.

### Option A: Local Execution (Recommended for Testing)

```bash
cd functions

# Set Google credentials (if not already set)
export GOOGLE_APPLICATION_CREDENTIALS="../creds/serviceAccountKey.json"

# Run migration
npx ts-node src/scripts/backfillSummaries.ts
```

### Option B: Deploy as One-Time Function

**Not recommended** - better to run locally first to monitor progress.

### What the migration does:

1. Finds all existing users
2. For each user:
   - Sets `aiDataConsent` defaults (all enabled)
   - Sets `summaryStatus` timestamps
   - Creates `profile_summary`
   - Creates `recent_journal_summary` (empty if no recent journals)
   - Creates `habit_task_summary`
   - Creates `sunday_memory_summary`

**Expected output:**
```
🚀 Starting summary backfill migration...

Found 10 users to process

Processing user user_abc123...
  ✅ Created profile summary
  ✅ Created journal summary
  ✅ Created habit/task summary
  ✅ Created Sunday memory summary
  ✅ User user_abc123 processed successfully

...

✅ Migration complete!

Summary:
  Total users processed: 10
  Profile summaries created: 10
  Journal summaries created: 10
  Habit/task summaries created: 10
  Sunday memories created: 10
  AI consent set: 10
  Summary status set: 10
  Errors: 0
```

**If you see errors:**
- Check Firebase service account permissions
- Verify Firestore security rules allow Cloud Functions to write to `summaries`
- Check OpenAI API key is valid

---

## Step 6: Verify Deployment

### Check Firestore Console

1. Go to Firebase Console → Firestore Database
2. Navigate to `users/{any-user}/summaries`
3. You should see 4 documents:
   - `profile_summary`
   - `recent_journal_summary`
   - `habit_task_summary`
   - `sunday_memory_summary`

### Test Sunday Chat

1. Open your app
2. Navigate to Sunday chat
3. Send a test message
4. Verify response is received
5. Check Firestore:
   - `users/{userId}/sundayChats/{chatId}` should exist
   - `users/{userId}/sundayChats/{chatId}/messages` should contain 2 messages

### Check Cloud Function Logs

```bash
# View all function logs
firebase functions:log

# View specific function logs
firebase functions:log --only jxpChat
firebase functions:log --only updateRecentJournalSummary
```

**Look for:**
- `[Sunday] Processing message for user: {uid}`
- `[Sunday] Loaded {n} recent messages`
- `[Sunday] Context tokens: ~{n}, History tokens: ~{n}`
- `✅ [Sunday] Successfully responded to user`

---

## Step 7: Test Journal Summary Generation

1. Create 3 journal entries via your app
2. Check Cloud Function logs:
   ```bash
   firebase functions:log --only updateRecentJournalSummary
   ```
3. Look for:
   - `[Journal Summary] Triggered for user {uid}`
   - `[Journal Summary] Analyzing {n} entries`
   - `✅ [Journal Summary] Updated summary for user`

4. Verify in Firestore:
   - `users/{userId}/summaries/recent_journal_summary` updated
   - `generatedAt` timestamp is recent
   - `summary` field contains AI-generated text

---

## Step 8: Test Habit/Task Summary (Optional)

The scheduled function runs daily at midnight. To test immediately:

1. Manually trigger the function in Firebase Console:
   - Go to Functions → `updateHabitTaskSummaryScheduled`
   - Click "Run now" (if available in your Firebase plan)

2. Or wait until tomorrow and check logs:
   ```bash
   firebase functions:log --only updateHabitTaskSummaryScheduled
   ```

---

## Step 9: Test Memory Compression (Optional)

Memory compression triggers automatically when a Sunday chat has 25+ messages.

To test:
1. Create a Sunday chat
2. Send 25+ messages (tedious, but necessary for testing)
3. Check logs for:
   ```
   🧠 [Sunday Memory] Compressing memory for user {uid}
   [Sunday Memory] Found {n} messages to compress
   ✅ [Sunday Memory] Compressed {n} messages into memory node
   ```

4. Verify in Firestore:
   - `users/{userId}/summaries/sunday_memory_summary` updated
   - `memoryNodes` array has new entry
   - Oldest 5 messages deleted from `messages` subcollection

---

## Rollback Plan (If Needed)

If something goes wrong, you can rollback:

### Rollback Functions

```bash
# View deployment history
firebase functions:list

# Rollback to previous version
firebase functions:rollback
```

### Rollback Firestore Rules

```bash
# Restore from git
git checkout HEAD~1 firestore.rules
firebase deploy --only firestore:rules
```

### Keep Summaries

Even if you rollback, the summaries remain in Firestore and won't cause issues. They're simply ignored by the old code.

---

## Monitoring Production

### Key Metrics to Watch

1. **Token Usage:**
   - Check `tokenCount` field in summaries
   - Average should be ~1,800 per Sunday chat

2. **Cost:**
   - Monitor OpenAI API usage dashboard
   - Expected: ~$0.0004 per Sunday message

3. **Function Errors:**
   ```bash
   firebase functions:log --only-errors
   ```

4. **Summary Freshness:**
   - Check `generatedAt` timestamps
   - Journal summaries should update after every 3 entries
   - Habit/task summaries should update daily

### Set Up Alerts (Optional)

In Firebase Console → Functions → Metrics:
- Alert on error rate > 5%
- Alert on execution time > 30s
- Alert on invocation count spikes

---

## Common Issues

### Issue: "PERMISSION_DENIED" in Firestore

**Cause:** Security rules too restrictive

**Fix:**
```bash
firebase deploy --only firestore:rules
```

### Issue: "Missing index" error

**Cause:** Firestore indexes not deployed or still creating

**Fix:**
```bash
firebase deploy --only firestore:indexes
# Wait 5-10 minutes for indexes to build
```

### Issue: Summary generation fails with OpenAI error

**Cause:** API key missing or invalid

**Fix:**
```bash
# Check current config
firebase functions:config:get

# Set OpenAI key
firebase functions:config:set openai.key="sk-..."

# Redeploy
firebase deploy --only functions
```

### Issue: Migration script fails

**Cause:** Missing service account credentials

**Fix:**
1. Download service account key from Firebase Console
2. Save as `creds/serviceAccountKey.json`
3. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./creds/serviceAccountKey.json"
   ```

---

## Post-Deployment Checklist

- [ ] All Cloud Functions deployed successfully
- [ ] Firestore rules deployed
- [ ] Firestore indexes created (check Firebase Console)
- [ ] Migration script completed for all users
- [ ] Tested Sunday chat with real user
- [ ] Verified summary generation
- [ ] Checked Cloud Function logs for errors
- [ ] Monitored token usage (should be < 2,000 per chat)

---

## Next Steps

1. Monitor for 24-48 hours
2. Check costs in OpenAI dashboard
3. Verify scheduled functions run at midnight
4. Consider adding UI for AI consent management
5. Optimize based on real usage patterns

---

## Support

- **Cloud Function Logs:** `firebase functions:log`
- **Firestore Console:** [Firebase Console](https://console.firebase.google.com)
- **OpenAI Usage:** [OpenAI Platform](https://platform.openai.com/usage)

**Deployment Date:** ___________
**Deployed By:** ___________
**Production URL:** ___________
