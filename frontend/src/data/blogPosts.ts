export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  featuredImage: string;
  category: string;
  tags: string[];
  featured?: boolean;
  metaDescription?: string;
  metaKeywords?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "psychology-of-journaling",
    title: "The Psychology of Journaling: Why Writing Heals",
    excerpt: "Discover the science-backed benefits of journaling and how putting pen to paper can transform your mental health journey.",
    content: `# The Psychology of Journaling: Why Writing Heals

Journaling has been practiced for centuries, but modern psychology has revealed the profound impact it can have on our mental health and wellbeing. Let's explore the science behind why writing heals.

## The Science Behind Journaling

Research shows that expressive writing can significantly reduce stress, anxiety, and depression. When we write about our thoughts and feelings, we engage in a process called "emotional processing" that helps us make sense of our experiences.

### Key Benefits:

1. **Stress Reduction**: Writing about stressful events helps reduce their emotional impact
2. **Improved Mood**: Regular journaling is associated with decreased symptoms of depression
3. **Enhanced Self-Awareness**: Writing helps us understand our patterns and triggers
4. **Better Problem-Solving**: Journaling clarifies thoughts and promotes creative solutions

## How Journaling Changes Your Brain

Neuroscience research reveals that journaling activates the prefrontal cortex, the part of the brain responsible for reasoning and emotional regulation. This activation helps:

- Reduce activity in the amygdala (the brain's fear center)
- Strengthen neural pathways associated with positive thinking
- Improve working memory and cognitive processing

## Getting Started with Therapeutic Journaling

You don't need to be a writer to benefit from journaling. Here are some tips:

- **Start small**: Even 5 minutes a day can make a difference
- **Be honest**: Your journal is a judgment-free zone
- **Focus on feelings**: Don't just describe events, explore how they made you feel
- **Make it a habit**: Consistency is key to seeing benefits

## The WellPoint Approach

At WellPoint, we've designed our journaling features to maximize these psychological benefits. Our guided prompts, mood tracking, and reflection tools are all based on evidence-based practices that support mental wellness.

Ready to experience the healing power of journaling? Start your journey with WellPoint today.`,
    author: "Dr. Sarah Mitchell",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    date: "2024-01-15",
    readTime: "8 min read",
    featuredImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
    category: "Psychology",
    tags: ["Mental Health", "Journaling", "Science", "Wellness"],
    featured: true,
    metaDescription: "Explore the science-backed benefits of journaling and discover how writing can transform your mental health journey.",
    metaKeywords: ["journaling benefits", "mental health", "psychology", "therapeutic writing", "emotional wellness"]
  },
  {
    id: "2",
    slug: "daily-prompts-mental-clarity",
    title: "Daily Prompts for Mental Clarity: A 30-Day Guide",
    excerpt: "Transform your mindset with these powerful daily journaling prompts designed to bring clarity, peace, and purpose to your life.",
    content: `# Daily Prompts for Mental Clarity: A 30-Day Guide

Mental clarity doesn't happen by accident—it's cultivated through intentional reflection and self-inquiry. These daily prompts will guide you on a transformative 30-day journey.

## Why Daily Prompts Work

Structured journaling prompts serve as gentle guides that:
- Help overcome writer's block
- Direct attention to important areas of life
- Create consistency in your practice
- Reveal patterns and insights over time

## Week 1: Self-Discovery

**Day 1**: What are three things that make you feel most alive?
**Day 2**: Describe a moment when you felt completely at peace.
**Day 3**: What limiting belief are you ready to release?
**Day 4**: Who are you when no one is watching?
**Day 5**: What does your ideal day look like from start to finish?
**Day 6**: What are you grateful for right now?
**Day 7**: Reflect on your week—what surprised you?

## Week 2: Emotional Awareness

**Day 8**: What emotion have you been avoiding? Why?
**Day 9**: Write a letter to your younger self.
**Day 10**: What makes you feel safe and secure?
**Day 11**: Describe a challenge you've overcome.
**Day 12**: What do you need to forgive yourself for?
**Day 13**: How do you show love to yourself?
**Day 14**: What patterns do you notice in your emotional responses?

## Week 3: Growth & Goals

**Day 15**: What does success mean to you?
**Day 16**: What skill would you like to develop?
**Day 17**: Who inspires you and why?
**Day 18**: What's one small step you can take toward your dreams?
**Day 19**: What are you learning about yourself lately?
**Day 20**: How have you grown in the past year?
**Day 21**: What legacy do you want to leave?

## Week 4: Connection & Purpose

**Day 22**: How do you want to impact others?
**Day 23**: What relationships need more attention?
**Day 24**: What brings meaning to your life?
**Day 25**: How can you be more present today?
**Day 26**: What boundaries do you need to set?
**Day 27**: What are you proud of?
**Day 28**: How do you define happiness?

## Days 29-30: Integration

**Day 29**: Review your entries—what themes emerge?
**Day 30**: Write your intentions for the next 30 days.

## Making It Stick

The key to benefiting from these prompts is consistency. Set aside 10-15 minutes each day, preferably at the same time. WellPoint's journaling feature makes it easy to track your progress and revisit past entries.

Start your 30-day journey today and discover the clarity that comes from daily reflection.`,
    author: "Emma Rodriguez",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    date: "2024-01-20",
    readTime: "10 min read",
    featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    category: "Journaling Tips",
    tags: ["Prompts", "Daily Practice", "Mental Clarity", "Self-Discovery"],
    featured: true,
    metaDescription: "Transform your mindset with 30 days of powerful journaling prompts designed for mental clarity and self-discovery.",
    metaKeywords: ["journaling prompts", "daily journaling", "mental clarity", "self-reflection", "mindfulness"]
  },
  {
    id: "3",
    slug: "writing-helps-heal",
    title: "Why Writing Helps You Heal: The Therapeutic Power of Words",
    excerpt: "Explore how the simple act of writing can be one of the most powerful tools for emotional healing and personal transformation.",
    content: `# Why Writing Helps You Heal: The Therapeutic Power of Words

There's something almost magical about putting pen to paper (or fingers to keyboard) when we're struggling. But the healing power of writing isn't magic—it's science, psychology, and the profound human need to make sense of our experiences.

## The Healing Mechanisms of Writing

### 1. Externalization of Pain

When we write about difficult experiences, we externalize them. What was once trapped inside our minds becomes something we can observe, analyze, and ultimately, release. This distance is crucial for healing.

### 2. Creating Narrative Coherence

Our brains are wired for stories. When traumatic or confusing events happen, they often feel fragmented and overwhelming. Writing helps us create a coherent narrative, which research shows is essential for processing and healing.

### 3. Emotional Regulation

The act of writing engages both hemispheres of the brain. While the right hemisphere processes emotions, the left hemisphere helps organize and make sense of them. This bilateral engagement is incredibly therapeutic.

## Real Stories of Healing Through Writing

**Maria's Story**: After losing her mother, Maria couldn't talk about her grief without breaking down. But she could write. Through daily journaling, she processed her loss, celebrated her mother's life, and eventually found peace.

**James's Journey**: Struggling with anxiety, James used journaling to identify his triggers and patterns. Over time, his entries became a roadmap for understanding and managing his mental health.

## Types of Therapeutic Writing

### Expressive Writing
Write freely about your deepest thoughts and feelings for 15-20 minutes. Don't worry about grammar or structure—just let it flow.

### Gratitude Journaling
Focus on what you're thankful for. This practice rewires the brain to notice positive aspects of life.

### Letter Writing
Write letters you may never send—to people who've hurt you, to your future self, or to parts of yourself that need compassion.

### Stream of Consciousness
Write whatever comes to mind without censoring. This technique helps access subconscious thoughts and feelings.

## The Science Says It Works

Studies have shown that expressive writing can:
- Reduce symptoms of depression and anxiety
- Improve immune function
- Lower blood pressure
- Enhance sleep quality
- Speed physical healing
- Improve relationships

## Getting Started with Healing Writing

1. **Create a safe space**: Find a quiet, comfortable place where you won't be interrupted
2. **Set a timer**: Start with just 10 minutes
3. **Write without judgment**: This is for you alone—be completely honest
4. **Don't worry about perfection**: Grammar and spelling don't matter
5. **Be consistent**: Regular practice yields the best results

## When to Seek Additional Support

While writing is powerful, it's not a replacement for professional help when needed. If you're experiencing severe depression, trauma, or suicidal thoughts, please reach out to a mental health professional.

## Your Healing Journey Starts Here

WellPoint provides a safe, private space for your healing journey through writing. Our platform offers:
- Guided prompts for therapeutic writing
- Mood tracking to see your progress
- Privacy and security for your most personal thoughts
- A supportive community (optional)

Don't wait to start your healing journey. Create your free WellPoint account today and discover the transformative power of writing.`,
    author: "Dr. Michael Chen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    date: "2024-01-25",
    readTime: "12 min read",
    featuredImage: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200&q=80",
    category: "Healing",
    tags: ["Therapeutic Writing", "Emotional Healing", "Mental Health", "Recovery"],
    featured: true,
    metaDescription: "Discover how writing can be a powerful tool for emotional healing and personal transformation.",
    metaKeywords: ["therapeutic writing", "emotional healing", "journaling for healing", "mental health recovery", "expressive writing"]
  },
  {
    id: "4",
    slug: "mindfulness-journaling",
    title: "Mindfulness Through Journaling: Being Present on Paper",
    excerpt: "Learn how to combine mindfulness practices with journaling to deepen your self-awareness and live more fully in the present moment.",
    content: `# Mindfulness Through Journaling: Being Present on Paper

In our fast-paced world, mindfulness—the practice of being fully present—has become more important than ever. When combined with journaling, mindfulness becomes a powerful tool for self-discovery and peace.

## What is Mindful Journaling?

Mindful journaling is the practice of writing with full awareness and presence. It's not about documenting your day or planning tomorrow—it's about being fully engaged with your thoughts and feelings in this moment.

## The Benefits of Mindful Journaling

- Enhanced self-awareness
- Reduced rumination and worry
- Greater emotional balance
- Improved focus and concentration
- Deeper connection with yourself

## How to Practice Mindful Journaling

### 1. Set the Stage
Create a calm environment. Light a candle, play soft music, or simply find a quiet corner.

### 2. Begin with Breath
Take 5-10 deep breaths before you start writing. Notice the sensation of breathing.

### 3. Write in the Present Tense
Focus on what you're experiencing right now—sensations, emotions, thoughts.

### 4. Observe Without Judgment
Notice your thoughts and feelings without labeling them as good or bad.

### 5. Engage Your Senses
What do you see, hear, smell, taste, and feel in this moment?

## Mindful Journaling Prompts

- Right now, I am feeling...
- In this moment, I notice...
- My body is telling me...
- The present moment feels...
- I am grateful for this moment because...

## Making It a Daily Practice

Start with just 5 minutes a day. The goal isn't to write a lot—it's to write mindfully. WellPoint's journaling feature includes mindfulness prompts and reminders to help you build this powerful habit.

Begin your mindful journaling practice today with WellPoint.`,
    author: "Lisa Thompson",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    date: "2024-02-01",
    readTime: "7 min read",
    featuredImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
    category: "Mindfulness",
    tags: ["Mindfulness", "Present Moment", "Meditation", "Awareness"],
    featured: false,
    metaDescription: "Combine mindfulness practices with journaling to deepen self-awareness and live more fully in the present moment.",
    metaKeywords: ["mindful journaling", "mindfulness practice", "present moment awareness", "meditation journaling"]
  },
  {
    id: "5",
    slug: "journaling-for-anxiety",
    title: "Journaling for Anxiety: Calming Your Mind Through Writing",
    excerpt: "Discover specific journaling techniques that can help manage anxiety, reduce worry, and bring peace to your racing thoughts.",
    content: `# Journaling for Anxiety: Calming Your Mind Through Writing

If you struggle with anxiety, you know how overwhelming racing thoughts can feel. Journaling offers a practical, accessible way to manage anxiety and find calm amidst the storm.

## Why Journaling Helps Anxiety

Anxiety often involves:
- Racing, repetitive thoughts
- Catastrophic thinking
- Difficulty distinguishing real threats from perceived ones
- Physical tension and restlessness

Writing helps by:
- Slowing down your thoughts
- Creating distance from anxious feelings
- Identifying patterns and triggers
- Providing a healthy outlet for worry

## Anxiety-Specific Journaling Techniques

### The Worry Dump
Set a timer for 10 minutes and write down every worry, no matter how small. Getting them out of your head and onto paper reduces their power.

### The Reality Check
For each worry, write:
- What's the worst that could happen?
- What's the best that could happen?
- What's most likely to happen?

This helps put anxious thoughts in perspective.

### The Gratitude Shift
When anxiety strikes, list 10 things you're grateful for. This redirects your brain from threat-detection to appreciation.

### The Body Scan Journal
Write about physical sensations without judgment. "I notice tension in my shoulders. My breath is shallow." This builds awareness and helps release tension.

## Daily Anxiety Management Routine

**Morning**: Set intentions and identify potential triggers for the day
**Midday**: Quick check-in—how are you feeling? What do you need?
**Evening**: Reflect on what went well and release worries about tomorrow

## When Journaling Isn't Enough

If anxiety is significantly impacting your life, please seek professional help. Journaling is a powerful tool, but it works best as part of a comprehensive approach to mental health.

## Start Managing Your Anxiety Today

WellPoint's anxiety-focused journaling prompts and mood tracking can help you understand and manage your anxiety better. Create your free account and take the first step toward calmer days.`,
    author: "Dr. Rachel Green",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    date: "2024-02-05",
    readTime: "9 min read",
    featuredImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&q=80",
    category: "Mental Health",
    tags: ["Anxiety", "Stress Management", "Coping Skills", "Mental Wellness"],
    featured: false,
    metaDescription: "Learn specific journaling techniques to manage anxiety, reduce worry, and calm racing thoughts.",
    metaKeywords: ["anxiety journaling", "manage anxiety", "worry journal", "anxiety relief", "stress reduction"]
  }
];

export const categories = [
  "All",
  "Psychology",
  "Journaling Tips",
  "Healing",
  "Mindfulness",
  "Mental Health"
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === "All") return blogPosts;
  return blogPosts.filter(post => post.category === category);
};
