/**
 * Examples of using UserData context throughout your app
 *
 * These are real-world examples showing how to access and display
 * user data in different components.
 */

import { useState } from "react";
import { useUserData } from "@/context/UserDataContext";

// ============================================================================
// Example 1: Simple Profile Display
// ============================================================================

export function SimpleProfile() {
  const { userData, loading } = useUserData();

  if (loading) return <div>Loading profile...</div>;
  if (!userData) return <div>Not logged in</div>;

  return (
    <div className="profile">
      <img src={userData.profilePicture} alt={userData.username} />
      <h2>{userData.username}</h2>
      <p>Level {userData.level} - {userData.rank}</p>
    </div>
  );
}

// ============================================================================
// Example 2: XP Progress Bar
// ============================================================================

export function XPProgressBar() {
  const { userData } = useUserData();

  if (!userData) return null;

  const progress = (userData.xp / userData.xpNeededToNextLevel) * 100;

  return (
    <div className="xp-progress">
      <div className="progress-header">
        <span>Level {userData.level}</span>
        <span>{userData.xp} / {userData.xpNeededToNextLevel} XP</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="next-level">
        {userData.xpNeededToNextLevel - userData.xp} XP to Level {userData.level + 1}
      </p>
    </div>
  );
}

// ============================================================================
// Example 3: Stats Dashboard
// ============================================================================

export function StatsDashboard() {
  const { userData } = useUserData();

  if (!userData) return null;

  return (
    <div className="stats-dashboard">
      {/* Overview Stats */}
      <div className="stat-card">
        <h3>Overview</h3>
        <div className="stat-item">
          <span>Level:</span>
          <strong>{userData.level}</strong>
        </div>
        <div className="stat-item">
          <span>Rank:</span>
          <strong>{userData.rank}</strong>
        </div>
        <div className="stat-item">
          <span>Streak:</span>
          <strong>{userData.streak} days 🔥</strong>
        </div>
        <div className="stat-item">
          <span>Total XP:</span>
          <strong>{userData.totalXP.toLocaleString()}</strong>
        </div>
      </div>

      {/* Journal Stats */}
      {userData.journalStats && (
        <div className="stat-card">
          <h3>📔 Journal Stats</h3>
          <div className="stat-item">
            <span>Total Entries:</span>
            <strong>{userData.journalStats.totalJournalEntries}</strong>
          </div>
          <div className="stat-item">
            <span>Total Words:</span>
            <strong>{userData.journalStats.totalWordCount.toLocaleString()}</strong>
          </div>
          <div className="stat-item">
            <span>Avg Entry Length:</span>
            <strong>{userData.journalStats.averageEntryLength} words</strong>
          </div>
          {userData.journalStats.mostUsedWords.length > 0 && (
            <div className="stat-item">
              <span>Top Words:</span>
              <div className="word-tags">
                {userData.journalStats.mostUsedWords.slice(0, 5).map(word => (
                  <span key={word} className="word-tag">{word}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Stats */}
      {userData.taskStats && (
        <div className="stat-card">
          <h3>✅ Task Stats</h3>
          <div className="stat-item">
            <span>Completed:</span>
            <strong>{userData.taskStats.currentTasksCompleted}</strong>
          </div>
          <div className="stat-item">
            <span>Pending:</span>
            <strong>{userData.taskStats.currentTasksPending}</strong>
          </div>
          <div className="stat-item">
            <span>Completion Rate:</span>
            <strong>{userData.taskStats.completionRate.toFixed(1)}%</strong>
          </div>
          <div className="stat-item priority-breakdown">
            <span>By Priority:</span>
            <div>
              🔴 High: {userData.taskStats.priorityCompletion.high} |{" "}
              🟡 Medium: {userData.taskStats.priorityCompletion.medium} |{" "}
              🟢 Low: {userData.taskStats.priorityCompletion.low}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 4: Header with User Info
// ============================================================================

export function AppHeader() {
  const { userData, loading } = useUserData();

  return (
    <header className="app-header">
      <div className="logo">JournalXP</div>

      {loading ? (
        <div className="user-skeleton">Loading...</div>
      ) : userData ? (
        <div className="user-menu">
          <div className="user-info">
            <span className="username">{userData.username}</span>
            <span className="level-badge">Lv {userData.level}</span>
          </div>
          <img
            src={userData.profilePicture || "/default-avatar.png"}
            alt={userData.username}
            className="avatar"
          />
        </div>
      ) : (
        <button className="login-btn">Log In</button>
      )}
    </header>
  );
}

// ============================================================================
// Example 5: Conditional Rendering Based on Level
// ============================================================================

export function FeatureUnlock() {
  const { userData } = useUserData();

  if (!userData) return null;

  const canAccessAdvancedFeatures = userData.level >= 5;
  const canAccessPremiumFeatures = userData.level >= 10;

  return (
    <div className="features">
      {/* Always available */}
      <Feature name="Basic Journaling" unlocked />
      <Feature name="Daily Tasks" unlocked />

      {/* Level 5+ */}
      <Feature
        name="Habit Tracking"
        unlocked={canAccessAdvancedFeatures}
        unlockLevel={5}
      />

      {/* Level 10+ */}
      <Feature
        name="Advanced Analytics"
        unlocked={canAccessPremiumFeatures}
        unlockLevel={10}
      />
    </div>
  );
}

function Feature({
  name,
  unlocked,
  unlockLevel
}: {
  name: string;
  unlocked: boolean;
  unlockLevel?: number;
}) {
  return (
    <div className={`feature ${unlocked ? 'unlocked' : 'locked'}`}>
      <span>{name}</span>
      {!unlocked && unlockLevel && (
        <span className="unlock-hint">🔒 Unlock at Level {unlockLevel}</span>
      )}
    </div>
  );
}

// ============================================================================
// Example 6: Updating Username
// ============================================================================

export function UsernameEditor() {
  const { userData, updateUsername } = useUserData();
  const [newUsername, setNewUsername] = useState("");
  const [saving, setSaving] = useState(false);

  if (!userData) return null;

  const handleSave = async () => {
    if (!newUsername.trim()) return;

    setSaving(true);
    try {
      await updateUsername(newUsername);
      alert("Username updated!");
      setNewUsername("");
    } catch (error) {
      alert("Failed to update username");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="username-editor">
      <p>Current username: <strong>{userData.username}</strong></p>
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="New username"
        disabled={saving}
      />
      <button onClick={handleSave} disabled={saving || !newUsername.trim()}>
        {saving ? "Saving..." : "Update Username"}
      </button>
    </div>
  );
}

// ============================================================================
// Example 7: Refreshing Data After Actions
// ============================================================================

export function TaskCompleter() {
  const { refreshUserData } = useUserData();
  const [completing, setCompleting] = useState(false);

  const handleCompleteTask = async (taskId: string) => {
    setCompleting(true);
    try {
      // Complete the task via your API
      await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });

      // Refresh user data to get updated XP, stats, etc.
      await refreshUserData();

      alert("Task completed! XP earned!");
    } catch (error) {
      alert("Failed to complete task");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <button
      onClick={() => handleCompleteTask("task-123")}
      disabled={completing}
    >
      {completing ? "Completing..." : "Complete Task"}
    </button>
  );
}

// ============================================================================
// Example 8: Streak Display
// ============================================================================

export function StreakCounter() {
  const { userData } = useUserData();

  if (!userData) return null;

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it up!";
    if (streak < 7) return "You're on fire! 🔥";
    if (streak < 30) return "Impressive streak! 🌟";
    return "Legendary dedication! 👑";
  };

  return (
    <div className="streak-counter">
      <div className="streak-number">
        <span className="emoji">🔥</span>
        <span className="count">{userData.streak}</span>
        <span className="label">Day Streak</span>
      </div>
      <p className="streak-message">{getStreakMessage(userData.streak)}</p>
    </div>
  );
}
