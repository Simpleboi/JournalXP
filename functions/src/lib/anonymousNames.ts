/**
 * Anonymous Name Generator for Community Responses
 *
 * Generates consistent but anonymous display names in the format:
 * "Level X [Adjective] [Noun]"
 *
 * The same user+response combination always produces the same name,
 * but different responses from the same user get different names.
 */

/**
 * Positive, mental health-friendly adjectives
 */
const ADJECTIVES: string[] = [
  "Brave",
  "Calm",
  "Curious",
  "Gentle",
  "Happy",
  "Kind",
  "Mindful",
  "Peaceful",
  "Radiant",
  "Serene",
  "Thoughtful",
  "Warm",
  "Wise",
  "Bright",
  "Hopeful",
  "Joyful",
  "Patient",
  "Resilient",
  "Spirited",
  "Tender",
  "Vibrant",
  "Caring",
  "Creative",
  "Dreamy",
  "Earnest",
  "Friendly",
  "Grateful",
  "Humble",
  "Inspired",
  "Jovial",
];

/**
 * Journey/growth-themed nouns
 */
const NOUNS: string[] = [
  "Explorer",
  "Wanderer",
  "Seeker",
  "Dreamer",
  "Traveler",
  "Journaler",
  "Pathfinder",
  "Adventurer",
  "Stargazer",
  "Storyteller",
  "Discoverer",
  "Navigator",
  "Voyager",
  "Pioneer",
  "Wayfarer",
  "Trailblazer",
  "Questor",
  "Pilgrim",
  "Sojourner",
  "Wanderlust",
  "Daydreamer",
  "Moongazer",
  "Sunseeker",
  "Wordsmith",
  "Lightkeeper",
  "Heartweaver",
  "Soulwalker",
  "Cloudwatcher",
  "Mindcrafter",
  "Peacemaker",
];

/**
 * Simple hash function for generating consistent random indices
 * Uses djb2 algorithm
 *
 * @param str - String to hash
 * @returns Numeric hash value
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) ^ char; // hash * 33 ^ char
  }
  return Math.abs(hash);
}

/**
 * Generate an anonymous name for a user's response
 *
 * The name is deterministic based on userId and responseId, so:
 * - The same response always shows the same anonymous name
 * - Different responses from the same user show different names
 * - Names include the user's level for social context
 *
 * @param userId - The user's ID (used for hashing, not displayed)
 * @param responseId - The response's ID (used for variation)
 * @param level - The user's current level (displayed in the name)
 * @returns Anonymous name like "Level 12 Brave Explorer"
 */
export function generateAnonymousName(
  userId: string,
  responseId: string,
  level: number
): string {
  // Create a combined seed for consistent randomness
  const seed = `${userId}-${responseId}`;
  const hash = hashString(seed);

  // Use different parts of the hash for adjective and noun
  const adjIndex = hash % ADJECTIVES.length;
  const nounIndex = Math.floor(hash / ADJECTIVES.length) % NOUNS.length;

  const adjective = ADJECTIVES[adjIndex];
  const noun = NOUNS[nounIndex];

  return `Level ${level} ${adjective} ${noun}`;
}

/**
 * Generate a preview name (for testing/display purposes)
 * Uses a random selection instead of hashing
 *
 * @param level - The user's current level
 * @returns Random anonymous name
 */
export function generatePreviewName(level: number): string {
  const adjIndex = Math.floor(Math.random() * ADJECTIVES.length);
  const nounIndex = Math.floor(Math.random() * NOUNS.length);

  return `Level ${level} ${ADJECTIVES[adjIndex]} ${NOUNS[nounIndex]}`;
}
