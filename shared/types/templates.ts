/**
 * Shared TypeScript interfaces for Journal Templates
 * Used by both frontend (web/mobile) and backend
 */

// Template structure types
export type TemplateStructureType =
  | 'free-form'           // Standard text area
  | 'bullet-journal'      // Bullet points with categories
  | '5-minute-journal'    // Specific structured format (gratitude, affirmations, etc.)
  | 'morning-pages'       // Stream of consciousness
  | 'evening-reflection'  // Day review format
  | 'therapy-prompts'     // Therapeutic questions
  | 'custom';             // User-defined structure

// Recurrence frequency
export type RecurrenceFrequency =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

// Days of the week for recurring prompts
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Template category
export type TemplateCategory =
  | 'wellness'
  | 'productivity'
  | 'gratitude'
  | 'reflection'
  | 'therapy'
  | 'custom';

// Field type for structured templates
export type TemplateFieldType =
  | 'text'              // Single line text
  | 'textarea'          // Multi-line text
  | 'bullet-list'       // Bullet point list
  | 'number'            // Numeric input
  | 'rating'            // 1-10 scale
  | 'mood-selector'     // Mood selection
  | 'checkbox'          // Boolean checkbox
  | 'time';             // Time input

// Individual field in a structured template
export interface TemplateField {
  id: string;
  label: string;
  type: TemplateFieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[];  // For select-type fields
  minLength?: number;
  maxLength?: number;
  order: number;       // Display order
}

// Recurrence configuration
export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  daysOfWeek?: DayOfWeek[];  // For weekly recurrence
  dayOfMonth?: number;        // For monthly recurrence (1-31)
  time?: string;              // HH:MM format for notification time
  customInterval?: number;    // For custom frequency (in days)
}

// Base template interface
export interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  structureType: TemplateStructureType;
  icon?: string;              // Icon name (lucide-react icon)
  color?: string;             // Theme color
  isPrebuilt: boolean;        // Pre-built vs user-created
  isPublic: boolean;          // Available to all users vs private
  fields?: TemplateField[];   // For structured templates
  prompt?: string;            // For simple prompt-based templates
  prompts?: string[];         // Multiple prompts to choose from
  recurrence?: RecurrenceConfig;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;         // User ID (undefined for pre-built)
  usageCount?: number;        // How many times it's been used
}

// API payload for creating/updating templates
export interface TemplatePayload {
  name: string;
  description: string;
  category: TemplateCategory;
  structureType: TemplateStructureType;
  icon?: string;
  color?: string;
  isPublic?: boolean;
  fields?: Omit<TemplateField, 'id'>[];  // IDs assigned by backend
  prompt?: string;
  prompts?: string[];
  recurrence?: RecurrenceConfig;
}

// Template response from API
export interface TemplateResponse extends JournalTemplate {
  // Inherits all fields from JournalTemplate
}

// User's template preferences
export interface UserTemplatePreferences {
  defaultTemplateId?: string;      // Default template for new entries
  favoriteTemplateIds: string[];   // Starred/favorited templates
  hiddenTemplateIds: string[];     // Hidden from quick-select
  recentTemplateIds: string[];     // Recently used (max 10)
}

// Structured entry data for templates
export interface StructuredEntryData {
  templateId: string;
  fields: Record<string, any>;  // Field ID -> value mapping
}

// Pre-built template IDs (for easy reference)
export enum PrebuiltTemplateId {
  MORNING_PAGES = 'morning-pages',
  EVENING_REFLECTION = 'evening-reflection',
  FIVE_MINUTE_JOURNAL = '5-minute-journal',
  GRATITUDE_LOG = 'gratitude-log',
  THERAPY_SESSION = 'therapy-prompts',
  BULLET_JOURNAL = 'bullet-journal',
  MOOD_TRACKER = 'mood-tracker',
  GOAL_REFLECTION = 'goal-reflection',
  STRESS_RELIEF = 'stress-relief',
  RELATIONSHIP_REFLECTION = 'relationship-reflection',
}
