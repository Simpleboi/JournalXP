import { GuidedPath, DEFAULT_DISCLAIMER } from '../types/guidedReflection';

export const guidedPaths: GuidedPath[] = [
  {
    id: 'understanding-anxiety',
    title: 'Understanding Anxiety',
    tagline: 'Explore what anxiety feels like for you',
    description:
      'A gentle exploration of anxious feelings. This path helps you notice patterns, understand your experiences, and find what brings you calm.',
    icon: 'Waves',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-blue-50',
    borderColor: 'border-sky-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'anxiety-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Anxiety is something most people experience at some point. It can show up in many ways - racing thoughts, physical tension, a sense of dread, or just feeling on edge. There's no right or wrong way to feel anxious, and there's no \"fixing\" required here. This path is simply a space to explore your own experience with curiosity and kindness.",
        skippable: false,
      },
      {
        id: 'anxiety-prompt-1',
        type: 'prompt',
        title: 'Noticing Anxiety',
        content:
          "Let's start by getting curious about how anxiety shows up for you. There's no need to analyze or solve anything - just notice.",
        prompt:
          'When you feel anxious, where do you notice it first? Is it a thought, a feeling in your body, or something else? Describe it in your own words.',
        skippable: true,
      },
      {
        id: 'anxiety-prompt-2',
        type: 'prompt',
        title: 'Common Triggers',
        content:
          'Anxiety often has patterns. Sometimes certain situations, times of day, or even thoughts can bring it on. Understanding these patterns can help us feel less caught off guard.',
        prompt:
          'Think about a recent time you felt anxious. What was happening around you? What were you thinking about? Take your time describing the situation.',
        skippable: true,
      },
      {
        id: 'anxiety-exercise-1',
        type: 'exercise',
        title: 'Grounding Pause',
        content:
          "Before we continue, let's take a brief pause. This is completely optional - feel free to skip if it doesn't feel right.",
        exerciseInstructions: [
          'Take a slow breath in through your nose',
          'Notice your feet on the ground',
          'Look around and name 3 things you can see',
          'Take another slow breath out',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'anxiety-prompt-3',
        type: 'prompt',
        title: 'What Helps',
        content:
          "Even when anxiety feels overwhelming, you've likely found things that help, even a little. These don't have to be big things.",
        prompt:
          'What are some things that have helped you feel even slightly calmer when anxious? This could be anything - a person, a place, an activity, or even a small habit.',
        skippable: true,
      },
      {
        id: 'anxiety-prompt-4',
        type: 'prompt',
        title: 'The Story Underneath',
        content:
          'Sometimes anxiety carries a message or a worry about something important to us. This isn\'t always the case, but it can be worth exploring gently.',
        prompt:
          'If your anxiety could speak, what might it be trying to protect you from? What does it seem to care about? (It\'s okay if you\'re not sure.)',
        skippable: true,
      },
      {
        id: 'anxiety-exercise-2',
        type: 'exercise',
        title: 'Gentle Check-In',
        content: 'A simple moment to notice how you\'re feeling right now.',
        exerciseInstructions: [
          'Close your eyes if that feels comfortable',
          'Ask yourself: "How am I feeling right now?"',
          'Don\'t try to change anything - just notice',
          'When ready, open your eyes',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'anxiety-prompt-5',
        type: 'prompt',
        title: 'Compassion for Yourself',
        content:
          'Living with anxiety can be exhausting. You deserve kindness, especially from yourself.',
        prompt:
          'What would you say to a friend who was experiencing the same anxiety you feel? Can you offer yourself some of that same understanding?',
        skippable: true,
      },
      {
        id: 'anxiety-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "You've taken time to explore your experience with anxiety. That takes courage. Take a moment to capture any insights or things you want to remember.",
        prompt:
          'Looking back at this reflection, what stands out to you? Is there anything you want to remember or try going forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'burnout-overworking',
    title: 'Burnout & Overworking',
    tagline: 'Recognize the signs and find your pace',
    description:
      'When work or responsibilities take over, it\'s easy to lose sight of ourselves. This path helps you notice burnout patterns and reconnect with what matters.',
    icon: 'Battery',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'burnout-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Burnout isn't a character flaw - it's what happens when demands exceed our resources for too long. Whether it's work, caregiving, or life in general, running on empty affects everything. This path is a space to pause, notice what's happening, and consider what you might need.",
        skippable: false,
      },
      {
        id: 'burnout-prompt-1',
        type: 'prompt',
        title: 'Signs You Notice',
        content:
          'Burnout shows up differently for everyone - exhaustion, cynicism, feeling disconnected, physical symptoms, or just a sense that something is off.',
        prompt:
          'What signs have you been noticing in yourself lately? How do you know when you\'re running low on energy or motivation?',
        skippable: true,
      },
      {
        id: 'burnout-prompt-2',
        type: 'prompt',
        title: 'The Weight You Carry',
        content:
          'Sometimes we carry more than we realize. It can help to name what\'s on your plate.',
        prompt:
          'What responsibilities or pressures are weighing on you right now? Try to list them without judging whether they "should" feel heavy.',
        skippable: true,
      },
      {
        id: 'burnout-exercise-1',
        type: 'exercise',
        title: 'Body Scan',
        content:
          'Burnout often lives in the body. This brief exercise helps you check in with how you\'re physically feeling.',
        exerciseInstructions: [
          'Sit comfortably and take a breath',
          'Notice your shoulders - are they tense or relaxed?',
          'Notice your jaw - is it clenched?',
          'Notice your hands - are they gripping anything?',
          'Gently soften any tension you find',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'burnout-prompt-3',
        type: 'prompt',
        title: 'What Gets Lost',
        content:
          'When we\'re overworked, important parts of life often get pushed aside. It\'s worth noticing what\'s been neglected.',
        prompt:
          'What parts of your life have been getting less attention than they need? Relationships, hobbies, rest, health, fun? What do you miss?',
        skippable: true,
      },
      {
        id: 'burnout-prompt-4',
        type: 'prompt',
        title: 'The "Why" Behind the Work',
        content:
          'Sometimes we overwork because we feel we have to. Sometimes there are deeper reasons - fear, identity, expectations.',
        prompt:
          'What drives you to keep going even when you\'re exhausted? What are you afraid might happen if you slow down?',
        skippable: true,
      },
      {
        id: 'burnout-prompt-5',
        type: 'prompt',
        title: 'Small Recoveries',
        content:
          'Recovery doesn\'t always require big changes. Small moments of rest add up.',
        prompt:
          'What small thing could you do today or this week that would feel like a tiny bit of recovery? Something just for you.',
        skippable: true,
      },
      {
        id: 'burnout-exercise-2',
        type: 'exercise',
        title: 'Permission Slip',
        content:
          'Sometimes we need permission to rest - even if it\'s from ourselves.',
        exerciseInstructions: [
          'Take a breath and say (silently or aloud):',
          '"I am allowed to rest."',
          '"My worth is not measured by my productivity."',
          '"I am doing enough."',
          'Notice how these statements feel',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'burnout-prompt-6',
        type: 'prompt',
        title: 'Boundaries',
        content:
          'Boundaries aren\'t selfish - they\'re how we protect our energy for what matters most.',
        prompt:
          'Is there one boundary you\'ve been wanting to set but haven\'t? What makes it hard? What might make it easier?',
        skippable: true,
      },
      {
        id: 'burnout-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You\'ve taken time to look honestly at your relationship with work and rest. That\'s an act of self-care in itself.',
        prompt:
          'What\'s one thing you want to remember from this reflection? What\'s one small step you might take?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-self-compassion',
    title: 'Building Self-Compassion',
    tagline: 'Practice being kinder to yourself',
    description:
      'Many of us are harder on ourselves than we\'d ever be on a friend. This path explores what it means to offer yourself the same kindness you give others.',
    icon: 'Heart',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-pink-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'compassion-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-compassion isn't about letting yourself off the hook or ignoring problems. It's about treating yourself with the same understanding you'd offer someone you care about. For many of us, this doesn't come naturally - but it can be learned.",
        skippable: false,
      },
      {
        id: 'compassion-prompt-1',
        type: 'prompt',
        title: 'Your Inner Critic',
        content:
          'Most of us have an inner critic - that voice that points out our flaws, mistakes, and shortcomings. Getting to know this voice can help us respond to it differently.',
        prompt:
          'What does your inner critic tend to say? What are the phrases or criticisms that come up most often? Write them down as if you\'re describing someone else\'s voice.',
        skippable: true,
      },
      {
        id: 'compassion-prompt-2',
        type: 'prompt',
        title: 'Where It Comes From',
        content:
          'Our inner critic often has old origins - things we heard growing up, experiences that shaped how we see ourselves.',
        prompt:
          'Does your inner critic remind you of anyone or any experience from your past? Where do you think these messages came from?',
        skippable: true,
      },
      {
        id: 'compassion-exercise-1',
        type: 'exercise',
        title: 'Hand on Heart',
        content:
          'Physical touch can activate our care system. This simple gesture can help you connect with self-compassion.',
        exerciseInstructions: [
          'Place one or both hands over your heart',
          'Feel the warmth and gentle pressure',
          'Take a few slow breaths',
          'If it feels right, say "May I be kind to myself"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'compassion-prompt-3',
        type: 'prompt',
        title: 'What You\'d Tell a Friend',
        content:
          'We\'re often much kinder to friends than to ourselves. Let\'s borrow some of that kindness.',
        prompt:
          'Think of a struggle you\'re currently facing. If a close friend came to you with this exact same struggle, what would you say to them? Write it as if you\'re speaking to that friend.',
        skippable: true,
      },
      {
        id: 'compassion-prompt-4',
        type: 'prompt',
        title: 'Common Humanity',
        content:
          'Suffering and imperfection are part of being human. You\'re not alone in your struggles, even when it feels that way.',
        prompt:
          'What\'s something you criticize yourself for that many other people also struggle with? How does it feel to remember you\'re not the only one?',
        skippable: true,
      },
      {
        id: 'compassion-exercise-2',
        type: 'exercise',
        title: 'Compassionate Breath',
        content:
          'This brief practice combines breathing with kind intentions toward yourself.',
        exerciseInstructions: [
          'Breathe in slowly, imagining you\'re breathing in kindness',
          'Breathe out slowly, imagining you\'re letting go of self-judgment',
          'Repeat 3-4 times',
          'Notice any shift in how you feel',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'compassion-prompt-5',
        type: 'prompt',
        title: 'Rewriting the Script',
        content:
          'What if your inner critic\'s messages could be translated into something kinder but still honest?',
        prompt:
          'Take one of your inner critic\'s common phrases and try to rewrite it as something a compassionate mentor might say instead. Keep the core concern, but change the tone.',
        skippable: true,
      },
      {
        id: 'compassion-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Self-compassion is a practice, not a destination. Every small moment of kindness toward yourself matters.',
        prompt:
          'What insight from this reflection do you want to carry with you? How might you remind yourself to practice self-compassion?',
        skippable: false,
      },
    ],
  },
  {
    id: 'processing-change-loss',
    title: 'Processing Change or Loss',
    tagline: 'Gentle space for difficult transitions',
    description:
      'Change and loss are part of life, but that doesn\'t make them easy. This path offers a quiet space to sit with what you\'re experiencing and find your own way through.',
    icon: 'Leaf',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-teal-50',
    borderColor: 'border-emerald-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'change-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Whether you're facing a major life change, grieving a loss, or navigating an uncertain transition, it's natural to feel a mix of emotions. There's no right way to process change - and no timeline you need to follow. This path is simply a space to be with whatever you're experiencing.",
        skippable: false,
      },
      {
        id: 'change-prompt-1',
        type: 'prompt',
        title: 'Naming What\'s Happening',
        content:
          'Sometimes it helps to put words to what we\'re going through, even if those words feel incomplete.',
        prompt:
          'In your own words, what change or loss are you processing right now? Take your time - there\'s no need to explain it perfectly.',
        skippable: true,
      },
      {
        id: 'change-prompt-2',
        type: 'prompt',
        title: 'The Full Range',
        content:
          'It\'s common to feel many things at once - sadness and relief, anger and love, fear and hope. All of these can exist together.',
        prompt:
          'What emotions have you been experiencing around this change? Try to name as many as you can, without judging any of them.',
        skippable: true,
      },
      {
        id: 'change-exercise-1',
        type: 'exercise',
        title: 'Grounding in the Present',
        content:
          'When we\'re processing change, our minds often jump between past and future. This exercise helps anchor you in the present moment.',
        exerciseInstructions: [
          'Feel your feet on the floor',
          'Name 5 things you can see right now',
          'Name 3 things you can hear',
          'Take one deep breath',
          'Remind yourself: "Right now, I am here"',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'change-prompt-3',
        type: 'prompt',
        title: 'What You\'re Grieving',
        content:
          'Loss isn\'t always about death. We can grieve relationships, identities, dreams, places, or versions of ourselves.',
        prompt:
          'What are you grieving in this change? What have you lost, or what are you afraid of losing? It\'s okay if this is hard to articulate.',
        skippable: true,
      },
      {
        id: 'change-prompt-4',
        type: 'prompt',
        title: 'What Remains',
        content:
          'Even in significant change, some things continue. Noticing what remains can provide a sense of stability.',
        prompt:
          'What parts of your life, your self, or your world remain unchanged? What or who is still here with you?',
        skippable: true,
      },
      {
        id: 'change-exercise-2',
        type: 'exercise',
        title: 'A Moment of Stillness',
        content:
          'Sometimes we just need permission to pause and feel whatever we\'re feeling.',
        exerciseInstructions: [
          'Close your eyes if comfortable',
          'Take a few natural breaths',
          'Let whatever emotion is present be there',
          'You don\'t need to fix or change anything',
          'When ready, gently open your eyes',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'change-prompt-5',
        type: 'prompt',
        title: 'Support and Connection',
        content:
          'We\'re not meant to go through hard things alone, though it can feel that way sometimes.',
        prompt:
          'Who or what has been supporting you through this change? Is there support you wish you had, or someone you might reach out to?',
        skippable: true,
      },
      {
        id: 'change-prompt-6',
        type: 'prompt',
        title: 'What You Need',
        content:
          'There\'s no right way to move through change, but there might be things that would help.',
        prompt:
          'What do you need right now? This could be something practical, emotional, or even just permission to feel a certain way.',
        skippable: true,
      },
      {
        id: 'change-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You\'ve spent time with something difficult. That takes courage. There\'s no pressure to have it all figured out.',
        prompt:
          'What would you like to remember from this reflection? Is there anything you want to honor or hold onto as you continue forward?',
        skippable: false,
      },
    ],
  },
];

export function getPathById(id: string): GuidedPath | undefined {
  return guidedPaths.find((path) => path.id === id);
}

export function getPathStepById(
  pathId: string,
  stepId: string
): { path: GuidedPath; step: import('../types/guidedReflection').PathStep; stepIndex: number } | undefined {
  const path = getPathById(pathId);
  if (!path) return undefined;
  const stepIndex = path.steps.findIndex((s) => s.id === stepId);
  if (stepIndex === -1) return undefined;
  return { path, step: path.steps[stepIndex], stepIndex };
}
