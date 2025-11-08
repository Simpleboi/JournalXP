# User Shape Data Flow

This document explains the complete user data flow from Firestore → Backend → Client.

---

## 📊 Complete Data Flow

```md

┌─────────────────┐
│   Firestore     │  Raw database document
│   (Database)    │  Contains: uid, email, timestamps, etc.
└────────┬────────┘
         │ API reads document
         ▼
┌─────────────────┐
│  toUserClient() │  Sanitization function
│   (Backend)     │  Removes sensitive data, adds defaults
└────────┬────────┘
         │ Returns UserClient
         ▼
┌─────────────────┐
│   UserClient    │  Safe, sanitized data
│   (Frontend)    │  No uid, email, or sensitive fields
└─────────────────┘
```

---

## 1️⃣ What's Stored in Firestore

**Location**: Firebase Firestore → `users` collection → `{uid}` document

**Full Document Shape** (what's actually in the database):

```typescript
{
  // Sensitive fields (NOT sent to client)
  uid: string;                    // Firebase user ID
  email: string | null;           // User email
  createdAt: Timestamp;           // Firestore timestamp
  updatedAt: Timestamp;           // Firestore timestamp
  lastLogin: Timestamp;           // Firestore timestamp
  joinDate: Timestamp;            // Firestore timestamp

  // Public fields (sent to client)
  username: string;               // Display name
  displayName: string | null;     // Alternative name
  profilePicture: string | null;  // Photo URL
  level: number;                  // Current level
  xp: number;                     // Current XP
  totalXP: number;                // Total XP earned
  xpNeededToNextLevel: number;    // XP for next level
  streak: number;                 // Daily streak
  rank: string;                   // Rank badge

  // Stats objects
  journalStats: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };

  taskStats: {
    totalTasksCompleted: number;
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number;
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
  };
}
```

**File**: Created by `createDefaultUserData()` in `functions/src/routes/session.ts:61`

---

## 2️⃣ What the API Receives (Raw Firestore Data)

When your backend reads from Firestore:

```typescript
// In functions/src/routes/session.ts
const userRef = db.collection("users").doc(uid);
const snapshot = await userRef.get();
const userData = snapshot.data(); // ← Gets EVERYTHING from Firestore
```

This `userData` object contains:

- ✅ All public fields
- ⚠️ Sensitive fields (uid, email, timestamps)
- ⚠️ Internal fields (createdAt, updatedAt)

---

## 3️⃣ How It's Sanitized (toUserClient Function)

**Location**: `functions/src/routes/session.ts:30-57`

The `toUserClient()` function **removes sensitive data** and returns only safe fields:

```typescript
function toUserClient(doc: any): UserClient {
  return {
    // ✅ Safe public fields only
    username: doc.username ?? doc.displayName ?? "New User",
    level: doc.level ?? 1,
    xp: doc.xp ?? 0,
    totalXP: doc.totalXP ?? 0,
    xpNeededToNextLevel: doc.xpNeededToNextLevel ?? 100,
    streak: doc.streak ?? 0,
    rank: doc.rank ?? "Bronze III",
    profilePicture: doc.profilePicture ?? doc.photoURL ?? doc.photoUrl ?? undefined,
    journalStats: doc.journalStats ?? { /* defaults */ },
    taskStats: doc.taskStats ?? { /* defaults */ },
  };
  // ❌ REMOVED: uid, email, createdAt, updatedAt, lastLogin, joinDate
}
```

**What's stripped out:**

- ❌ `uid` - Firebase user ID (security risk)
- ❌ `email` - User email (privacy)
- ❌ `createdAt`, `updatedAt`, `lastLogin`, `joinDate` - Timestamps
- ❌ Any other internal fields

**What's kept:**

- ✅ Public profile data (username, level, xp, rank, etc.)
- ✅ Stats (journal and task statistics)
- ✅ Safe metadata (streak, profile picture)

---

## 4️⃣ What's Sent to the Client (UserClient)

**Location**: `shared/types/user.ts:2-31`

**Type Definition**:

```typescript
export interface UserClient {
  username: string;
  level: number;
  xp: number;
  totalXP: number;
  xpNeededToNextLevel: number;
  streak: number;
  rank: string;
  profilePicture?: string;
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };
  taskStats?: {
    totalTasksCompleted: number;
    currentTasksCreated: number;
    currentTasksCompleted: number;
    currentTasksPending: number;
    completionRate: number;
    avgCompletionTime?: number;
    priorityCompletion: {
      high: number;
      medium: number;
      low: number;
    };
  };
}
```

**API Response Format**:
```json
{
  "user": {
    "username": "JohnDoe",
    "level": 5,
    "xp": 250,
    "totalXP": 1250,
    "xpNeededToNextLevel": 500,
    "streak": 7,
    "rank": "Silver II",
    "profilePicture": "https://...",
    "journalStats": {
      "journalCount": 3,
      "totalJournalEntries": 45,
      "totalWordCount": 12500,
      "averageEntryLength": 277,
      "mostUsedWords": ["grateful", "happy", "work"]
    },
    "taskStats": {
      "totalTasksCompleted": 128,
      "currentTasksCreated": 15,
      "currentTasksCompleted": 12,
      "currentTasksPending": 3,
      "completionRate": 85.5,
      "priorityCompletion": {
        "high": 45,
        "medium": 60,
        "low": 23
      }
    }
  },
  "sessionCookie": false,
  "message": "Session refreshed"
}
```

---

## 📁 Key Files Reference

### Type Definitions
- **`shared/types/user.ts`** - Defines `UserClient` and `UserServer` types

### Backend Sanitization
- **`functions/src/routes/session.ts:30-57`** - `toUserClient()` sanitization function
- **`functions/src/routes/session.ts:61-92`** - `createDefaultUserData()` default values
- **`functions/src/routes/session.ts:114-211`** - `POST /session/init` endpoint

### Frontend Usage
- **`frontend/src/context/UserDataContext.tsx`** - React context that receives `UserClient`
- **`frontend/src/lib/initSession.ts`** - Calls `/session/init` API

---

## 🔒 Security: What's Hidden from Client

These fields are **NEVER sent to the frontend**:

| Field | Why Hidden | Risk if Exposed |
|-------|-----------|----------------|
| `uid` | Firebase user ID | Could be used to impersonate user or access their data |
| `email` | User email | Privacy violation, PII |
| `createdAt` | Account creation timestamp | Internal metadata |
| `updatedAt` | Last update timestamp | Internal metadata |
| `lastLogin` | Last login timestamp | Privacy concern |
| `joinDate` | Join date timestamp | Internal metadata (converted to ISO string in `UserServer`) |

---

## 🔄 Complete Request Flow Example

### Step 1: User Logs In
```typescript
// Frontend: firebase auth login
await signInWithPopup(auth, googleProvider);
```

### Step 2: Frontend Calls Session Init
```typescript
// frontend/src/lib/initSession.ts
const response = await authFetch("/session/init", { method: "POST" });
// Authorization: Bearer <firebase-id-token>
```

### Step 3: Backend Verifies Token
```typescript
// functions/src/middleware/requireAuth.ts
const decodedToken = await admin.auth().verifyIdToken(idToken);
// Attaches req.user = { uid, email, name, picture }
```

### Step 4: Backend Fetches User from Firestore
```typescript
// functions/src/routes/session.ts
const userRef = db.collection("users").doc(uid);
const snapshot = await userRef.get();
const userData = snapshot.data(); // ← Has EVERYTHING
```

### Step 5: Backend Sanitizes Data
```typescript
// functions/src/routes/session.ts:150
const clientUser = toUserClient({
  ...userData,
  joinDate: tsToIso(userData.joinDate), // Convert timestamp
  // ... other timestamp conversions
});
// ← Now only has safe fields
```

### Step 6: Backend Sends Response
```typescript
// functions/src/routes/session.ts:193-200
res.json({
  user: clientUser,  // ← Only UserClient fields
  sessionCookie: false,
  message: "Session refreshed"
});
```

### Step 7: Frontend Receives & Stores
```typescript
// frontend/src/context/UserDataContext.tsx:55
const user = await initSession();
setUserData(user); // ← Only has UserClient fields
```

### Step 8: Components Access Data
```typescript
// Any component
const { userData } = useUserData();
console.log(userData.username); // ✅ Available
console.log(userData.uid);      // ❌ undefined (not sent)
```

---

## 🎯 Key Takeaways

1. **Firestore** stores the full document with sensitive data
2. **`toUserClient()`** sanitizes and removes sensitive fields
3. **`UserClient`** is the safe, sanitized type sent to frontend
4. **Frontend** never sees `uid`, `email`, or timestamps
5. **Type safety** enforced via shared types in `shared/types/user.ts`

---

## 🛠️ How to Modify User Shape

If you want to add new fields:

### 1. Update Type Definition
```typescript
// shared/types/user.ts
export interface UserClient {
  // ... existing fields
  newField: string; // ← Add here
}
```

### 2. Update Default Values
```typescript
// functions/src/routes/session.ts:61
function createDefaultUserData(...) {
  return {
    // ... existing fields
    newField: "default value", // ← Add here
  };
}
```

### 3. Update Sanitization
```typescript
// functions/src/routes/session.ts:30
function toUserClient(doc: any): UserClient {
  return {
    // ... existing fields
    newField: doc.newField ?? "default", // ← Add here
  };
}
```

### 4. Frontend Automatically Gets It
```typescript
// Any component
const { userData } = useUserData();
console.log(userData.newField); // ✅ Available
```

---

## 📝 Summary Table

| Location | File | What It Contains |
|----------|------|------------------|
| **Firestore** | Database | Full document (includes sensitive data) |
| **Backend Read** | `session.ts:122-147` | Raw Firestore data (everything) |
| **Sanitization** | `session.ts:30-57` | `toUserClient()` removes sensitive fields |
| **API Response** | `session.ts:193-200` | Only `UserClient` fields (safe data) |
| **Frontend** | `UserDataContext.tsx` | Receives & stores `UserClient` |
| **Type Definition** | `shared/types/user.ts` | Defines `UserClient` interface |

---

## 🔍 Need to Debug User Data?

### Check what's in Firestore:
1. Go to [Firebase Console](https://console.firebase.google.com/project/journalxp-4ea0f/firestore)
2. Open `users` collection
3. Open your user document
4. See all fields (including sensitive ones)

### Check what's sent to frontend:
1. Open browser DevTools → Network tab
2. Find the `session/init` request
3. Click on it → Response tab
4. See the `user` object (only safe fields)

### Check what's in frontend context:
```javascript
// Browser console
window.userData = useUserData();
console.log(window.userData);
```
