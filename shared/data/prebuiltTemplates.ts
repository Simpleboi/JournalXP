/**
 * Pre-built journal templates
 * These are available to all users by default
 */

import {
  JournalTemplate,
  PrebuiltTemplateId,
  TemplateField,
} from '../types/templates';

// Helper to create template fields
const createField = (
  id: string,
  label: string,
  type: TemplateField['type'],
  order: number,
  options?: Partial<Omit<TemplateField, 'id' | 'label' | 'type' | 'order'>>
): TemplateField => ({
  id,
  label,
  type,
  order,
  ...options,
});

export const PREBUILT_TEMPLATES: JournalTemplate[] = [
  // Morning Pages - Stream of consciousness
  {
    id: PrebuiltTemplateId.MORNING_PAGES,
    name: 'Morning Pages',
    description: 'Start your day with free-flowing thoughts. Write 3 pages of stream-of-consciousness to clear your mind.',
    category: 'reflection',
    structureType: 'morning-pages',
    icon: 'Sunrise',
    color: '#FF9A8B',
    isPrebuilt: true,
    isPublic: true,
    prompt: "Write whatever comes to mind. Don't think, don't edit, just let the words flow. This is your mental declutter space.",
    createdAt: new Date().toISOString(),
  },

  // Evening Reflection - Structured day review
  {
    id: PrebuiltTemplateId.EVENING_REFLECTION,
    name: 'Evening Reflection',
    description: 'Reflect on your day with structured prompts. Review wins, challenges, and lessons learned.',
    category: 'reflection',
    structureType: 'evening-reflection',
    icon: 'Moon',
    color: '#667eea',
    isPrebuilt: true,
    isPublic: true,
    fields: [
      createField('today-highlight', 'What was the highlight of your day?', 'textarea', 1, {
        required: true,
        placeholder: 'Describe the best moment...',
      }),
      createField('challenges', 'What challenges did you face?', 'textarea', 2, {
        placeholder: 'Any obstacles or difficulties...',
      }),
      createField('lessons', 'What did you learn today?', 'textarea', 3, {
        placeholder: 'Insights, realizations, or lessons...',
      }),
      createField('gratitude', 'What are you grateful for today?', 'bullet-list', 4, {
        required: true,
        placeholder: 'List 3-5 things...',
      }),
      createField('tomorrow-intention', "Tomorrow's main intention:", 'text', 5, {
        placeholder: 'One thing to focus on tomorrow...',
      }),
      createField('day-rating', 'Rate your day (1-10):', 'rating', 6, {
        required: true,
      }),
    ],
    createdAt: new Date().toISOString(),
  },

  // 5-Minute Journal
  {
    id: PrebuiltTemplateId.FIVE_MINUTE_JOURNAL,
    name: '5-Minute Journal',
    description: 'Quick daily practice focused on gratitude, affirmations, and reflection.',
    category: 'gratitude',
    structureType: '5-minute-journal',
    icon: 'Clock',
    color: '#f093fb',
    isPrebuilt: true,
    isPublic: true,
    fields: [
      createField('grateful-for', 'I am grateful for:', 'bullet-list', 1, {
        required: true,
        placeholder: 'List 3 things...',
      }),
      createField('daily-affirmation', 'Daily affirmation:', 'textarea', 2, {
        required: true,
        placeholder: 'I am...',
        maxLength: 200,
      }),
      createField('make-today-great', 'What would make today great?', 'bullet-list', 3, {
        required: true,
        placeholder: 'List 3 things...',
      }),
      createField('amazing-today', 'What amazing things happened today?', 'bullet-list', 4, {
        placeholder: 'Celebrate your wins...',
      }),
      createField('improve', 'How could I have made today better?', 'textarea', 5, {
        placeholder: 'One thing to improve...',
        maxLength: 200,
      }),
    ],
    createdAt: new Date().toISOString(),
  },

  // Gratitude Log
  {
    id: PrebuiltTemplateId.GRATITUDE_LOG,
    name: 'Gratitude Log',
    description: 'Simple daily gratitude practice. Focus on appreciation and positivity.',
    category: 'gratitude',
    structureType: 'free-form',
    icon: 'Heart',
    color: '#fa709a',
    isPrebuilt: true,
    isPublic: true,
    prompts: [
      "What are three things you're grateful for today?",
      'Write about someone who made your day better.',
      'Describe a recent moment that brought you joy.',
      "What comforts you when you're feeling low?",
      'List small things that made you smile this week.',
      "What is a personal strength you're grateful to have?",
      'What everyday thing do you often overlook but appreciate now?',
    ],
    createdAt: new Date().toISOString(),
  },

  // Therapy Prompts
  {
    id: PrebuiltTemplateId.THERAPY_SESSION,
    name: 'Therapy Prompts',
    description: 'Deep therapeutic questions for self-exploration and emotional processing.',
    category: 'therapy',
    structureType: 'therapy-prompts',
    icon: 'Brain',
    color: '#4facfe',
    isPrebuilt: true,
    isPublic: true,
    prompts: [
      'What emotions am I avoiding right now, and why?',
      'What patterns do I keep repeating in my relationships?',
      'Where does this belief about myself come from?',
      'What would I say to someone I love who was in my situation?',
      'What am I afraid will happen if I set this boundary?',
      'What does this feeling remind me of from my past?',
      'What part of me needs attention or healing right now?',
      'What story am I telling myself that might not be true?',
      'What would change if I truly believed I was worthy?',
      'What am I holding onto that no longer serves me?',
    ],
    createdAt: new Date().toISOString(),
  },

  // Bullet Journal
  {
    id: PrebuiltTemplateId.BULLET_JOURNAL,
    name: 'Bullet Journal',
    description: 'Rapid logging system for tasks, events, and notes.',
    category: 'productivity',
    structureType: 'bullet-journal',
    icon: 'List',
    color: '#43e97b',
    isPrebuilt: true,
    isPublic: true,
    fields: [
      createField('tasks', '• Tasks (to-do)', 'bullet-list', 1, {
        placeholder: 'Tasks to complete...',
      }),
      createField('events', '○ Events', 'bullet-list', 2, {
        placeholder: 'Things that happened...',
      }),
      createField('notes', '- Notes', 'bullet-list', 3, {
        placeholder: 'Ideas, observations, thoughts...',
      }),
      createField('priorities', '★ Priorities', 'bullet-list', 4, {
        placeholder: 'Most important items...',
      }),
    ],
    createdAt: new Date().toISOString(),
  },

  // Mood Tracker
  {
    id: PrebuiltTemplateId.MOOD_TRACKER,
    name: 'Mood Tracker',
    description: 'Track your emotional state and identify patterns.',
    category: 'wellness',
    structureType: 'custom',
    icon: 'Smile',
    color: '#38f9d7',
    isPrebuilt: true,
    isPublic: true,
    fields: [
      createField('current-mood', 'Current mood:', 'mood-selector', 1, {
        required: true,
      }),
      createField('energy-level', 'Energy level (1-10):', 'rating', 2, {
        required: true,
      }),
      createField('stress-level', 'Stress level (1-10):', 'rating', 3, {
        required: true,
      }),
      createField('triggers', 'What triggered this mood?', 'textarea', 4, {
        placeholder: 'Events, thoughts, or situations...',
      }),
      createField('coping-strategies', 'Coping strategies used:', 'bullet-list', 5, {
        placeholder: 'What helped you today...',
      }),
      createField('notes', 'Additional notes:', 'textarea', 6, {
        placeholder: 'Any other observations...',
      }),
    ],
    createdAt: new Date().toISOString(),
  },

  // Goal Reflection
  {
    id: PrebuiltTemplateId.GOAL_REFLECTION,
    name: 'Goal Reflection',
    description: 'Weekly goal review and planning.',
    category: 'productivity',
    structureType: 'custom',
    icon: 'Target',
    color: '#f6d365',
    isPrebuilt: true,
    isPublic: true,
    fields: [
      createField('goals-achieved', 'Goals achieved this week:', 'bullet-list', 1, {
        placeholder: 'Celebrate your progress...',
      }),
      createField('challenges-faced', 'Challenges faced:', 'textarea', 2, {
        placeholder: 'What obstacles came up...',
      }),
      createField('lessons-learned', 'Key lessons learned:', 'textarea', 3, {
        placeholder: 'What did you discover...',
      }),
      createField('next-week-goals', 'Goals for next week:', 'bullet-list', 4, {
        required: true,
        placeholder: 'What will you focus on...',
      }),
      createField('action-steps', 'Specific action steps:', 'bullet-list', 5, {
        placeholder: 'Concrete actions to take...',
      }),
    ],
    recurrence: {
      frequency: 'weekly',
      daysOfWeek: ['sunday'],
      time: '19:00',
    },
    createdAt: new Date().toISOString(),
  },

  // Stress Relief
  {
    id: PrebuiltTemplateId.STRESS_RELIEF,
    name: 'Stress Relief',
    description: 'Process stress and anxiety through writing.',
    category: 'wellness',
    structureType: 'custom',
    icon: 'Wind',
    color: '#fda085',
    isPrebuilt: true,
    isPublic: true,
    fields: [
      createField('stress-source', 'What is causing you stress?', 'textarea', 1, {
        required: true,
        placeholder: 'Describe the source...',
      }),
      createField('physical-sensations', 'Where do you feel it in your body?', 'textarea', 2, {
        placeholder: 'Physical sensations...',
      }),
      createField('thoughts', 'What thoughts are running through your mind?', 'textarea', 3, {
        placeholder: 'Stream of consciousness...',
      }),
      createField('control', 'What can you control in this situation?', 'bullet-list', 4, {
        placeholder: 'Things within your control...',
      }),
      createField('cannot-control', 'What is outside your control?', 'bullet-list', 5, {
        placeholder: 'Things to let go of...',
      }),
      createField('next-step', 'One small step you can take right now:', 'text', 6, {
        required: true,
        placeholder: 'A single actionable step...',
      }),
    ],
    createdAt: new Date().toISOString(),
  },

  // Relationship Reflection
  {
    id: PrebuiltTemplateId.RELATIONSHIP_REFLECTION,
    name: 'Relationship Reflection',
    description: 'Reflect on relationships and social connections.',
    category: 'therapy',
    structureType: 'custom',
    icon: 'Users',
    color: '#a8edea',
    isPrebuilt: true,
    isPublic: true,
    prompts: [
      'What relationship in my life needs more attention right now?',
      'What patterns do I notice in how I connect with others?',
      'What boundaries do I need to set or reinforce?',
      'Who makes me feel most like myself, and why?',
      'What am I grateful for in my closest relationships?',
      'What difficult conversation have I been avoiding?',
      'How do I show up differently with different people?',
      'What does a healthy relationship look like to me?',
      'Where do I need to give myself more grace in my relationships?',
      'What relationships drain my energy, and why?',
    ],
    createdAt: new Date().toISOString(),
  },
];

// Helper to get template by ID
export const getPrebuiltTemplateById = (id: string): JournalTemplate | undefined => {
  return PREBUILT_TEMPLATES.find(template => template.id === id);
};

// Helper to get templates by category
export const getTemplatesByCategory = (category: string): JournalTemplate[] => {
  return PREBUILT_TEMPLATES.filter(template => template.category === category);
};

// Helper to get all template IDs
export const getAllPrebuiltTemplateIds = (): string[] => {
  return PREBUILT_TEMPLATES.map(template => template.id);
};
