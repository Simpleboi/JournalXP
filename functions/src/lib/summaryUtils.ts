/**
 * Utility functions for Sunday AI summary generation
 *
 * Includes token estimation, theme extraction, and text processing helpers.
 */

/**
 * Estimates token count for a string
 * Uses a simple heuristic: ~4 characters per token for English text
 *
 * @param text - The text to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Simple heuristic: average ~4 characters per token
  // For more accuracy, could use tiktoken library, but this adds dependencies
  return Math.ceil(text.length / 4);
}

/**
 * Extracts dominant theme from a conversation snippet
 * Uses simple keyword matching and frequency analysis
 *
 * @param text - The text to extract theme from
 * @returns A short theme description
 */
export function extractTheme(text: string): string {
  if (!text) return "General conversation";

  const lowerText = text.toLowerCase();

  // Define theme keywords
  const themes: Record<string, string[]> = {
    "work stress": ["work", "job", "boss", "deadline", "presentation", "meeting", "project"],
    "anxiety management": ["anxiety", "anxious", "worried", "nervous", "panic", "stress"],
    "self-compassion": ["self-compassion", "kind to myself", "forgive", "accept", "gentle"],
    "relationships": ["relationship", "partner", "friend", "family", "social", "conflict"],
    "sleep issues": ["sleep", "insomnia", "tired", "rest", "fatigue", "exhausted"],
    "exercise and health": ["exercise", "workout", "fitness", "health", "physical", "body"],
    "mindfulness practice": ["meditation", "mindfulness", "breathing", "present", "awareness"],
    "goal setting": ["goal", "achievement", "accomplish", "plan", "future", "aspiration"],
    "emotional processing": ["feel", "emotion", "sad", "happy", "angry", "grief", "joy"],
    "coping strategies": ["cope", "manage", "technique", "strategy", "tool", "method"],
  };

  // Count matches for each theme
  const themeCounts: Record<string, number> = {};

  for (const [theme, keywords] of Object.entries(themes)) {
    let count = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, "gi");
      const matches = lowerText.match(regex);
      count += matches ? matches.length : 0;
    }
    if (count > 0) {
      themeCounts[theme] = count;
    }
  }

  // Return most frequent theme
  if (Object.keys(themeCounts).length === 0) {
    return "General conversation";
  }

  const sortedThemes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b - a);

  return sortedThemes[0][0];
}

/**
 * Extracts recurring themes from journal entry metadata
 *
 * @param metadata - Array of journal entry metadata
 * @returns Array of recurring theme strings
 */
export function extractThemes(metadata: Array<{ tags?: string[]; mood?: string; type?: string }>): string[] {
  const tagCounts: Record<string, number> = {};

  // Count tag frequencies
  for (const entry of metadata) {
    if (entry.tags) {
      for (const tag of entry.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }

  // Return tags that appear in at least 2 entries
  return Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);
}

/**
 * Gets the start of the current week (Sunday at 00:00:00)
 *
 * @returns Date object for start of week
 */
export function getWeekStart(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * Calculates weekly habit completion rate
 *
 * @param habitsSnapshot - Firestore snapshot of habits
 * @returns Completion rate as percentage (0-100)
 */
export function calculateCompletionRate(habitsSnapshot: any): number {
  if (!habitsSnapshot || habitsSnapshot.empty) return 0;

  const weekStart = getWeekStart();
  let totalExpected = 0;
  let totalCompleted = 0;

  habitsSnapshot.forEach((doc: any) => {
    const habit = doc.data();
    const frequency = habit.frequency;

    // Calculate expected completions this week
    if (frequency === "daily") {
      totalExpected += 7;
    } else if (frequency === "weekly") {
      totalExpected += 1;
    }

    // Count actual completions this week
    if (habit.lastCompletedAt) {
      const lastCompleted = new Date(habit.lastCompletedAt);
      if (lastCompleted >= weekStart) {
        // For simplicity, count current streak
        totalCompleted += Math.min(habit.currentStreak || 0, 7);
      }
    }
  });

  if (totalExpected === 0) return 0;
  return Math.round((totalCompleted / totalExpected) * 100);
}

/**
 * Truncates text to fit within token budget
 *
 * @param text - Text to truncate
 * @param maxTokens - Maximum tokens allowed
 * @returns Truncated text
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text);

  if (estimatedTokens <= maxTokens) {
    return text;
  }

  // Truncate to approximately the right length
  const targetChars = maxTokens * 4; // ~4 chars per token
  return text.substring(0, targetChars) + "...";
}

/**
 * Formats a date range as human-readable string
 *
 * @param start - Start date ISO string
 * @param end - End date ISO string
 * @returns Formatted string like "Nov 25 - Dec 2, 2025"
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", options);
  const year = endDate.getFullYear();

  return `${startStr} - ${endStr}, ${year}`;
}

/**
 * Sanitizes user input to prevent prompt injection
 *
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  // Remove potential prompt injection attempts
  const dangerous = [
    /ignore previous instructions/gi,
    /system:/gi,
    /assistant:/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
  ];

  let sanitized = input;
  for (const pattern of dangerous) {
    sanitized = sanitized.replace(pattern, "");
  }

  return sanitized.trim();
}

/**
 * Generates a summary of mood distribution
 *
 * @param moods - Array of mood objects with count
 * @returns Human-readable mood summary
 */
export function summarizeMoods(moods: { mood: string; count: number }[]): string {
  if (!moods || moods.length === 0) {
    return "No mood data available";
  }

  const total = moods.reduce((sum, m) => sum + m.count, 0);
  const percentages = moods.map(m => ({
    mood: m.mood,
    percentage: Math.round((m.count / total) * 100)
  }));

  return percentages
    .map(m => `${m.percentage}% ${m.mood}`)
    .join(", ");
}
