# UserData Context Guide

## Quick Start

```tsx
import { useUserData } from "@/context/UserDataContext";

function MyComponent() {
  const { userData, loading, refreshUserData, updateUsername } = useUserData();

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>Please log in</div>;

  return <div>Welcome, {userData.username}!</div>;
}
```

## User Data Structure

```typescript
interface UserClient {
  // Core Info
  username: string;              // Display name
  profilePicture?: string;       // Profile photo URL

  // Progression
  level: number;                 // Current level (default: 1)
  xp: number;                    // Current XP in level
  totalXP: number;               // Total XP accumulated
  xpNeededToNextLevel: number;   // XP required for next level
  rank: string;                  // Rank badge (e.g., "Bronze III")
  streak: number;                // Daily streak count

  // Journal Statistics
  journalStats?: {
    journalCount: number;
    totalJournalEntries: number;
    totalWordCount: number;
    averageEntryLength: number;
    mostUsedWords: string[];
  };

  // Task Statistics
  taskStats?: {
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

## Available Methods

### `userData`
The user object containing all user data. Will be `null` if not logged in.

```tsx
const { userData } = useUserData();

if (userData) {
  console.log(userData.username);
  console.log(userData.level);
  console.log(userData.xp);
}
```

### `loading`
Boolean indicating if user data is being fetched.

```tsx
const { loading } = useUserData();

if (loading) {
  return <Spinner />;
}
```

### `refreshUserData()`
Manually refresh user data from the server. Useful after completing actions that change user stats.

```tsx
const { refreshUserData } = useUserData();

async function completeTask(taskId: string) {
  await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
  await refreshUserData(); // Get updated XP and stats
}
```

### `updateUsername(newName: string)`
Update the user's username.

```tsx
const { updateUsername } = useUserData();

async function changeName(newName: string) {
  await updateUsername(newName);
  // userData will be automatically updated
}
```

## Common Use Cases

### 1. Display User Profile
```tsx
function UserProfile() {
  const { userData } = useUserData();
  if (!userData) return null;

  return (
    <div>
      <img src={userData.profilePicture} alt={userData.username} />
      <h2>{userData.username}</h2>
      <p>Level {userData.level} - {userData.rank}</p>
      <p>🔥 {userData.streak} day streak</p>
    </div>
  );
}
```

### 2. Show XP Progress
```tsx
function XPBar() {
  const { userData } = useUserData();
  if (!userData) return null;

  const progress = (userData.xp / userData.xpNeededToNextLevel) * 100;

  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <span>{userData.xp} / {userData.xpNeededToNextLevel} XP</span>
    </div>
  );
}
```

### 3. Show Journal Stats
```tsx
function JournalStats() {
  const { userData } = useUserData();
  if (!userData?.journalStats) return null;

  return (
    <div>
      <h3>Your Journal</h3>
      <p>📔 {userData.journalStats.totalJournalEntries} entries</p>
      <p>📝 {userData.journalStats.totalWordCount} words written</p>
      <p>📊 {userData.journalStats.averageEntryLength} avg words/entry</p>
    </div>
  );
}
```

### 4. Show Task Completion Rate
```tsx
function TaskProgress() {
  const { userData } = useUserData();
  if (!userData?.taskStats) return null;

  const { currentTasksCompleted, currentTasksCreated, completionRate } = userData.taskStats;

  return (
    <div>
      <h3>Task Progress</h3>
      <p>✅ {currentTasksCompleted} / {currentTasksCreated} completed</p>
      <p>📈 {completionRate.toFixed(1)}% completion rate</p>
    </div>
  );
}
```

### 5. Refresh After Action
```tsx
function CompleteTaskButton({ taskId }: { taskId: string }) {
  const { refreshUserData } = useUserData();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      // Complete the task
      await authFetch(`/tasks/${taskId}/complete`, { method: "POST" });

      // Refresh to get updated XP and stats
      await refreshUserData();

      alert("Task completed! +50 XP");
    } catch (error) {
      console.error("Failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleComplete} disabled={loading}>
      {loading ? "Completing..." : "Complete Task"}
    </button>
  );
}
```

### 6. Conditional Features by Level
```tsx
function FeatureGate({ requiredLevel, children }: { requiredLevel: number; children: React.ReactNode }) {
  const { userData } = useUserData();

  if (!userData) return null;

  if (userData.level < requiredLevel) {
    return (
      <div className="locked-feature">
        🔒 Unlock at Level {requiredLevel}
      </div>
    );
  }

  return <>{children}</>;
}

// Usage:
<FeatureGate requiredLevel={5}>
  <AdvancedAnalytics />
</FeatureGate>
```

## Data Flow

1. **User logs in** → Firebase Auth detects auth state change
2. **UserDataContext** calls `/api/session/init` automatically
3. **Backend** creates/updates user in Firestore, returns `UserClient` object
4. **Frontend** stores data in context, available via `useUserData()`
5. **Components** access `userData` anywhere in the app

## When Data Refreshes

### Automatic Refresh
- On login
- On auth state change

### Manual Refresh (you need to call `refreshUserData()`)
- After completing a task (to get new XP)
- After writing a journal entry (to update stats)
- After any action that changes user data

## Type Safety

The `UserClient` type is shared between frontend and backend via:
```
shared/types/user.ts
```

This ensures type safety across your entire app!

## Examples

Check out `frontend/src/examples/UserDataExamples.tsx` for 8 real-world examples including:
- Profile displays
- XP progress bars
- Stats dashboards
- Username editing
- Feature unlocks
- Streak counters

## Troubleshooting

### "userData is null"
User is not logged in. Check authentication first.

### "userData is stale"
Call `refreshUserData()` to fetch latest from server.

### "Cannot find useUserData"
Make sure you're importing from the correct path:
```tsx
import { useUserData } from "@/context/UserDataContext";
```

### "Hook error"
Make sure `UserDataProvider` wraps your component tree in `App.tsx`:
```tsx
<UserDataProvider>
  <YourApp />
</UserDataProvider>
```
