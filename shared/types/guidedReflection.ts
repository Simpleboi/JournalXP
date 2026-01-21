/**
 * Guided Reflection Paths
 *
 * Non-clinical mental health reflection journeys.
 * NOT therapy, NOT diagnosis - just gentle self-reflection.
 */

export type StepType = 'intro' | 'prompt' | 'exercise' | 'summary';

export type ReflectionCategory =
  | 'Emotional Regulation'
  | 'Self-Development'
  | 'Life Transitions'
  | 'Relationships'
  | 'Wellness'
  | 'Growth & Purpose';

export const REFLECTION_CATEGORIES: ReflectionCategory[] = [
  'Emotional Regulation',
  'Self-Development',
  'Life Transitions',
  'Relationships',
  'Wellness',
  'Growth & Purpose',
];

export interface PathStep {
  id: string;
  type: StepType;
  title: string;
  content: string;
  /** Optional prompt question for journal writing */
  prompt?: string;
  /** For exercise steps - instructions for the activity */
  exerciseInstructions?: string[];
  /** Exercise duration in seconds (optional) */
  exerciseDuration?: number;
  /** Whether this step can be skipped (exercises are always skippable) */
  skippable: boolean;
  /** Optional reflection questions for the step */
  reflectionQuestions?: string[];
}

export interface GuidedPath {
  id: string;
  title: string;
  description: string;
  /** Short tagline shown on cards */
  tagline: string;
  /** Category for filtering */
  category: ReflectionCategory;
  /** Icon name from lucide-react */
  icon: string;
  /** Gradient colors for styling */
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  /** Estimated time to complete in minutes */
  estimatedMinutes: number;
  /** All steps in order */
  steps: PathStep[];
  /** Disclaimer shown at start */
  disclaimer: string;
}

export interface UserStepResponse {
  stepId: string;
  /** User's written response (for prompt/summary steps) */
  response?: string;
  /** Whether the step was completed */
  completed: boolean;
  /** Whether the step was skipped */
  skipped: boolean;
  /** Timestamp of completion/skip */
  timestamp: string;
}

export interface UserPathProgress {
  pathId: string;
  /** Current step index (0-based) */
  currentStepIndex: number;
  /** All step responses */
  stepResponses: UserStepResponse[];
  /** When the user started this path */
  startedAt: string;
  /** When the user completed the path (if finished) */
  completedAt?: string;
  /** AI-generated summary at the end (optional) */
  aiSummary?: string;
}

/** Default disclaimer for all paths */
export const DEFAULT_DISCLAIMER =
  "This is a self-reflection tool, not therapy or medical advice. " +
  "If you're struggling, please reach out to a mental health professional. " +
  "You can skip any step that doesn't feel right for you.";
