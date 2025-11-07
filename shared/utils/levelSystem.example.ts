/**
 * Usage examples for the infinite level system
 *
 * This file demonstrates common use cases and integration patterns
 */

import {
  progressFromXp,
  addXp,
  formatProgress,
  listNextNThresholds,
  xpNeededForLevel,
  getProgressBar,
  type LevelState,
} from "./levelSystem";

// ============================================================================
// EXAMPLE 1: User completes a journal entry and gains XP
// ============================================================================

function handleJournalEntry(userState: LevelState): void {
  console.log("📝 User completed a journal entry!");

  const XP_PER_JOURNAL = 50;
  const newState = addXp(userState, XP_PER_JOURNAL);

  // Check if they leveled up
  if (newState.level > userState.level) {
    const levelsGained = newState.level - userState.level;
    console.log(`🎉 LEVEL UP! You reached Level ${newState.level}!`);
    console.log(`   You gained ${levelsGained} level(s)!`);
  }

  console.log(`✅ +${XP_PER_JOURNAL} XP`);
  console.log(`   ${formatProgress(newState)}`);
  console.log("");
}

// ============================================================================
// EXAMPLE 2: Display progress bar in UI
// ============================================================================

function renderUserProgress(userState: LevelState): string {
  const progress = progressFromXp(userState.xp);

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 User Profile
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Level: ${progress.level}
Total XP: ${progress.totalXp.toLocaleString()}

${getProgressBar(progress, 30)}

XP in this level: ${progress.xpInCurrentLevel} / ${progress.xpToNextLevel}
XP to next level: ${progress.xpRemaining}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}

// ============================================================================
// EXAMPLE 3: Show upcoming level costs (for motivation/UI)
// ============================================================================

function showNextLevelCosts(userState: LevelState): void {
  console.log("📊 Upcoming Level Costs:");
  console.log("");

  const thresholds = listNextNThresholds(userState.level, 5);

  thresholds.forEach((threshold) => {
    const needed = xpNeededForLevel(userState.xp, threshold.to);
    const status = needed === 0 ? "✓ Complete" : `${needed} XP needed`;

    console.log(
      `  Level ${threshold.from} → ${threshold.to}: ${threshold.cost} XP (${status})`
    );
  });

  console.log("");
}

// ============================================================================
// EXAMPLE 4: Gamification - Daily quest completion
// ============================================================================

interface Quest {
  name: string;
  xpReward: number;
  completed: boolean;
}

function completeDailyQuests(userState: LevelState, quests: Quest[]): LevelState {
  console.log("🎯 Daily Quests:");
  console.log("");

  let currentState = { ...userState };
  let totalXpEarned = 0;

  quests.forEach((quest) => {
    if (quest.completed) {
      console.log(`  ✓ ${quest.name} (+${quest.xpReward} XP)`);
      currentState = addXp(currentState, quest.xpReward);
      totalXpEarned += quest.xpReward;
    } else {
      console.log(`  ☐ ${quest.name} (${quest.xpReward} XP)`);
    }
  });

  console.log("");
  console.log(`  Total XP Earned: ${totalXpEarned}`);

  if (currentState.level > userState.level) {
    console.log(`  🎉 LEVEL UP! Level ${userState.level} → ${currentState.level}`);
  }

  console.log("");

  return currentState;
}

// ============================================================================
// EXAMPLE 5: Backend integration - Update user in database
// ============================================================================

interface UserDocument {
  uid: string;
  displayName: string;
  level: number;
  xp: number;
  // ... other fields
}

async function awardXpToUser(
  userId: string,
  xpAmount: number,
  reason: string
): Promise<{ leveledUp: boolean; newLevel: number; newXp: number }> {
  // 1. Fetch user from database (mock)
  const user: UserDocument = await fetchUserFromDB(userId);

  // 2. Calculate new state
  const oldState: LevelState = { level: user.level, xp: user.xp };
  const newState = addXp(oldState, xpAmount);

  // 3. Update database
  await updateUserInDB(userId, {
    level: newState.level,
    xp: newState.xp,
  });

  // 4. Log the event
  console.log(`📈 Awarded ${xpAmount} XP to ${user.displayName} for: ${reason}`);

  const leveledUp = newState.level > oldState.level;

  if (leveledUp) {
    console.log(`   🎉 Level up! ${oldState.level} → ${newState.level}`);

    // Trigger level-up notifications, achievements, etc.
    await sendLevelUpNotification(userId, newState.level);
  }

  return {
    leveledUp,
    newLevel: newState.level,
    newXp: newState.xp,
  };
}

// ============================================================================
// EXAMPLE 6: Frontend - React component integration
// ============================================================================

/**
 * Example React component showing level progress
 */
function LevelProgressComponent({ userState }: { userState: LevelState }) {
  const progress = progressFromXp(userState.xp);
  // Using progress in template string below

  return {
    jsx: `
    <div className="level-progress">
      <div className="level-header">
        <span className="level-badge">Level {progress.level}</span>
        <span className="xp-text">{progress.totalXp.toLocaleString()} XP</span>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: \`\${progress.percentToNext}%\` }}
        />
      </div>

      <div className="progress-details">
        <span>{progress.xpInCurrentLevel} / {progress.xpToNextLevel} XP</span>
        <span>{progress.percentToNext.toFixed(1)}%</span>
      </div>

      <p className="next-level-text">
        {progress.xpRemaining} XP to Level {progress.level + 1}
      </p>
    </div>
  `,
  };
}

// ============================================================================
// MOCK DATABASE FUNCTIONS (for demonstration)
// ============================================================================

async function fetchUserFromDB(userId: string): Promise<UserDocument> {
  // Mock implementation
  return {
    uid: userId,
    displayName: "Test User",
    level: 5,
    xp: 450,
  };
}

async function updateUserInDB(
  userId: string,
  updates: Partial<UserDocument>
): Promise<void> {
  // Mock implementation
  console.log(`   Database updated for user ${userId}:`, updates);
}

async function sendLevelUpNotification(
  userId: string,
  newLevel: number
): Promise<void> {
  // Mock implementation
  console.log(`   📧 Sent level-up notification to user ${userId} (Level ${newLevel})`);
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

function runExamples() {
  console.log("\n========================================");
  console.log("  INFINITE LEVEL SYSTEM - EXAMPLES");
  console.log("========================================\n");

  // Example 1: Journal entry
  console.log("Example 1: Journal Entry");
  console.log("─────────────────────────");
  let userState: LevelState = { level: 1, xp: 75 };
  handleJournalEntry(userState);
  handleJournalEntry(userState);

  // Example 2: Progress bar
  console.log("Example 2: User Progress Display");
  console.log("─────────────────────────────────");
  userState = { level: 7, xp: 863 };
  console.log(renderUserProgress(userState));
  console.log("");

  // Example 3: Next level costs
  console.log("Example 3: Upcoming Level Costs");
  console.log("────────────────────────────────");
  showNextLevelCosts(userState);

  // Example 4: Daily quests
  console.log("Example 4: Daily Quests");
  console.log("────────────────────────");
  userState = { level: 3, xp: 250 };
  const quests: Quest[] = [
    { name: "Write a journal entry", xpReward: 50, completed: true },
    { name: "Complete 3 tasks", xpReward: 75, completed: true },
    { name: "Maintain streak", xpReward: 25, completed: true },
    { name: "Feed your pet", xpReward: 20, completed: false },
  ];
  userState = completeDailyQuests(userState, quests);

  // Example 5: Backend XP award
  console.log("Example 5: Backend XP Award");
  console.log("───────────────────────────");
  awardXpToUser("user123", 100, "Completed daily challenge").then(() => {
    console.log("");
  });

  console.log("========================================\n");
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}

export {
  handleJournalEntry,
  renderUserProgress,
  showNextLevelCosts,
  completeDailyQuests,
  awardXpToUser,
  LevelProgressComponent,
  runExamples,
};
