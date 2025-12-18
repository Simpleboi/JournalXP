# Sunday AI - Summary-Based Architecture

## Overview

This document describes the complete backend architecture for Sunday, the emotional reasoning AI inside JournalXP. The architecture is designed for **extremely low token usage**, **minimal API costs**, and **scalability to thousands of users**.

## Key Principles

✅ **Never send raw journal entries to the model**
✅ **Summaries are hierarchical and time-windowed**
✅ **Old conversations compress into memory nodes**
✅ **Cloud Functions automate all summarization**
✅ **Firestore indexes optimize for read patterns**

---

## Architecture Summary

### Token Usage Comparison

| Architecture | Tokens per Chat | Cost per Message |
|--------------|-----------------|------------------|
| **Old (Raw History)** | ~10,000+ tokens | ~$0.002 |
| **New (Summary-Based)** | ~1,800 tokens | ~$0.0004 |

**Savings: 82% reduction in token usage and cost**

### Data Flow

```
User Action → Cloud Function → Summary Generation → Storage
                                        ↓
Sunday Chat → Load Summaries → AI Response → Save Messages → Compression (if needed)
```

---

## Firestore Collections

### 1. `/users/{userId}`

**Purpose:** Core user profile with AI consent and summary metadata

**Key Fields:**
```typescript
{
  uid: string;
  email: string;
  level: number;
  rank: string;

  // AI Consent
  aiDataConsent: {
    sundayEnabled: boolean;
    journalAnalysisEnabled: boolean;
    habitAnalysisEnabled: boolean;
    consentTimestamp: string;
    lastUpdated: string;
  };

  // Summary Tracking
  summaryStatus: {
    lastJournalSummaryUpdate: string;
    lastHabitTaskSummaryUpdate: string;
    lastSundayMemoryUpdate: string;
    profileSummaryVersion: number;
  };

  sundayConversationCount: number;
  totalSundayMessages: number;
  lastSundayChat: string;
}
```

---

### 2. `/users/{userId}/journalEntries/{entryId}`

**Purpose:** Raw journal data (NEVER sent to AI models)

**Key Fields:**
```typescript
{
  id: string;
  userId: string;
  content: string;           // NEVER sent to AI
  mood: string;
  type: "free" | "guided" | "gratitude";
  wordCount: number;
  tags: string[];

  // Summarization tracking
  isPrivate: boolean;
  includedInLastSummary: boolean;
  lastSummarizedAt?: string;

  createdAt: string;
  updatedAt: string;
}
```

**Firestore Indexes Required:**
- `[userId, createdAt DESC]`
- `[isPrivate, includedInLastSummary, createdAt DESC]`
- `[userId, mood, createdAt DESC]`

---

### 3. `/users/{userId}/tasks/{taskId}` & `/users/{userId}/habits/{habitId}`

Standard task and habit collections (no schema changes needed).

---

### 4. `/users/{userId}/sundayChats/{chatId}`

**Purpose:** Chat session metadata

**Schema:**
```typescript
{
  id: string;
  userId: string;
  title?: string;
  startedAt: string;
  lastMessageAt: string;
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  messagesRetained: number;
  summarizedMessageCount: number;
  lastSummarizedAt?: string;
  isActive: boolean;
}
```

---

### 5. `/users/{userId}/sundayChats/{chatId}/messages/{messageId}`

**Purpose:** Rolling window of recent messages (keep last 20, summarize older)

**Schema:**
```typescript
{
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  tokenCount?: number;
  isSummarized: boolean;
  summarizedInto?: string;
}
```

**Retention Policy:**
- Keep last **20 messages** in full
- When count exceeds **25**, compress oldest 5 into memory
- Delete compressed messages

**Firestore Indexes Required:**
- `[chatId, timestamp ASC]`
- `[chatId, timestamp DESC]`
- `[chatId, isSummarized, timestamp ASC]`

---

### 6. `/users/{userId}/summaries/{summaryType}`

**Purpose:** Compressed, token-efficient representations of user data

#### Summary Types

##### A. `profile_summary` (~100-200 tokens)

```typescript
{
  type: "profile_summary";
  userId: string;
  summary: string; // Main profile description
  version: number;
  generatedAt: string;
  tokenCount: number;
  basedOn: {
    userLevel: number;
    totalJournals: number;
    dominantMoods: string[];
  };
}
```

**Update Trigger:** Rarely (when profile changes significantly)

##### B. `recent_journal_summary` (~200-300 tokens)

```typescript
{
  type: "recent_journal_summary";
  userId: string;
  summary: string; // AI-generated pattern summary
  windowStart: string; // 7-14 days ago
  windowEnd: string;
  entriesAnalyzed: number;
  dominantMoods: { mood: string; count: number }[];
  recurringThemes: string[];
  positivePatterns: string[];
  concerningPatterns: string[];
  totalWordCount: number;
  averageWordCount: number;
  generatedAt: string;
  tokenCount: number;
}
```

**Update Trigger:** After every **3 new journal entries** OR every **7 days**

##### C. `habit_task_summary` (~150-250 tokens)

```typescript
{
  type: "habit_task_summary";
  userId: string;
  summary: string;
  activeHabits: Array<{
    title: string;
    frequency: string;
    currentStreak: number;
    category: string;
  }>;
  taskStats: {
    pending: number;
    completedThisWeek: number;
    highPriority: number;
  };
  weeklyCompletionRate: number;
  strongestHabit?: string;
  strugglingHabit?: string;
  generatedAt: string;
  tokenCount: number;
}
```

**Update Trigger:** Daily at midnight OR after **3 habit completions**

##### D. `sunday_memory_summary` (~300-400 tokens)

```typescript
{
  type: "sunday_memory_summary";
  userId: string;
  summary: string; // Cohesive therapeutic narrative
  memoryNodes: Array<{
    id: string;
    theme: string;
    createdFrom: string[]; // chatIds
    summary: string; // 50-100 tokens
    timestamp: string;
  }>;
  effectiveTechniques: string[];
  userPreferences: string[];
  triggerPatterns: string[];
  progressAreas: string[];
  conversationsIncluded: number;
  lastConversationDate: string;
  generatedAt: string;
  tokenCount: number;
}
```

**Update Trigger:** After every **5 Sunday conversations** OR when chat exceeds **25 messages**

---

## Cloud Functions

### 1. `updateRecentJournalSummary`

**Trigger:** `onDocumentCreated("users/{userId}/journalEntries/{entryId}")`

**Process:**
1. Check if user has `journalAnalysisEnabled` consent
2. Count unsummarized entries (where `includedInLastSummary == false`)
3. If count >= 3:
   - Fetch last 7 days of entries (metadata only, NO content)
   - Extract moods, themes, word counts
   - Call GPT-4o-mini to generate summary
   - Save to `summaries/recent_journal_summary`
   - Mark entries as `includedInLastSummary = true`

**Cost:** ~$0.0001 per run

**Location:** `functions/src/summarization/journalSummary.ts`

---

### 2. `updateHabitTaskSummaryScheduled`

**Trigger:** `onSchedule("0 0 * * *")` (daily at midnight)

**Process:**
1. Find users active in last 24 hours
2. For each user:
   - Fetch active habits
   - Fetch task stats (pending, completed this week)
   - Calculate weekly completion rate
   - Call GPT-4o-mini to generate summary
   - Save to `summaries/habit_task_summary`

**Cost:** ~$0.0001 per user per day

**Location:** `functions/src/summarization/habitTaskSummary.ts`

---

### 3. `compressSundayMemory`

**Trigger:** Called from `jxpChat` when message count > 25

**Process:**
1. Get oldest 5 unsummarized messages
2. Combine into conversation snippet
3. Call GPT-4o-mini to create memory node (50-100 words)
4. Extract theme using keyword analysis
5. Load existing `sunday_memory_summary`
6. Add new memory node
7. Regenerate full summary (synthesize all nodes)
8. Save updated summary
9. Delete compressed messages

**Cost:** ~$0.0001 per compression

**Location:** `functions/src/summarization/sundayMemory.ts`

---

### 4. `jxpChat` (Refactored)

**Trigger:** Callable function (user sends message to Sunday)

**Process:**
1. Authenticate user and check AI consent
2. Get or create chat session
3. **Load context (summary-based):**
   - `summaries/profile_summary`
   - `summaries/recent_journal_summary`
   - `summaries/habit_task_summary`
   - `summaries/sunday_memory_summary`
   - Last 20 messages from current chat
4. Build prompt with summaries (~1,800 tokens total)
5. Call GPT-4o-mini
6. Save user message and assistant response
7. Update chat metadata
8. If `totalMessages >= 25`, trigger `compressSundayMemory`

**Cost:** ~$0.0004 per message

**Location:** `functions/src/sunday-new.ts`

---

## Utility Functions

**Location:** `functions/src/lib/summaryUtils.ts`

### Key Functions

| Function | Purpose |
|----------|---------|
| `estimateTokens(text)` | Estimates token count (~4 chars/token) |
| `extractTheme(text)` | Extracts dominant theme using keyword matching |
| `extractThemes(metadata)` | Finds recurring themes from journal tags |
| `getWeekStart()` | Returns start of current week |
| `calculateCompletionRate(habits)` | Calculates weekly habit completion % |
| `truncateToTokens(text, max)` | Truncates text to fit token budget |
| `sanitizeInput(input)` | Prevents prompt injection attacks |
| `summarizeMoods(moods)` | Converts mood counts to readable summary |

---

## Firestore Security Rules

**Location:** `firestore.rules`

### Key Rules

```javascript
// Summaries are READ-ONLY for users
match /summaries/{summaryType} {
  allow read: if isOwner(userId);
  allow write: if false; // Only Cloud Functions can write
}

// Messages are immutable after creation
match /messages/{messageId} {
  allow read: if isOwner(userId);
  allow create: if isOwner(userId) && validMessage();
  allow update: if false;
  allow delete: if false; // Only Cloud Functions can delete
}

// Journal entries support privacy flag
match /journalEntries/{entryId} {
  allow read: if isOwner(userId);
  allow create: if isOwner(userId) && hasRequiredFields();
  allow update: if isOwner(userId);
  allow delete: if isOwner(userId);
}
```

---

## Migration Guide

### Step 1: Deploy Updated Code

```bash
cd functions
npm run build
firebase deploy --only functions
```

This deploys:
- `jxpChat` (refactored)
- `updateRecentJournalSummary`
- `updateHabitTaskSummaryScheduled`

### Step 2: Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 3: Backfill Existing Users

Run the migration script to create summaries for existing users:

```bash
cd functions
npx ts-node src/scripts/backfillSummaries.ts
```

This creates:
- `profile_summary` for all users
- `recent_journal_summary` (empty if no recent journals)
- `habit_task_summary`
- `sunday_memory_summary`
- Sets `aiDataConsent` defaults
- Initializes `summaryStatus`

### Step 4: Update Frontend (Optional)

The frontend will automatically work with the new backend. No changes required unless you want to:
- Add UI for AI consent toggles
- Display summary status to users
- Show memory compression indicators

---

## Cost Projections

### For 1,000 Daily Active Users

**Assumptions:**
- 2 journal entries/user/week
- 1 Sunday chat/user/week (10 messages)
- 3 habit completions/user/week

**Monthly Costs:**

| Service | Volume | Cost |
|---------|--------|------|
| Journal Summaries | 2,667 calls | $0.16 |
| Sunday Chats | 10,000 messages | $4.60 |
| Memory Compression | 2,000 calls | $0.06 |
| Habit/Task Summaries | 30,000 calls | $1.20 |
| **AI Total** | | **$6.02** |
| Firestore | | $5-10 |
| Cloud Functions | | $2 |
| **Grand Total** | | **~$13-18/month** |

### For 10,000 Daily Active Users

- **AI Costs:** ~$60-80/month
- **Firestore:** ~$50-100/month
- **Cloud Functions:** ~$20/month
- **Total:** ~$130-200/month

---

## Optimization Strategies

### Current (Implemented)

✅ Use GPT-4o-mini for all summarization
✅ Summary-based context loading
✅ Rolling message window (20 kept, rest compressed)
✅ Automated background summarization
✅ Token budget limits (~1,800 per chat)

### Future Optimizations (If Needed)

- Batch summarizations (weekly instead of per-entry)
- Use Claude Haiku for even cheaper summarization
- Cache summaries longer (update every 2 weeks)
- Tiered features (free: 5 chats/month, premium: unlimited)
- Compress more aggressively (keep only 10 messages)

---

## Monitoring & Debugging

### Check Summary Status

```typescript
const summaryStatus = await db
  .collection("users/{userId}/summaries")
  .get();

summaryStatus.docs.forEach(doc => {
  console.log(doc.id, doc.data().generatedAt);
});
```

### Check Message Retention

```typescript
const chat = await db
  .collection("users/{userId}/sundayChats/{chatId}")
  .get();

console.log("Messages retained:", chat.data().messagesRetained);
console.log("Messages summarized:", chat.data().summarizedMessageCount);
```

### Monitor Token Usage

```typescript
const summaries = await db
  .collection("users/{userId}/summaries")
  .get();

const totalTokens = summaries.docs.reduce(
  (sum, doc) => sum + (doc.data().tokenCount || 0),
  0
);

console.log("Total context tokens:", totalTokens);
```

---

## Troubleshooting

### Problem: Summaries not generating

**Check:**
1. User has `aiDataConsent` enabled
2. Enough data exists (3+ journal entries, etc.)
3. Cloud Functions deployed correctly
4. OpenAI API key is set

### Problem: Messages not compressing

**Check:**
1. Message count >= 25
2. `compressSundayMemory` function deployed
3. Check Cloud Function logs for errors

### Problem: High token usage

**Check:**
1. Summary token counts (should be < 2,000 total)
2. Message retention count (should be <= 20)
3. Old conversations properly compressed

---

## API Endpoints (No Changes)

All existing API endpoints remain unchanged:
- `POST /api/journals` - Creates journal entry (triggers summary)
- `POST /api/tasks/:id/complete` - Completes task (triggers summary)
- `POST /api/habits/:id/complete` - Completes habit (triggers summary)
- `jxpChat` callable function - Sunday chat (now uses summaries)

---

## Files Changed/Added

### New Files

```
functions/src/
├── sunday-new.ts (refactored jxpChat)
├── lib/summaryUtils.ts (utility functions)
├── summarization/
│   ├── journalSummary.ts
│   ├── habitTaskSummary.ts
│   └── sundayMemory.ts
└── scripts/
    └── backfillSummaries.ts

shared/types/
├── summaries.ts (all summary interfaces)
└── sunday.ts (chat session types)
```

### Modified Files

```
functions/src/
├── index.ts (export new functions)
└── routes/journals.ts (add summarization flags)

shared/types/
└── user.ts (add aiDataConsent, summaryStatus)

firestore.rules (add summaries rules)
firestore.indexes.json (add new indexes)
```

---

## Next Steps

1. ✅ Deploy Cloud Functions
2. ✅ Deploy Firestore rules and indexes
3. ✅ Run backfill migration script
4. Test with a few users
5. Monitor token usage and costs
6. Optimize based on real usage patterns
7. Consider adding UI for AI consent management

---

## Support

For questions or issues:
- Check Cloud Function logs in Firebase Console
- Review Firestore security rules
- Verify indexes are created
- Test with emulators first

**Last Updated:** December 2, 2025
**Architecture Version:** 1.0.0
