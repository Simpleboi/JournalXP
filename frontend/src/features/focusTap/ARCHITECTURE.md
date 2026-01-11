# Focus Tap Mini-Game Architecture

## Overview
A dual-mode focus training game designed for wellness-first engagement with optional competitive depth.

## Design Philosophy
1. **Wellness First**: Default mode is calming and non-competitive
2. **No Punishment**: Mistakes are learning opportunities, not failures
3. **Progressive Challenge**: Opt-in difficulty for skill mastery
4. **Accessibility**: Mobile-first, motion-safe, theme-aware

## State Machine

```
IDLE
  ├─> START_WARMUP
  │     └─> RUNNING_WARMUP (30-60s timer)
  │           └─> END_WARMUP
  │                 └─> IDLE
  │
  └─> START_CHALLENGE
        └─> RUNNING_CHALLENGE (until wrong tap)
              └─> END_CHALLENGE
                    └─> IDLE
```

## Component Hierarchy

```
FocusTapGame (Main Wrapper)
  ├─> Mode Selector (IDLE state)
  ├─> FocusTapWarmUp
  │     └─> Dot[] (spawned dots)
  └─> FocusTapChallenge
        └─> Dot[] (spawned dots)
```

## Data Flow

### Warm-Up Mode
1. User clicks "Start Warm-Up"
2. Timer starts (60s default)
3. Dots spawn every 1.5-2s
4. Target color displayed prominently
5. Correct tap: gentle pulse animation
6. Wrong tap: no penalty, continue
7. Timer ends: Fixed XP award (20 XP)

### Challenge Mode
1. User clicks "Start Challenge"
2. Speed starts slow, ramps up
3. Dots spawn based on difficulty level
4. Correct tap:
   - Score += basePoints × combo × difficultyMultiplier
   - Combo++
   - Speed increases
5. Wrong tap:
   - Combo resets to 0 (NOT game over - wellness focus)
   - Visual feedback (gentle shake)
6. Track: high score, longest combo, max difficulty

## Scoring Math

```typescript
// Base configuration
const BASE_POINTS = 10;
const COMBO_INCREMENT = 0.1;
const MAX_COMBO_MULTIPLIER = 5.0;
const DIFFICULTY_THRESHOLD = 20; // taps to next difficulty

// Formulas
comboMultiplier = Math.min(1 + (combo * COMBO_INCREMENT), MAX_COMBO_MULTIPLIER);
difficultyLevel = Math.floor(correctTaps / DIFFICULTY_THRESHOLD) + 1;
scoreGain = BASE_POINTS * comboMultiplier * difficultyLevel;

// Speed ramping
spawnInterval = Math.max(400, 1500 - (difficultyLevel * 100)); // ms
dotLifespan = Math.max(2000, 4000 - (difficultyLevel * 200)); // ms
```

## Difficulty Progression

| Difficulty | Correct Taps | Spawn Interval | Dot Lifespan | Dots On Screen |
|------------|--------------|----------------|--------------|----------------|
| 1          | 0-19         | 1500ms         | 4000ms       | 2-3            |
| 2          | 20-39        | 1400ms         | 3800ms       | 3-4            |
| 3          | 40-59        | 1300ms         | 3600ms       | 4-5            |
| 5          | 80-99        | 1100ms         | 3200ms       | 5-6            |
| 10         | 180-199      | 600ms          | 2200ms       | 7-8            |

## Color Palette

```typescript
const GAME_COLORS = [
  { id: 'blue', name: 'Blue', bg: 'bg-blue-500', text: 'text-blue-500' },
  { id: 'green', name: 'Green', bg: 'bg-green-500', text: 'text-green-500' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-500', text: 'text-purple-500' },
  { id: 'orange', name: 'Orange', bg: 'bg-orange-500', text: 'text-orange-500' },
  { id: 'pink', name: 'Pink', bg: 'bg-pink-500', text: 'text-pink-500' },
];
```

## XP Rewards

### Warm-Up Mode
- Completion: 20 XP (fixed)
- No streak bonuses
- No penalties

### Challenge Mode
- Score-based: Math.min(score / 100, 50) XP
- Daily cap: 200 XP total from Challenge Mode
- High score bonus: +10 XP (once per day)

## Design Decisions

### 1. Wrong Tap Handling (Challenge Mode)
**Decision**: Reset combo instead of ending run

**Rationale**:
- Wellness-focused: Learning through recovery, not punishment
- Engagement: Allows longer play sessions
- Still penalizing: Losing a 20x combo is significant
- Skill expression: Maintaining combo becomes the challenge

### 2. No Leaderboards
**Rationale**:
- Reduces social comparison anxiety
- Personal growth over competition
- Fits wellness app philosophy

### 3. Daily XP Cap
**Rationale**:
- Prevents grinding behavior
- Encourages diverse app usage
- Maintains game as supplemental activity

### 4. Warm-Up as Default
**Rationale**:
- First-time users get calm experience
- Sets wellness-first tone
- Challenge mode is discoverable, not forced

## Accessibility Features

1. **Motion Safety**: Uses `prefers-reduced-motion` media query
2. **Touch Targets**: Minimum 44px × 44px (WCAG AAA)
3. **Color Independence**: Target color shown as text + visual
4. **Keyboard Support**: Space to tap, arrow keys optional
5. **Screen Reader**: Announces target color, score updates

## Integration Points

### Sunday AI Hook
```typescript
interface GameResult {
  mode: 'warmup' | 'challenge';
  score?: number;
  combo?: number;
  difficulty?: number;
  duration: number;
}

// Sunday generates contextual message
"Great warm-up session! Your focus is primed for deep work."
"Impressive 45-combo! Your concentration is improving."
```

### Pomodoro Integration
```typescript
// Optional: Start Pomodoro with "Focused" status after warm-up
if (completedWarmup) {
  pomoroStatus = 'focused'; // Slight XP boost for that session
}
```

### Stats Tracking
```typescript
interface FocusTapStats {
  warmupSessionsCompleted: number;
  challengeHighScore: number;
  challengeLongestCombo: number;
  challengeMaxDifficulty: number;
  totalXpEarned: number;
  lastPlayed: string;
}
```

## Performance Considerations

1. **Dot Cleanup**: Remove dots from DOM after lifecycle
2. **Animation**: Use CSS transforms (GPU-accelerated)
3. **Event Delegation**: Single click handler on container
4. **State Updates**: Batch updates where possible
5. **Memory**: Limit max dots on screen to 8

## Future Enhancements (Not in MVP)

- Custom color sets (accessibility)
- Speed training mode (reaction time)
- Pattern recognition variant
- Achievement system
- Zen mode (no timer, pure meditation)
