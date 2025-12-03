# Sunday AI Backend - Deployment Checklist

Use this checklist when deploying the new Sunday AI architecture.

---

## Pre-Deployment

### Environment Setup
- [ ] Node.js 22 installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged into Firebase (`firebase login`)
- [ ] Correct Firebase project selected (`firebase use <project>`)

### Configuration
- [ ] OpenAI API key obtained
- [ ] API key set in Firebase config:
  ```bash
  firebase functions:config:set openai.key="sk-..."
  ```
- [ ] Service account JSON downloaded (for migration script)
- [ ] Placed in `creds/serviceAccountKey.json`

### Code Review
- [ ] All new files compile without errors
- [ ] TypeScript types resolve correctly
- [ ] No missing imports
- [ ] `npm run build` succeeds in `functions/`

---

## Deployment Steps

### 1. Build Functions
```bash
cd functions
npm install
npm run build
```
- [ ] Build completes without errors
- [ ] `dist/` directory created

### 2. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```
- [ ] Rules deployed successfully
- [ ] No permission errors in console

### 3. Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```
- [ ] Indexes deployment initiated
- [ ] Wait 5-10 minutes for indexes to build
- [ ] Check Firebase Console → Firestore → Indexes
- [ ] All indexes show "Enabled" status

### 4. Deploy Cloud Functions
```bash
firebase deploy --only functions
```
- [ ] `api` function deployed
- [ ] `jxpChat` function deployed
- [ ] `updateRecentJournalSummary` function deployed
- [ ] `updateHabitTaskSummaryScheduled` function deployed
- [ ] No deployment errors

### 5. Run Migration Script
```bash
cd functions
export GOOGLE_APPLICATION_CREDENTIALS="../creds/serviceAccountKey.json"
npm run migrate:summaries
```
- [ ] Migration starts successfully
- [ ] All users processed
- [ ] 4 summaries created per user
- [ ] AI consent set for all users
- [ ] No errors in output

---

## Post-Deployment Verification

### Check Firestore Console
- [ ] Navigate to Firebase Console → Firestore
- [ ] Open `users/{test-user}/summaries`
- [ ] Verify 4 documents exist:
  - [ ] `profile_summary`
  - [ ] `recent_journal_summary`
  - [ ] `habit_task_summary`
  - [ ] `sunday_memory_summary`
- [ ] Check each summary has:
  - [ ] `summary` field with text
  - [ ] `generatedAt` timestamp
  - [ ] `tokenCount` number
  - [ ] `userId` matches

### Test Sunday Chat
- [ ] Open app in browser
- [ ] Navigate to Sunday chat page
- [ ] Send test message: "Hello Sunday!"
- [ ] Receive response from AI
- [ ] Check Firestore:
  - [ ] `users/{userId}/sundayChats/{chatId}` created
  - [ ] `messages` subcollection has 2 messages
  - [ ] Message timestamps are correct

### Check Cloud Function Logs
```bash
firebase functions:log --only jxpChat
```
- [ ] Look for successful execution logs:
  - [ ] `[Sunday] Processing message for user: {uid}`
  - [ ] `[Sunday] Loaded {n} recent messages`
  - [ ] `[Sunday] Context tokens: ~{n}`
  - [ ] `✅ [Sunday] Successfully responded`
- [ ] No error messages
- [ ] Token count < 2,000

### Test Journal Summary
- [ ] Create 3 journal entries via app
- [ ] Wait 10-20 seconds
- [ ] Check logs:
  ```bash
  firebase functions:log --only updateRecentJournalSummary
  ```
- [ ] Look for:
  - [ ] `[Journal Summary] Triggered for user`
  - [ ] `[Journal Summary] Analyzing {n} entries`
  - [ ] `✅ [Journal Summary] Updated summary`
- [ ] Check Firestore:
  - [ ] `summaries/recent_journal_summary` updated
  - [ ] `generatedAt` is recent
  - [ ] `dominantMoods` array populated
  - [ ] Journal entries marked `includedInLastSummary: true`

### Verify Scheduled Function
- [ ] Wait until next midnight OR trigger manually
- [ ] Check logs:
  ```bash
  firebase functions:log --only updateHabitTaskSummaryScheduled
  ```
- [ ] Look for:
  - [ ] `[Habit/Task Summary] Starting scheduled update`
  - [ ] `[Habit/Task Summary] Found {n} active users`
  - [ ] `✅ [Habit/Task Summary] Updated summary`

---

## Performance Verification

### Token Usage
- [ ] Check summary token counts in Firestore:
  - [ ] `profile_summary`: 50-200 tokens
  - [ ] `recent_journal_summary`: 150-350 tokens
  - [ ] `habit_task_summary`: 100-300 tokens
  - [ ] `sunday_memory_summary`: 200-500 tokens
- [ ] Total context < 2,000 tokens per chat
- [ ] Verify in function logs: `Context tokens: ~{n}`

### Cost Monitoring
- [ ] Open OpenAI dashboard: https://platform.openai.com/usage
- [ ] Verify model used: `gpt-4o-mini`
- [ ] Check cost per request: ~$0.0004
- [ ] Monitor over 24 hours

### Function Performance
- [ ] Check execution times in Firebase Console
- [ ] `jxpChat`: < 10 seconds
- [ ] `updateRecentJournalSummary`: < 15 seconds
- [ ] `updateHabitTaskSummaryScheduled`: < 5 seconds per user

---

## Rollback Plan (If Issues Occur)

### If Critical Error Found
1. [ ] Document the error (screenshot logs)
2. [ ] Rollback functions:
   ```bash
   firebase functions:rollback
   ```
3. [ ] Notify users of temporary Sunday unavailability
4. [ ] Debug issue locally with emulators
5. [ ] Fix and redeploy

### Partial Rollback
- [ ] Firestore rules: Restore from git, redeploy
- [ ] Indexes: Cannot rollback, but won't break old code
- [ ] Summaries: Leave in place, old code ignores them

---

## Monitoring (First 48 Hours)

### Every 6 Hours
- [ ] Check Cloud Function error logs
- [ ] Verify scheduled function ran
- [ ] Check OpenAI usage dashboard
- [ ] Test Sunday chat manually

### Daily
- [ ] Review token usage trends
- [ ] Check summary generation frequency
- [ ] Monitor Firestore reads/writes
- [ ] Verify no permission errors

### After 48 Hours
- [ ] Calculate actual cost vs projected
- [ ] Review user feedback (if any)
- [ ] Check for optimization opportunities
- [ ] Document any issues encountered

---

## Success Criteria

### Must Have
- [x] All Cloud Functions deployed
- [x] Firestore rules active
- [x] Indexes created
- [x] Migration completed
- [x] Sunday chat works end-to-end
- [x] Token usage < 2,000 per chat
- [x] No errors in logs

### Should Have
- [ ] All users migrated successfully
- [ ] Journal summaries generating automatically
- [ ] Scheduled function runs daily
- [ ] Cost < $0.001 per Sunday message
- [ ] Memory compression tested (25+ messages)

### Nice to Have
- [ ] User feedback positive
- [ ] Response times < 5 seconds
- [ ] Zero downtime during deployment
- [ ] Documentation reviewed by team

---

## Common Issues & Solutions

### Issue: OpenAI rate limit errors
**Solution:**
- Reduce concurrent requests
- Implement exponential backoff
- Check API quota limits

### Issue: Firestore permission denied
**Solution:**
```bash
firebase deploy --only firestore:rules
```

### Issue: Missing indexes
**Solution:**
```bash
firebase deploy --only firestore:indexes
# Wait 10 minutes, check Firebase Console
```

### Issue: Summary not generating
**Check:**
- User has `aiDataConsent.journalAnalysisEnabled: true`
- At least 3 unsummarized journal entries exist
- Function logs for errors

---

## Sign-Off

### Deployment Information
- **Date:** _______________
- **Time:** _______________
- **Deployed By:** _______________
- **Firebase Project:** _______________
- **Git Commit:** _______________

### Verification
- [ ] All pre-deployment steps completed
- [ ] All deployment steps successful
- [ ] Post-deployment verification passed
- [ ] Monitoring in place
- [ ] Team notified

### Approval
- **Developer:** _______________
- **Reviewer:** _______________
- **Date:** _______________

---

## Notes

Use this space to document any issues, deviations from the plan, or observations:

```
[Add notes here]
```

---

**Checklist Version:** 1.0.0
**Last Updated:** December 2, 2025
