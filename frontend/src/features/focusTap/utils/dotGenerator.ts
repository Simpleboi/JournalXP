/**
 * Dot Generation Utility Functions
 *
 * Handles spawning, positioning, and lifecycle of game dots.
 */

import { DotInstance, GameColor, GAME_COLORS } from '../types';

// ============================================================================
// Constants
// ============================================================================

const MIN_DOT_SIZE = 50; // px
const MAX_DOT_SIZE = 80; // px
const SAFE_ZONE = 10; // % from edges
const MIN_DOT_DISTANCE = 15; // % minimum distance between dots

// ============================================================================
// Dot Creation
// ============================================================================

/**
 * Generates a unique ID for a dot
 *
 * @returns Unique dot ID
 */
function generateDotId(): string {
  return `dot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Selects a random color from available game colors
 *
 * @param targetColorId - Optional color to exclude (for distractors)
 * @returns Random game color
 */
export function getRandomColor(targetColorId?: string): GameColor {
  let availableColors = GAME_COLORS;

  // When spawning distractors, exclude target color
  if (targetColorId) {
    availableColors = GAME_COLORS.filter((color) => color.id !== targetColorId);
  }

  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}

/**
 * Selects the target color for a game session
 *
 * @returns Random game color to be the target
 */
export function selectTargetColor(): GameColor {
  return getRandomColor();
}

/**
 * Generates random position that doesn't overlap with existing dots
 *
 * @param existingDots - Currently active dots
 * @returns Position coordinates (x, y as percentages)
 */
function generateNonOverlappingPosition(existingDots: DotInstance[]): {
  x: number;
  y: number;
} {
  const maxAttempts = 50; // Prevent infinite loop
  let attempt = 0;

  while (attempt < maxAttempts) {
    // Generate random position within safe zone
    const x = SAFE_ZONE + Math.random() * (100 - 2 * SAFE_ZONE);
    const y = SAFE_ZONE + Math.random() * (100 - 2 * SAFE_ZONE);

    // Check distance from existing dots
    const tooClose = existingDots.some((dot) => {
      const distance = Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2));
      return distance < MIN_DOT_DISTANCE;
    });

    if (!tooClose) {
      return { x, y };
    }

    attempt++;
  }

  // Fallback: return random position even if it might overlap
  // (Better than freezing the game)
  return {
    x: SAFE_ZONE + Math.random() * (100 - 2 * SAFE_ZONE),
    y: SAFE_ZONE + Math.random() * (100 - 2 * SAFE_ZONE),
  };
}

/**
 * Generates a random dot size
 *
 * @returns Dot size in pixels
 */
function generateDotSize(): number {
  return MIN_DOT_SIZE + Math.random() * (MAX_DOT_SIZE - MIN_DOT_SIZE);
}

/**
 * Creates a new dot instance
 *
 * @param colorId - Color ID for this dot
 * @param existingDots - Currently active dots (for position collision)
 * @param lifespan - How long the dot should live (ms)
 * @returns New dot instance
 */
export function createDot(
  colorId: string,
  existingDots: DotInstance[],
  lifespan: number = 4000
): DotInstance {
  const { x, y } = generateNonOverlappingPosition(existingDots);
  const size = generateDotSize();

  return {
    id: generateDotId(),
    colorId,
    x,
    y,
    size,
    spawnedAt: Date.now(),
    lifespan,
  };
}

// ============================================================================
// Dot Lifecycle Management
// ============================================================================

/**
 * Checks if a dot has expired based on its lifespan
 *
 * @param dot - Dot to check
 * @param currentTime - Current timestamp
 * @returns Whether dot should be removed
 */
export function isDotExpired(dot: DotInstance, currentTime: number = Date.now()): boolean {
  return currentTime - dot.spawnedAt >= dot.lifespan;
}

/**
 * Removes expired dots from array
 *
 * @param dots - Array of dots
 * @param currentTime - Current timestamp
 * @returns Array with only active dots
 */
export function removeExpiredDots(
  dots: DotInstance[],
  currentTime: number = Date.now()
): DotInstance[] {
  return dots.filter((dot) => !isDotExpired(dot, currentTime));
}

/**
 * Calculates remaining lifetime percentage for a dot (for animations)
 *
 * @param dot - Dot to check
 * @param currentTime - Current timestamp
 * @returns Percentage of life remaining (0-1)
 */
export function getDotLifePercentage(
  dot: DotInstance,
  currentTime: number = Date.now()
): number {
  const elapsed = currentTime - dot.spawnedAt;
  const remaining = Math.max(0, dot.lifespan - elapsed);
  return remaining / dot.lifespan;
}

// ============================================================================
// Spawn Strategy
// ============================================================================

/**
 * Determines whether to spawn a target dot or distractor
 *
 * Strategy:
 * - 40% chance for target dot
 * - 60% chance for distractor
 * - First dot is always target (tutorial feel)
 *
 * @param existingDots - Currently active dots
 * @param targetColorId - Target color for this session
 * @returns Color ID to spawn
 */
export function selectDotColor(
  existingDots: DotInstance[],
  targetColorId: string
): string {
  // First dot is always the target (helps player understand)
  if (existingDots.length === 0) {
    return targetColorId;
  }

  // 40% chance for target, 60% for distractor
  const spawnTarget = Math.random() < 0.4;

  if (spawnTarget) {
    return targetColorId;
  } else {
    // Select random distractor color
    const distractorColor = getRandomColor(targetColorId);
    return distractorColor.id;
  }
}

/**
 * Determines if a new dot should spawn based on current game state
 *
 * @param existingDots - Currently active dots
 * @param maxDotsOnScreen - Maximum allowed dots
 * @param lastSpawnTime - Timestamp of last spawn
 * @param spawnInterval - Required time between spawns
 * @param currentTime - Current timestamp
 * @returns Whether to spawn a new dot
 */
export function shouldSpawnDot(
  existingDots: DotInstance[],
  maxDotsOnScreen: number,
  lastSpawnTime: number,
  spawnInterval: number,
  currentTime: number = Date.now()
): boolean {
  // Don't spawn if at max capacity
  if (existingDots.length >= maxDotsOnScreen) {
    return false;
  }

  // Don't spawn if not enough time has passed
  if (currentTime - lastSpawnTime < spawnInterval) {
    return false;
  }

  return true;
}

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Spawns a new dot and adds it to the existing array
 *
 * @param existingDots - Current dots
 * @param targetColorId - Target color
 * @param lifespan - Dot lifespan
 * @returns Updated dots array
 */
export function spawnDot(
  existingDots: DotInstance[],
  targetColorId: string,
  lifespan: number
): DotInstance[] {
  const colorId = selectDotColor(existingDots, targetColorId);
  const newDot = createDot(colorId, existingDots, lifespan);

  return [...existingDots, newDot];
}

/**
 * Removes a specific dot by ID
 *
 * @param dots - Array of dots
 * @param dotId - ID of dot to remove
 * @returns Array without the specified dot
 */
export function removeDot(dots: DotInstance[], dotId: string): DotInstance[] {
  return dots.filter((dot) => dot.id !== dotId);
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validates dot instance data
 *
 * @param dot - Dot to validate
 * @returns Whether dot is valid
 */
export function validateDot(dot: DotInstance): boolean {
  if (!dot.id || !dot.colorId) return false;
  if (dot.x < 0 || dot.x > 100) return false;
  if (dot.y < 0 || dot.y > 100) return false;
  if (dot.size < 0) return false;
  if (dot.spawnedAt < 0 || dot.lifespan < 0) return false;

  return true;
}

/**
 * Gets color object by ID
 *
 * @param colorId - Color ID to find
 * @returns GameColor object or undefined
 */
export function getColorById(colorId: string): GameColor | undefined {
  return GAME_COLORS.find((color) => color.id === colorId);
}
