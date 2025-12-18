# Sunday AI - Quick Reference Card

Fast reference for the Sunday AI summary-based architecture.

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| Token usage per chat | ~1,800 tokens |
| Cost per Sunday message | ~$0.0004 |
| Cost for 1,000 DAU/month | ~$13-18 |
| Token reduction vs old | 82% |
| Cost reduction vs old | 80% |

---

## 🗂️ Firestore Structure

```
users/{userId}
├── (user document with aiDataConsent, summaryStatus)
├── journalEntries/{entryId}
│   └── (includes: userId, isPrivate, includedInLastSummary)
├── tasks/{taskId}
├── habits/{habitId}
├── sundayChats/{chatId}
│   ├── (metadata: totalMessages, messagesRetained, etc.)
│   └── messages/{messageId}
│       └── (role, content, timestamp, isSummarized)
└── summaries/
    ├── profile_summary (~100-200 tokens)
    ├── recent_journal_summary (~200-300 tokens)
    ├── habit_task_summary (~150-250 tokens)
    └── sunday_memory_summary (~300-400 tokens)
```

---

## ☁️ Cloud Functions

| Function | Trigger | Purpose | Cost |
|----------|---------|---------|------|
| `jxpChat` | Callable | Sunday chat (uses summaries) | ~$0.0004 |
| `updateRecentJournalSummary` | onDocumentCreated | Summarize journals | ~$0.0001 |
| `updateHabitTaskSummaryScheduled` | Schedule (daily) | Summarize habits/tasks | ~$0.0001 |
| `compressSundayMemory` | Background | Compress old messages | ~$0.0001 |

---

## 🔄 Update Triggers

| Summary Type | Update Trigger |
|--------------|----------------|
| `profile_summary` | Rarely (manual or significant profile change) |
| `recent_journal_summary` | After 3 new journal entries OR every 7 days |
| `habit_task_summary` | Daily at midnight |
| `sunday_memory_summary` | After 5 conversations OR when chat > 25 messages |

---

## 💬 Message Retention

- **Keep:** Last 20 messages in full
- **Compress:** When total reaches 25 messages
- **Batch size:** Compress oldest 5 messages at a time
- **Storage:** Memory nodes in `sunday_memory_summary`
- **Max nodes:** 50 per user

---

## 🚀 Quick Deploy

```bash
# Build
cd functions && npm run build

# Deploy all
firebase deploy --only firestore:rules,firestore:indexes,functions

# Migrate
npm run migrate:summaries
```

---

## 🧪 Quick Test

```bash
# Test Sunday chat
# 1. Send message via app
# 2. Check logs
firebase functions:log --only jxpChat

# Test journal summary
# 1. Create 3 journal entries
# 2. Check logs
firebase functions:log --only updateRecentJournalSummary

# Check Firestore
# Navigate to: users/{userId}/summaries
# Should see 4 summary documents
```

---

## 🔍 Debug Commands

```bash
# View all function logs
firebase functions:log

# View specific function
firebase functions:log --only jxpChat

# View errors only
firebase functions:log --only-errors

# Check config
firebase functions:config:get

# Set OpenAI key
firebase functions:config:set openai.key="sk-..."
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `functions/src/sunday-new.ts` | Refactored jxpChat |
| `functions/src/summarization/journalSummary.ts` | Journal summarization |
| `functions/src/summarization/habitTaskSummary.ts` | Habit/task summarization |
| `functions/src/summarization/sundayMemory.ts` | Memory compression |
| `functions/src/lib/summaryUtils.ts` | Utility functions |
| `shared/types/summaries.ts` | Summary type definitions |
| `shared/types/sunday.ts` | Chat types |

---

## 🛡️ Security Rules Quick Reference

```javascript
// Summaries: read-only for users
match /summaries/{summaryType} {
  allow read: if isOwner(userId);
  allow write: if false; // Cloud Functions only
}

// Messages: immutable after creation
match /messages/{messageId} {
  allow create: if isOwner(userId);
  allow update, delete: if false; // Cloud Functions only
}
```

---

## 📊 Token Budget

| Component | Tokens |
|-----------|--------|
| System prompt | ~200 |
| Profile summary | ~100 |
| Journal summary | ~250 |
| Habit/task summary | ~200 |
| Memory summary | ~400 |
| Recent messages | ~800 |
| User message | ~100 |
| **Total context** | **~2,050** |

---

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| Permission denied | `firebase deploy --only firestore:rules` |
| Missing index | `firebase deploy --only firestore:indexes` (wait 10 min) |
| OpenAI error | Check API key: `firebase functions:config:get openai.key` |
| Summary not generating | Check `aiDataConsent.journalAnalysisEnabled: true` |

---

## 📞 Monitoring URLs

- **Firebase Console:** https://console.firebase.google.com
- **OpenAI Usage:** https://platform.openai.com/usage
- **Function Logs:** Firebase Console → Functions → Logs

---

## 🔗 Documentation Links

- **Full Architecture:** `SUNDAY_ARCHITECTURE.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`
- **Deployment Checklist:** `functions/DEPLOYMENT_CHECKLIST.md`

---

## 💡 Quick Tips

1. **Always check token counts** in summaries - should be < 2,000 total
2. **Monitor OpenAI dashboard** daily for first week
3. **Run migration script** before going live
4. **Test with emulators first** before production deploy
5. **Keep an eye on scheduled function** - runs daily at midnight

---

## 📈 Expected Performance

| Metric | Expected Value |
|--------|----------------|
| Sunday chat response time | < 5 seconds |
| Journal summary generation | < 15 seconds |
| Memory compression | < 10 seconds |
| Context loading time | < 1 second |

---

## ✅ Health Check

Quick validation that everything is working:

```bash
# 1. Check functions deployed
firebase functions:list

# 2. Send test Sunday message
# (via app)

# 3. Check it worked
firebase functions:log --only jxpChat | grep "Successfully responded"

# 4. Verify summaries exist
# (in Firestore Console: users/{userId}/summaries)
```

---

**Reference Version:** 1.0.0
**Last Updated:** December 2, 2025
