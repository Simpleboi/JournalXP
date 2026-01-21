import { GuidedPath, DEFAULT_DISCLAIMER } from '../types/guidedReflection';

export const guidedPaths: GuidedPath[] = [
  {
    id: 'understanding-anxiety',
    title: 'Understanding Anxiety',
    tagline: 'Explore what anxiety feels like for you',
    category: 'Emotional Regulation',
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
          "Anxiety is something most people experience at some point. It can show up in many ways like racing thoughts, physical tension, a sense of dread, or just feeling on edge. There's no right or wrong way to feel anxious, and there's no \"fixing\" required here. This path is simply a space to explore your own experience with curiosity and kindness.",
        skippable: false,
      },
      {
        id: 'anxiety-prompt-1',
        type: 'prompt',
        title: 'Noticing Anxiety',
        content:
          "Let's start by getting curious about how anxiety shows up for you. There's no need to analyze or solve anything, just notice.",
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
          "Before we continue, let's take a brief pause. This is completely optional, feel free to skip if it doesn't feel right.",
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
          'What are some things that have helped you feel even slightly calmer when anxious? This could be anything like a person, a place, an activity, or even a small habit.',
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
          'Don\'t try to change anything, just notice',
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
    category: 'Life Transitions',
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
          "Burnout isn't a character flaw, it's what happens when demands exceed our resources for too long. Whether it's work, caregiving, or life in general, running on empty affects everything. This path is a space to pause, notice what's happening, and consider what you might need.",
        skippable: false,
      },
      {
        id: 'burnout-prompt-1',
        type: 'prompt',
        title: 'Signs You Notice',
        content:
          'Burnout shows up differently for everyone, exhaustion, cynicism, feeling disconnected, physical symptoms, or just a sense that something is off.',
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
          'Notice your shoulders, are they tense or relaxed?',
          'Notice your jaw, is it clenched?',
          'Notice your hands, are they gripping anything?',
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
          'Sometimes we need permission to rest, even if it\'s from ourselves.',
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
          'Boundaries aren\'t selfish, they\'re how we protect our energy for what matters most.',
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
    category: 'Self-Development',
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
          "Self-compassion isn't about letting yourself off the hook or ignoring problems. It's about treating yourself with the same understanding you'd offer someone you care about. For many of us, this doesn't come naturally, but it can be learned.",
        skippable: false,
      },
      {
        id: 'compassion-prompt-1',
        type: 'prompt',
        title: 'Your Inner Critic',
        content:
          'Most of us have an inner critic,  that voice that points out our flaws, mistakes, and shortcomings. Getting to know this voice can help us respond to it differently.',
        prompt:
          'What does your inner critic tend to say? What are the phrases or criticisms that come up most often? Write them down as if you\'re describing someone else\'s voice.',
        skippable: true,
      },
      {
        id: 'compassion-prompt-2',
        type: 'prompt',
        title: 'Where It Comes From',
        content:
          'Our inner critic often has old origins, things we heard growing up, experiences that shaped how we see ourselves.',
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
    category: 'Life Transitions',
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
          "Whether you're facing a major life change, grieving a loss, or navigating an uncertain transition, it's natural to feel a mix of emotions. There's no right way to process change, and no timeline you need to follow. This path is simply a space to be with whatever you're experiencing.",
        skippable: false,
      },
      {
        id: 'change-prompt-1',
        type: 'prompt',
        title: 'Naming What\'s Happening',
        content:
          'Sometimes it helps to put words to what we\'re going through, even if those words feel incomplete.',
        prompt:
          'In your own words, what change or loss are you processing right now? Take your time, there\'s no need to explain it perfectly.',
        skippable: true,
      },
      {
        id: 'change-prompt-2',
        type: 'prompt',
        title: 'The Full Range',
        content:
          'It\'s common to feel many things at once, sadness and relief, anger and love, fear and hope. All of these can exist together.',
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
  {
    id: 'managing-stress',
    title: 'Managing Stress',
    tagline: 'Find calm in the chaos',
    category: 'Emotional Regulation',
    description:
      'Stress is a natural response, but chronic stress takes a toll. This path helps you understand your stress patterns and discover what helps you find balance.',
    icon: 'CloudRain',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-gray-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'stress-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Stress isn't always bad, it can motivate us and help us respond to challenges. But when stress becomes constant or overwhelming, it affects our health, relationships, and wellbeing. This path is about understanding your relationship with stress and finding what works for you.",
        skippable: false,
      },
      {
        id: 'stress-prompt-1',
        type: 'prompt',
        title: 'Your Stress Signals',
        content:
          'Stress shows up differently for everyone. Some feel it in their body, others in their thoughts or emotions.',
        prompt:
          'How does stress show up for you? Where do you feel it in your body? What happens to your thoughts, mood, or behavior when you\'re stressed?',
        skippable: true,
      },
      {
        id: 'stress-prompt-2',
        type: 'prompt',
        title: 'Current Stressors',
        content:
          'Sometimes naming what\'s causing stress can help us see it more clearly.',
        prompt:
          'What are the main sources of stress in your life right now? Try to list them without judgment, big or small, they all count.',
        skippable: true,
      },
      {
        id: 'stress-exercise-1',
        type: 'exercise',
        title: 'Box Breathing',
        content:
          'This simple breathing technique can help activate your body\'s relaxation response.',
        exerciseInstructions: [
          'Breathe in slowly for 4 counts',
          'Hold your breath for 4 counts',
          'Breathe out slowly for 4 counts',
          'Hold empty for 4 counts',
          'Repeat 3-4 times',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'stress-prompt-3',
        type: 'prompt',
        title: 'What You Can Control',
        content:
          'Some stressors are within our control, others aren\'t. Recognizing the difference can help us focus our energy.',
        prompt:
          'Looking at your stressors, which ones can you influence or change? Which ones are outside your control? How does it feel to make this distinction?',
        skippable: true,
      },
      {
        id: 'stress-prompt-4',
        type: 'prompt',
        title: 'Your Relief Valves',
        content:
          'We all have ways of coping with stress, some helpful, some less so. There\'s no judgment here.',
        prompt:
          'What do you currently do when you\'re stressed? Which of these habits help you, and which might be making things harder?',
        skippable: true,
      },
      {
        id: 'stress-prompt-5',
        type: 'prompt',
        title: 'Small Acts of Care',
        content:
          'We can\'t always remove stress, but we can add moments of relief.',
        prompt:
          'What small things help you feel even slightly calmer or more grounded? What could you do more of?',
        skippable: true,
      },
      {
        id: 'stress-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Understanding your stress is the first step toward managing it. You don\'t have to fix everything at once.',
        prompt:
          'What\'s one insight about your stress that you want to remember? Is there one small thing you\'d like to try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'improving-sleep',
    title: 'Improving Sleep & Rest',
    tagline: 'Cultivate better rest',
    category: 'Wellness',
    description:
      'Sleep affects everything, mood, energy, health, and how we handle life. This path explores your relationship with rest and what might help you sleep better.',
    icon: 'Moon',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-violet-50',
    borderColor: 'border-indigo-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'sleep-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Rest is not a luxury, it's a necessity. Yet many of us struggle with sleep, whether it's falling asleep, staying asleep, or simply allowing ourselves to rest. This path is a gentle exploration of your sleep patterns and what might help you find more restful nights.",
        skippable: false,
      },
      {
        id: 'sleep-prompt-1',
        type: 'prompt',
        title: 'Your Sleep Story',
        content:
          'Everyone has a unique relationship with sleep. Understanding yours is the first step.',
        prompt:
          'How would you describe your current relationship with sleep? What does a typical night look like for you? What about a good night versus a difficult one?',
        skippable: true,
      },
      {
        id: 'sleep-prompt-2',
        type: 'prompt',
        title: 'What Gets in the Way',
        content:
          'Many things can interfere with sleep, thoughts, habits, environment, or life circumstances.',
        prompt:
          'What tends to get in the way of good sleep for you? Is it falling asleep, staying asleep, or something else? What\'s usually on your mind at bedtime?',
        skippable: true,
      },
      {
        id: 'sleep-exercise-1',
        type: 'exercise',
        title: 'Body Relaxation',
        content:
          'This gentle exercise helps release physical tension that can interfere with sleep.',
        exerciseInstructions: [
          'Starting at your feet, notice any tension',
          'Imagine that tension softening and releasing',
          'Move up to your legs, then your belly',
          'Continue to your chest, arms, and shoulders',
          'Finally, let your face and jaw relax',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'sleep-prompt-3',
        type: 'prompt',
        title: 'Your Wind-Down',
        content:
          'The hour before bed significantly affects sleep quality.',
        prompt:
          'What does your typical evening look like? What do you do in the hour before bed? How does this affect how you feel when you try to sleep?',
        skippable: true,
      },
      {
        id: 'sleep-prompt-4',
        type: 'prompt',
        title: 'Rest Beyond Sleep',
        content:
          'Rest isn\'t just about nighttime sleep. We need different kinds of rest throughout the day.',
        prompt:
          'Beyond sleep, how do you rest? Do you give yourself permission to take breaks, to do nothing, to just be? What gets in the way of daytime rest?',
        skippable: true,
      },
      {
        id: 'sleep-prompt-5',
        type: 'prompt',
        title: 'Small Sleep Improvements',
        content:
          'Big changes to sleep habits rarely stick. Small adjustments are more sustainable.',
        prompt:
          'What\'s one small thing you could try that might improve your sleep or rest? Something simple and doable?',
        skippable: true,
      },
      {
        id: 'sleep-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Better sleep often comes gradually. Be patient with yourself as you explore what works.',
        prompt:
          'What have you learned about your sleep and rest needs? What would you like to remember or try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-boundaries',
    title: 'Building Healthy Boundaries',
    tagline: 'Protect your energy and peace',
    category: 'Relationships',
    description:
      'Boundaries help us protect our time, energy, and wellbeing. This path explores what boundaries mean to you and how to set them with kindness.',
    icon: 'Shield',
    gradientFrom: 'from-cyan-50',
    gradientTo: 'to-sky-50',
    borderColor: 'border-cyan-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'boundaries-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Boundaries aren't walls, they're guidelines that help us maintain our wellbeing while staying connected to others. Many of us weren't taught how to set boundaries, and it can feel uncomfortable at first. This path is about understanding what you need and finding ways to honor those needs.",
        skippable: false,
      },
      {
        id: 'boundaries-prompt-1',
        type: 'prompt',
        title: 'Where You Feel Drained',
        content:
          'Often, our need for boundaries shows up as exhaustion, resentment, or feeling overwhelmed.',
        prompt:
          'Where in your life do you feel drained or resentful? What situations or relationships leave you feeling depleted? What patterns do you notice?',
        skippable: true,
      },
      {
        id: 'boundaries-prompt-2',
        type: 'prompt',
        title: 'Messages About Boundaries',
        content:
          'Many of us received messages growing up that made boundaries feel wrong or selfish.',
        prompt:
          'What did you learn about boundaries growing up? Were they modeled for you? What messages did you receive about saying no or putting yourself first?',
        skippable: true,
      },
      {
        id: 'boundaries-exercise-1',
        type: 'exercise',
        title: 'Centering',
        content:
          'This brief exercise helps you connect with your own needs and feelings.',
        exerciseInstructions: [
          'Take a deep breath and place a hand on your chest',
          'Ask yourself: "What do I need right now?"',
          'Listen without judgment',
          'Notice what comes up',
          'Thank yourself for listening',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'boundaries-prompt-3',
        type: 'prompt',
        title: 'Your Non-Negotiables',
        content:
          'Some boundaries protect things that are essential to your wellbeing.',
        prompt:
          'What are your non-negotiables, the things you need to function and feel okay? These might be about time, space, respect, or self-care.',
        skippable: true,
      },
      {
        id: 'boundaries-prompt-4',
        type: 'prompt',
        title: 'The Fear of Setting Boundaries',
        content:
          'Setting boundaries can bring up fears about how others will react.',
        prompt:
          'What fears come up when you think about setting boundaries? What are you afraid might happen? How realistic are these fears?',
        skippable: true,
      },
      {
        id: 'boundaries-prompt-5',
        type: 'prompt',
        title: 'Boundaries with Kindness',
        content:
          'Boundaries don\'t have to be harsh. They can be set with care and respect.',
        prompt:
          'Think of a boundary you need to set. How could you communicate it clearly but kindly? What words might you use?',
        skippable: true,
      },
      {
        id: 'boundaries-exercise-2',
        type: 'exercise',
        title: 'Affirmation',
        content:
          'Remind yourself that boundaries are an act of self-respect.',
        exerciseInstructions: [
          'Take a breath and say to yourself:',
          '"My needs matter."',
          '"Setting boundaries is an act of self-care."',
          '"I can be kind and still protect my energy."',
          'Notice how these words feel',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'boundaries-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Building boundaries is a process. Start small and be patient with yourself.',
        prompt:
          'What\'s one boundary you\'d like to work on? What\'s the smallest step you could take toward honoring your needs?',
        skippable: false,
      },
    ],
  },
  {
    id: 'overcoming-perfectionism',
    title: 'Overcoming Perfectionism',
    tagline: 'Embrace good enough',
    category: 'Self-Development',
    description:
      'Perfectionism can masquerade as high standards, but often it holds us back. This path explores the difference between striving and suffering.',
    icon: 'Target',
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-yellow-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'perfectionism-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Perfectionism isn't about having high standards, it's about believing that your worth depends on being perfect. It can lead to procrastination, anxiety, and never feeling good enough. This path is about finding freedom from impossible standards while still caring about what you do.",
        skippable: false,
      },
      {
        id: 'perfectionism-prompt-1',
        type: 'prompt',
        title: 'Where Perfectionism Shows Up',
        content:
          'Perfectionism often targets specific areas of our lives more than others.',
        prompt:
          'Where does perfectionism show up most strongly for you? Work, relationships, appearance, parenting, creative pursuits? How does it manifest?',
        skippable: true,
      },
      {
        id: 'perfectionism-prompt-2',
        type: 'prompt',
        title: 'The Cost of Perfect',
        content:
          'Perfectionism often promises success but delivers stress, procrastination, and self-criticism.',
        prompt:
          'What has perfectionism cost you? Think about time, energy, joy, relationships, or opportunities. What have you avoided or abandoned because it couldn\'t be perfect?',
        skippable: true,
      },
      {
        id: 'perfectionism-prompt-3',
        type: 'prompt',
        title: 'The Voice of Never Enough',
        content:
          'Perfectionism often speaks in a particular voice, with particular phrases.',
        prompt:
          'What does your perfectionist voice say to you? What are its favorite criticisms or demands? Where did this voice come from?',
        skippable: true,
      },
      {
        id: 'perfectionism-exercise-1',
        type: 'exercise',
        title: 'Good Enough',
        content:
          'Practice the feeling of "good enough", it might feel unfamiliar.',
        exerciseInstructions: [
          'Think of something you did recently that was good enough',
          'Notice any urge to qualify or criticize it',
          'Take a breath and simply say "This was good enough"',
          'Let that statement stand without adding anything',
          'Notice how this feels',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'perfectionism-prompt-4',
        type: 'prompt',
        title: 'What You\'re Really Afraid Of',
        content:
          'Underneath perfectionism, there\'s often a fear about what imperfection means.',
        prompt:
          'What are you afraid would happen if you weren\'t perfect? What do you believe imperfection says about you? Are these beliefs true?',
        skippable: true,
      },
      {
        id: 'perfectionism-prompt-5',
        type: 'prompt',
        title: 'Permission to Be Human',
        content:
          'What would it be like to release yourself from impossible standards?',
        prompt:
          'If you gave yourself full permission to be imperfect, what would change? What would you try? How would you treat yourself differently?',
        skippable: true,
      },
      {
        id: 'perfectionism-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Progress, not perfection. You don\'t have to be perfect to be worthy.',
        prompt:
          'What insight about your perfectionism do you want to remember? What would "good enough" look like in one area of your life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'dealing-with-loneliness',
    title: 'Dealing with Loneliness',
    tagline: 'Finding connection, starting with yourself',
    category: 'Relationships',
    description:
      'Loneliness is more common than we admit. This path explores what loneliness means for you and gentle ways to nurture connection.',
    icon: 'Users',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-violet-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'loneliness-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Loneliness doesn't always mean being alone, you can feel lonely in a crowd or in a relationship. It's about feeling disconnected, unseen, or like you don't belong. This is more common than people admit, and it's nothing to be ashamed of. This path is a space to explore your experience with loneliness.",
        skippable: false,
      },
      {
        id: 'loneliness-prompt-1',
        type: 'prompt',
        title: 'Your Experience of Loneliness',
        content:
          'Loneliness feels different for everyone. Understanding your experience is the first step.',
        prompt:
          'How does loneliness show up for you? When do you feel it most? Is it about being alone, or something else? Describe it in your own words.',
        skippable: true,
      },
      {
        id: 'loneliness-prompt-2',
        type: 'prompt',
        title: 'What\'s Missing',
        content:
          'Sometimes loneliness points to specific needs that aren\'t being met.',
        prompt:
          'What kind of connection are you longing for? Is it someone to talk to, to share experiences with, to be truly seen by? What\'s missing?',
        skippable: true,
      },
      {
        id: 'loneliness-exercise-1',
        type: 'exercise',
        title: 'Self-Connection',
        content:
          'Before connecting with others, it helps to connect with yourself.',
        exerciseInstructions: [
          'Place a hand on your heart',
          'Take a slow breath',
          'Say to yourself: "I am here with you"',
          'Notice what it feels like to offer yourself presence',
          'Stay here for a few breaths',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'loneliness-prompt-3',
        type: 'prompt',
        title: 'Barriers to Connection',
        content:
          'Sometimes there are reasons, internal or external, that make connection difficult.',
        prompt:
          'What gets in the way of connection for you? Is it fear, past hurts, circumstances, or something else? What makes it hard to reach out?',
        skippable: true,
      },
      {
        id: 'loneliness-prompt-4',
        type: 'prompt',
        title: 'Moments of Belonging',
        content:
          'Even in loneliness, there may be times when you\'ve felt connected.',
        prompt:
          'Think of a time when you felt truly connected or like you belonged. What was happening? Who was there? What made it feel that way?',
        skippable: true,
      },
      {
        id: 'loneliness-prompt-5',
        type: 'prompt',
        title: 'Small Steps Toward Connection',
        content:
          'Connection doesn\'t have to be dramatic. Small moments matter.',
        prompt:
          'What\'s one small step you could take toward connection? This could be reaching out to someone, joining something, or simply being more present with people you already see.',
        skippable: true,
      },
      {
        id: 'loneliness-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Loneliness is painful, but it\'s also a signal that connection matters to you. That\'s a strength.',
        prompt:
          'What have you learned about your loneliness? What would you like to remember, and what might you try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-motivation',
    title: 'Finding Motivation',
    tagline: 'Reconnect with what drives you',
    category: 'Growth & Purpose',
    description:
      'When motivation fades, everything feels harder. This path helps you understand what depletes your motivation and what might help restore it.',
    icon: 'Flame',
    gradientFrom: 'from-red-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-red-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'motivation-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Motivation isn't constant, it ebbs and flows. When it's low, even simple tasks feel impossible. This isn't a character flaw; it's a signal worth paying attention to. This path explores what might be affecting your motivation and what could help you reconnect with your drive.",
        skippable: false,
      },
      {
        id: 'motivation-prompt-1',
        type: 'prompt',
        title: 'Where You Are Now',
        content:
          'Understanding your current state helps clarify what you need.',
        prompt:
          'How would you describe your motivation right now? What feels hard to do? What, if anything, still feels doable or even enjoyable?',
        skippable: true,
      },
      {
        id: 'motivation-prompt-2',
        type: 'prompt',
        title: 'What\'s Draining You',
        content:
          'Low motivation often has underlying causes, exhaustion, stress, lack of meaning, or feeling stuck.',
        prompt:
          'What do you think might be contributing to your low motivation? Is it physical exhaustion, emotional drain, lack of direction, or something else?',
        skippable: true,
      },
      {
        id: 'motivation-exercise-1',
        type: 'exercise',
        title: 'Energy Check-In',
        content:
          'A quick scan to notice what\'s happening in your body and mind.',
        exerciseInstructions: [
          'Take a breath and close your eyes',
          'Notice your physical energy level (1-10)',
          'Notice your emotional state',
          'Notice any thoughts that are present',
          'Accept whatever you find without judgment',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'motivation-prompt-3',
        type: 'prompt',
        title: 'What Used to Work',
        content:
          'There may have been times when you felt more motivated. What was different?',
        prompt:
          'Think of a time when you felt motivated and engaged. What was happening in your life? What were you doing? What made that time different from now?',
        skippable: true,
      },
      {
        id: 'motivation-prompt-4',
        type: 'prompt',
        title: 'What Matters to You',
        content:
          'Motivation is often connected to meaning and values.',
        prompt:
          'What matters to you? What do you care about? Are your current activities connected to these values, or have you drifted away from what\'s meaningful?',
        skippable: true,
      },
      {
        id: 'motivation-prompt-5',
        type: 'prompt',
        title: 'The Smallest Step',
        content:
          'When motivation is low, tiny steps are better than no steps.',
        prompt:
          'What\'s the smallest possible action you could take toward something that matters to you? Something so small it barely counts?',
        skippable: true,
      },
      {
        id: 'motivation-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Motivation often returns when we address what\'s draining us and reconnect with what matters. Be patient with yourself.',
        prompt:
          'What insight about your motivation stands out? What\'s one small thing you might try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'coping-with-uncertainty',
    title: 'Coping with Uncertainty',
    tagline: 'Find steadiness in the unknown',
    category: 'Life Transitions',
    description:
      'Uncertainty is uncomfortable, but it\'s also unavoidable. This path helps you build tolerance for not knowing and find peace in the present.',
    icon: 'HelpCircle',
    gradientFrom: 'from-stone-50',
    gradientTo: 'to-zinc-50',
    borderColor: 'border-stone-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'uncertainty-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We like to feel in control, to know what's coming. But life is fundamentally uncertain, and fighting this reality causes suffering. This path isn't about eliminating uncertainty, that's impossible, but about building your capacity to be okay even when you don't know what's next.",
        skippable: false,
      },
      {
        id: 'uncertainty-prompt-1',
        type: 'prompt',
        title: 'What\'s Uncertain Now',
        content:
          'Naming the uncertainties we\'re facing can make them feel more manageable.',
        prompt:
          'What uncertainties are you currently facing? What don\'t you know that you wish you knew? How does this uncertainty affect you?',
        skippable: true,
      },
      {
        id: 'uncertainty-prompt-2',
        type: 'prompt',
        title: 'Your Relationship with Not Knowing',
        content:
          'We all respond to uncertainty differently, based on our history and temperament.',
        prompt:
          'How do you typically respond to uncertainty? Do you try to control, avoid, worry, or something else? Where did you learn to respond this way?',
        skippable: true,
      },
      {
        id: 'uncertainty-exercise-1',
        type: 'exercise',
        title: 'Anchoring to Now',
        content:
          'When uncertainty pulls us into the future, anchoring to the present can help.',
        exerciseInstructions: [
          'Feel your feet on the ground',
          'Notice the temperature of the air',
          'Listen to the sounds around you',
          'Remind yourself: "Right now, in this moment, I am okay"',
          'Take a slow breath',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'uncertainty-prompt-3',
        type: 'prompt',
        title: 'What You Can Count On',
        content:
          'Even in uncertainty, some things remain stable.',
        prompt:
          'What can you count on, even now? This might be people, your own qualities, routines, or simple facts about your life.',
        skippable: true,
      },
      {
        id: 'uncertainty-prompt-4',
        type: 'prompt',
        title: 'Uncertainty You\'ve Survived',
        content:
          'You\'ve faced uncertainty before and come through it.',
        prompt:
          'Think of past uncertainties that eventually resolved. How did you cope? What helped? What did you learn about your ability to handle not knowing?',
        skippable: true,
      },
      {
        id: 'uncertainty-prompt-5',
        type: 'prompt',
        title: 'Making Peace with Not Knowing',
        content:
          'What would it be like to need less certainty?',
        prompt:
          'If you could be more at peace with uncertainty, what would change? What might you do differently? What would you worry about less?',
        skippable: true,
      },
      {
        id: 'uncertainty-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Uncertainty is uncomfortable, but you\'ve survived it before. You can learn to hold it more lightly.',
        prompt:
          'What insight about uncertainty do you want to carry with you? How might you remind yourself of this when uncertainty feels overwhelming?',
        skippable: false,
      },
    ],
  },
  {
    id: 'healing-from-rejection',
    title: 'Healing from Rejection',
    tagline: 'Process the pain of being turned away',
    category: 'Life Transitions',
    description:
      'Rejection hurts deeply because belonging matters to us. This path offers space to process rejection and rebuild your sense of worth.',
    icon: 'HeartCrack',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-pink-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'rejection-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Rejection activates the same brain regions as physical pain, it literally hurts. Whether it's romantic rejection, social exclusion, job loss, or any other form of being turned away, the pain is real. This path is a space to process that pain and remember your worth.",
        skippable: false,
      },
      {
        id: 'rejection-prompt-1',
        type: 'prompt',
        title: 'What Happened',
        content:
          'Sometimes we need to tell the story of what happened, even if it\'s painful.',
        prompt:
          'Describe the rejection you\'re processing. What happened? You don\'t have to share every detail, just what feels important to name.',
        skippable: true,
      },
      {
        id: 'rejection-prompt-2',
        type: 'prompt',
        title: 'The Feelings Underneath',
        content:
          'Rejection often brings up many emotions at once.',
        prompt:
          'What emotions are you experiencing? Hurt, anger, shame, sadness, confusion? Let yourself name all of them without judgment.',
        skippable: true,
      },
      {
        id: 'rejection-exercise-1',
        type: 'exercise',
        title: 'Soothing Touch',
        content:
          'Physical comfort can help when we\'re in emotional pain.',
        exerciseInstructions: [
          'Place both hands over your heart',
          'Feel the warmth and pressure',
          'If it feels right, gently rub your chest',
          'Say to yourself: "This hurts, and that\'s okay"',
          'Stay here for a few breaths',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'rejection-prompt-3',
        type: 'prompt',
        title: 'The Story You\'re Telling Yourself',
        content:
          'Rejection often triggers painful stories about ourselves.',
        prompt:
          'What is this rejection making you believe about yourself? What story are you telling yourself about what it means? Is this story true, or is it pain talking?',
        skippable: true,
      },
      {
        id: 'rejection-prompt-4',
        type: 'prompt',
        title: 'Another Perspective',
        content:
          'There are often many reasons for rejection, most of which have nothing to do with our worth.',
        prompt:
          'Are there other ways to interpret this rejection? Could there be factors that had nothing to do with you? What would a kind friend say about what happened?',
        skippable: true,
      },
      {
        id: 'rejection-prompt-5',
        type: 'prompt',
        title: 'What Remains True',
        content:
          'Rejection doesn\'t erase your worth or what you have to offer.',
        prompt:
          'What do you know is true about yourself, regardless of this rejection? What qualities, gifts, or worth do you have that this experience doesn\'t take away?',
        skippable: true,
      },
      {
        id: 'rejection-exercise-2',
        type: 'exercise',
        title: 'Self-Compassion Phrases',
        content:
          'Offer yourself the kindness you would give a friend.',
        exerciseInstructions: [
          'Take a breath and say to yourself:',
          '"This is a moment of pain"',
          '"Rejection is part of life; I\'m not alone in this"',
          '"May I be kind to myself"',
          'Let these words settle',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'rejection-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Rejection hurts, but it doesn\'t define you. Healing takes time, and you\'re already on your way.',
        prompt:
          'What do you want to remember as you heal from this rejection? What truth about yourself will you hold onto?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-confidence',
    title: 'Building Confidence',
    tagline: 'Trust yourself more',
    category: 'Self-Development',
    description:
      'Confidence isn\'t about being perfect or fearless, it\'s about trusting yourself to handle whatever comes. This path explores what confidence means to you.',
    icon: 'Sparkles',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'confidence-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Confidence isn't the absence of doubt, it's moving forward even when doubt is present. It's not about knowing you'll succeed, but trusting that you can handle whatever happens. This path explores your relationship with confidence and how to build more of it.",
        skippable: false,
      },
      {
        id: 'confidence-prompt-1',
        type: 'prompt',
        title: 'Where You Lack Confidence',
        content:
          'Confidence isn\'t all-or-nothing. We often feel confident in some areas and not others.',
        prompt:
          'Where do you lack confidence? What situations or areas of life make you doubt yourself most? What does that self-doubt sound like?',
        skippable: true,
      },
      {
        id: 'confidence-prompt-2',
        type: 'prompt',
        title: 'Where You Do Feel Confident',
        content:
          'You have areas of competence and confidence, even if they\'re easy to overlook.',
        prompt:
          'Where do you feel confident? What are you good at? What comes naturally to you? What have others praised you for?',
        skippable: true,
      },
      {
        id: 'confidence-prompt-3',
        type: 'prompt',
        title: 'Messages About Yourself',
        content:
          'Our confidence is shaped by messages we received about ourselves.',
        prompt:
          'What messages did you receive growing up about your abilities and worth? From family, school, peers? How do these messages still affect you?',
        skippable: true,
      },
      {
        id: 'confidence-exercise-1',
        type: 'exercise',
        title: 'Power Posture',
        content:
          'Our bodies can influence our minds. This brief exercise uses posture to access confidence.',
        exerciseInstructions: [
          'Stand or sit up tall',
          'Roll your shoulders back',
          'Lift your chin slightly',
          'Take up space - arms uncrossed, feet grounded',
          'Take three deep breaths in this posture',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'confidence-prompt-4',
        type: 'prompt',
        title: 'Evidence of Capability',
        content:
          'You\'ve done hard things before. You\'ve learned and grown.',
        prompt:
          'What challenges have you overcome? What have you learned to do that once seemed impossible? What does this prove about your capability?',
        skippable: true,
      },
      {
        id: 'confidence-prompt-5',
        type: 'prompt',
        title: 'Acting As If',
        content:
          'Sometimes confidence comes from action, not the other way around.',
        prompt:
          'If you felt fully confident, what would you do differently? What would you try? How would you carry yourself? What\'s stopping you from acting that way now?',
        skippable: true,
      },
      {
        id: 'confidence-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Confidence is built through action, not waiting until you feel ready. Trust yourself a little more.',
        prompt:
          'What insight about your confidence do you want to remember? What\'s one small way you could practice confidence this week?',
        skippable: false,
      },
    ],
  },
  {
    id: 'letting-go-resentment',
    title: 'Letting Go of Resentment',
    tagline: 'Free yourself from old hurts',
    category: 'Life Transitions',
    description:
      'Holding onto resentment keeps us connected to pain. This path explores what you\'re holding onto and what it might mean to let go, for your own sake.',
    icon: 'Unlock',
    gradientFrom: 'from-teal-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-teal-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'resentment-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Resentment is like drinking poison and expecting the other person to get sick. It keeps us tied to old hurts and drains our energy. Letting go isn't about excusing what happened or reconciling with someone who hurt you - it's about freeing yourself from carrying the burden.",
        skippable: false,
      },
      {
        id: 'resentment-prompt-1',
        type: 'prompt',
        title: 'What You\'re Holding',
        content:
          'Name the resentment you\'re carrying. Sometimes we hold onto things for so long they become part of us.',
        prompt:
          'What resentment are you holding onto? Who or what is it about? How long have you been carrying this? What happened?',
        skippable: true,
      },
      {
        id: 'resentment-prompt-2',
        type: 'prompt',
        title: 'The Cost of Carrying It',
        content:
          'Resentment has a cost, even when the anger feels justified.',
        prompt:
          'How does holding onto this resentment affect you? Your mood, your energy, your relationships, your peace? What is it costing you to keep carrying this?',
        skippable: true,
      },
      {
        id: 'resentment-prompt-3',
        type: 'prompt',
        title: 'What the Resentment Protects',
        content:
          'Sometimes resentment serves a purpose, it can feel safer than vulnerability.',
        prompt:
          'What might the resentment be protecting you from? Is there grief, fear, or vulnerability underneath the anger? What would you have to feel if you let the resentment go?',
        skippable: true,
      },
      {
        id: 'resentment-exercise-1',
        type: 'exercise',
        title: 'Release Breath',
        content:
          'Use your breath to practice releasing, even symbolically.',
        exerciseInstructions: [
          'Take a deep breath in',
          'As you exhale, imagine releasing some of the tension',
          'Repeat, letting go a little more each time',
          'You don\'t have to let go of everything - just soften slightly',
          'Notice how your body feels',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'resentment-prompt-4',
        type: 'prompt',
        title: 'Understanding (Not Excusing)',
        content:
          'Understanding why someone hurt you isn\'t the same as excusing them.',
        prompt:
          'Can you imagine why the person did what they did? This isn\'t about excusing them, but about understanding that hurt people often hurt people. Does this perspective shift anything?',
        skippable: true,
      },
      {
        id: 'resentment-prompt-5',
        type: 'prompt',
        title: 'What Letting Go Means to You',
        content:
          'Letting go doesn\'t mean forgetting, reconciling, or saying it was okay.',
        prompt:
          'What would letting go look like for you? Not forgiveness if that doesn\'t feel right, but simply... letting go. What would be different if you weren\'t carrying this anymore?',
        skippable: true,
      },
      {
        id: 'resentment-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Letting go is a process, not a single moment. You don\'t have to let go all at once. Even loosening your grip slightly is progress.',
        prompt:
          'What have you learned about your resentment? Is there any small step you could take toward freeing yourself?',
        skippable: false,
      },
    ],
  },
  {
    id: 'reconnecting-with-joy',
    title: 'Reconnecting with Joy',
    tagline: 'Rediscover what lights you up',
    category: 'Growth & Purpose',
    description:
      'Sometimes joy slips away without us noticing. This path helps you remember what brings you joy and make space for more of it.',
    icon: 'Sun',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'joy-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Joy isn't frivolous, it's essential. Yet many of us have lost touch with what brings us joy, buried under responsibilities and stress. This path is an invitation to remember and reclaim what lights you up, even in small ways.",
        skippable: false,
      },
      {
        id: 'joy-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Joy',
        content:
          'Some of us are comfortable with joy; others find it unfamiliar or even suspicious.',
        prompt:
          'How would you describe your relationship with joy right now? When was the last time you felt genuinely joyful? What gets in the way of joy for you?',
        skippable: true,
      },
      {
        id: 'joy-prompt-2',
        type: 'prompt',
        title: 'Joy in the Past',
        content:
          'Remembering past joy can help us reconnect with what we love.',
        prompt:
          'Think back to times when you felt truly joyful. What were you doing? Who were you with? What did joy feel like in your body?',
        skippable: true,
      },
      {
        id: 'joy-prompt-3',
        type: 'prompt',
        title: 'What Lights You Up',
        content:
          'Joy is personal. What brings joy to one person may not to another.',
        prompt:
          'What activities, people, places, or experiences bring you joy? Make a list, including small things. What do these have in common?',
        skippable: true,
      },
      {
        id: 'joy-exercise-1',
        type: 'exercise',
        title: 'Joy Memory',
        content:
          'Recalling joyful moments can help us access that feeling now.',
        exerciseInstructions: [
          'Close your eyes and remember a joyful moment',
          'See it clearly - where were you? What was happening?',
          'Notice how joy felt in your body',
          'Let yourself smile if it comes naturally',
          'Stay with this feeling for a few breaths',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'joy-prompt-4',
        type: 'prompt',
        title: 'Barriers to Joy',
        content:
          'Sometimes we unconsciously block joy, feeling we don\'t deserve it or shouldn\'t feel it.',
        prompt:
          'What might be blocking your access to joy? Guilt, unworthiness, fear that it won\'t last, or too much stress? What beliefs do you have about whether you\'re allowed to feel joy?',
        skippable: true,
      },
      {
        id: 'joy-prompt-5',
        type: 'prompt',
        title: 'Making Space for Joy',
        content:
          'Joy often requires intention. We have to make room for it.',
        prompt:
          'What\'s one small way you could invite more joy into your life this week? Something just for the pleasure of it, not because you have to.',
        skippable: true,
      },
      {
        id: 'joy-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You deserve joy. Not as a reward for productivity, but as a natural part of being human.',
        prompt:
          'What have you remembered about what brings you joy? How will you make more space for it?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-anger',
    title: 'Managing Anger',
    tagline: 'Understand and channel your anger',
    category: 'Emotional Regulation',
    description:
      'Anger is a valid emotion with important messages. This path helps you understand your anger and find healthier ways to express it.',
    icon: 'Zap',
    gradientFrom: 'from-red-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-red-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'anger-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Anger often gets a bad reputation, but it's a natural human emotion. It can signal that something important to us is being threatened or violated. The goal isn't to eliminate anger, but to understand it and express it in ways that don't harm you or others.",
        skippable: false,
      },
      {
        id: 'anger-prompt-1',
        type: 'prompt',
        title: 'How Anger Shows Up',
        content:
          'Anger manifests differently for everyone, in body, thoughts, and behavior.',
        prompt:
          'How do you experience anger? What happens in your body? What thoughts arise? How do you typically behave when angry?',
        skippable: true,
      },
      {
        id: 'anger-prompt-2',
        type: 'prompt',
        title: 'Your Triggers',
        content:
          'Understanding what triggers your anger can help you respond more skillfully.',
        prompt:
          'What situations, behaviors, or topics tend to trigger your anger? Are there patterns you notice? What feels threatened when you get angry?',
        skippable: true,
      },
      {
        id: 'anger-exercise-1',
        type: 'exercise',
        title: 'Cooling Breath',
        content:
          'This breathing technique can help reduce the intensity of anger.',
        exerciseInstructions: [
          'Breathe in slowly through your nose for 4 counts',
          'Hold for 2 counts',
          'Breathe out slowly through your mouth for 6 counts',
          'Repeat 4-5 times',
          'Notice any shift in intensity',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'anger-prompt-3',
        type: 'prompt',
        title: 'What Anger Protects',
        content:
          'Underneath anger, there are often more vulnerable emotions like hurt, fear, or sadness.',
        prompt:
          'Think of a recent time you felt angry. What might have been underneath the anger? Were there feelings of hurt, fear, disappointment, or something else?',
        skippable: true,
      },
      {
        id: 'anger-prompt-4',
        type: 'prompt',
        title: 'Messages About Anger',
        content:
          'How we handle anger is often shaped by what we learned growing up.',
        prompt:
          'What did you learn about anger as a child? How was anger expressed in your family? Was it suppressed, explosive, or something else?',
        skippable: true,
      },
      {
        id: 'anger-prompt-5',
        type: 'prompt',
        title: 'Healthy Expression',
        content:
          'Anger needs an outlet, but not all outlets are equal.',
        prompt:
          'What are some healthy ways you could express or release anger? Physical activity, talking to someone, creative expression? What might you try?',
        skippable: true,
      },
      {
        id: 'anger-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Anger itself isn\'t the problem. How we handle it determines whether it helps or hurts us.',
        prompt:
          'What have you learned about your relationship with anger? What\'s one thing you\'d like to try differently?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-resilience',
    title: 'Building Resilience',
    tagline: 'Develop your inner strength',
    category: 'Growth & Purpose',
    description:
      'Resilience isn\'t about being tough or unaffected. It\'s about bending without breaking and bouncing back from difficulties. This path explores how to cultivate more resilience.',
    icon: 'Mountain',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-green-50',
    borderColor: 'border-emerald-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'resilience-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Resilience isn't something you either have or don't have. It's a set of skills and perspectives that can be developed. Resilient people still struggle, still feel pain, and still need support. They've just learned ways to navigate difficulty without being overwhelmed by it.",
        skippable: false,
      },
      {
        id: 'resilience-prompt-1',
        type: 'prompt',
        title: 'Your Resilience History',
        content:
          'You\'ve already demonstrated resilience in your life, even if you don\'t think of it that way.',
        prompt:
          'Think of a difficult time you\'ve been through. How did you get through it? What helped? What did you learn about yourself?',
        skippable: true,
      },
      {
        id: 'resilience-prompt-2',
        type: 'prompt',
        title: 'What Challenges You',
        content:
          'Different challenges test us in different ways.',
        prompt:
          'What types of challenges feel hardest for you to bounce back from? What makes them particularly difficult? What tends to knock you down the most?',
        skippable: true,
      },
      {
        id: 'resilience-exercise-1',
        type: 'exercise',
        title: 'Strength Recall',
        content:
          'Connecting with past strength can help us access it in the present.',
        exerciseInstructions: [
          'Remember a time you overcame something difficult',
          'Recall how you felt when you got through it',
          'Notice where you feel that strength in your body',
          'Take a deep breath and hold onto that feeling',
          'Remind yourself: "I have survived hard things"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'resilience-prompt-3',
        type: 'prompt',
        title: 'Your Support Network',
        content:
          'Resilience isn\'t about going it alone. Connection is a key factor in bouncing back.',
        prompt:
          'Who supports you when things are hard? Who can you turn to? If you feel alone, what small step might you take toward building more support?',
        skippable: true,
      },
      {
        id: 'resilience-prompt-4',
        type: 'prompt',
        title: 'Perspective and Meaning',
        content:
          'How we think about challenges affects how we respond to them.',
        prompt:
          'How do you typically think about setbacks? Do you see them as permanent or temporary? Personal failures or circumstances? How might you reframe challenges more helpfully?',
        skippable: true,
      },
      {
        id: 'resilience-prompt-5',
        type: 'prompt',
        title: 'Building Resilience Daily',
        content:
          'Resilience is built through small daily practices, not just during crises.',
        prompt:
          'What daily habits or practices might help you build resilience over time? Self-care, connections, mindset shifts, physical health?',
        skippable: true,
      },
      {
        id: 'resilience-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Resilience grows with practice. Every difficulty you navigate adds to your capacity.',
        prompt:
          'What insight about resilience resonates most with you? What\'s one way you\'d like to strengthen your resilience?',
        skippable: false,
      },
    ],
  },
  {
    id: 'navigating-relationships',
    title: 'Navigating Relationships',
    tagline: 'Understand your relationship patterns',
    category: 'Relationships',
    description:
      'Our relationships reflect our patterns, needs, and wounds. This path helps you understand how you relate to others and what might help you connect more authentically.',
    icon: 'Heart',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-fuchsia-50',
    borderColor: 'border-pink-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'relationships-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Relationships are both our greatest source of joy and our greatest source of pain. How we connect, what we need, and the patterns we fall into are often rooted in our earliest experiences. Understanding these patterns can help us create healthier, more fulfilling connections.",
        skippable: false,
      },
      {
        id: 'relationships-prompt-1',
        type: 'prompt',
        title: 'Your Relationship Patterns',
        content:
          'We often repeat patterns in relationships without realizing it.',
        prompt:
          'What patterns do you notice in your relationships? Do you tend to give too much, pull away, seek reassurance, avoid conflict? What keeps showing up?',
        skippable: true,
      },
      {
        id: 'relationships-prompt-2',
        type: 'prompt',
        title: 'What You Learned About Love',
        content:
          'Our earliest relationships shape our expectations and behaviors.',
        prompt:
          'What did you learn about relationships and love growing up? How were emotions handled in your family? How might this still affect you today?',
        skippable: true,
      },
      {
        id: 'relationships-prompt-3',
        type: 'prompt',
        title: 'Your Needs in Relationships',
        content:
          'Understanding your needs is essential for healthy relationships.',
        prompt:
          'What do you need from your relationships? Connection, space, reassurance, adventure, stability? Which needs often go unmet?',
        skippable: true,
      },
      {
        id: 'relationships-exercise-1',
        type: 'exercise',
        title: 'Connection Visualization',
        content:
          'Visualizing healthy connection can help us move toward it.',
        exerciseInstructions: [
          'Close your eyes and imagine a relationship where you feel safe',
          'Picture being truly seen and accepted',
          'Notice how this feels in your body',
          'Ask yourself: "What would it take to have more of this?"',
          'Hold onto this feeling',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'relationships-prompt-4',
        type: 'prompt',
        title: 'Communication Challenges',
        content:
          'How we communicate shapes the quality of our relationships.',
        prompt:
          'What\'s hardest for you in relationship communication? Expressing needs, handling conflict, being vulnerable, listening? What would you like to improve?',
        skippable: true,
      },
      {
        id: 'relationships-prompt-5',
        type: 'prompt',
        title: 'The Relationship You Want',
        content:
          'Clarity about what you want can guide you toward it.',
        prompt:
          'Describe the kind of relationship you want. What does it look like? How do you feel in it? What are the key ingredients?',
        skippable: true,
      },
      {
        id: 'relationships-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Understanding your patterns is the first step toward changing them. You can create the connections you long for.',
        prompt:
          'What insight about your relationship patterns stands out? What\'s one thing you might do differently?',
        skippable: false,
      },
    ],
  },
  {
    id: 'practicing-gratitude',
    title: 'Practicing Gratitude',
    tagline: 'Cultivate appreciation daily',
    category: 'Growth & Purpose',
    description:
      'Gratitude isn\'t about toxic positivity or ignoring problems. It\'s about noticing what\'s good alongside what\'s hard. This path explores how to develop a genuine gratitude practice.',
    icon: 'Star',
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-lime-50',
    borderColor: 'border-yellow-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'gratitude-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Gratitude has real benefits for mental health, but forced positivity can feel fake. True gratitude isn't about pretending everything is fine. It's about training your attention to notice good things alongside the hard ones, building a more balanced perspective.",
        skippable: false,
      },
      {
        id: 'gratitude-prompt-1',
        type: 'prompt',
        title: 'Your Current Gratitude Practice',
        content:
          'Some of us practice gratitude regularly; others find it difficult.',
        prompt:
          'How often do you notice things you\'re grateful for? Does gratitude come naturally to you, or does it feel forced? What\'s your relationship with appreciation?',
        skippable: true,
      },
      {
        id: 'gratitude-prompt-2',
        type: 'prompt',
        title: 'Simple Pleasures',
        content:
          'Gratitude doesn\'t have to be for big things. Small pleasures count.',
        prompt:
          'What simple things brought you even a moment of pleasure today or recently? A cup of coffee, a comfortable bed, a kind word? List as many as you can.',
        skippable: true,
      },
      {
        id: 'gratitude-exercise-1',
        type: 'exercise',
        title: 'Savoring Exercise',
        content:
          'Savoring helps us get more out of positive experiences.',
        exerciseInstructions: [
          'Think of something good that happened recently',
          'Close your eyes and relive it in detail',
          'Notice how it feels in your body',
          'Let yourself fully appreciate the moment',
          'Say "thank you" silently to yourself',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'gratitude-prompt-3',
        type: 'prompt',
        title: 'People Who Matter',
        content:
          'Gratitude for people in our lives can deepen our connections.',
        prompt:
          'Who are you grateful for? What specifically do you appreciate about them? Have you told them? What would you want them to know?',
        skippable: true,
      },
      {
        id: 'gratitude-prompt-4',
        type: 'prompt',
        title: 'Gratitude Through Difficulty',
        content:
          'Sometimes challenges bring unexpected gifts.',
        prompt:
          'Is there anything you\'ve learned or gained from a difficult experience? Growth, strength, perspective, compassion? This isn\'t about being glad for the pain, just noticing any silver linings.',
        skippable: true,
      },
      {
        id: 'gratitude-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Gratitude is a practice, not a personality trait. The more you notice, the more there is to notice.',
        prompt:
          'What came up for you during this reflection? How might you incorporate more gratitude into your daily life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'overcoming-fear',
    title: 'Overcoming Fear',
    tagline: 'Face your fears with compassion',
    category: 'Emotional Regulation',
    description:
      'Fear can protect us or hold us back. This path helps you understand your fears and find courage to move toward what matters, even when you\'re afraid.',
    icon: 'Eye',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-blue-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'fear-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Fear is a survival mechanism, but it doesn't always serve us well in modern life. Sometimes fear protects us from real danger; other times it keeps us from living fully. Courage isn't the absence of fear. It's taking action despite being afraid.",
        skippable: false,
      },
      {
        id: 'fear-prompt-1',
        type: 'prompt',
        title: 'What You Fear',
        content:
          'Naming our fears can reduce their power over us.',
        prompt:
          'What fears do you carry? They might be about failure, rejection, loss, the unknown, or something else. Try to name them without judgment.',
        skippable: true,
      },
      {
        id: 'fear-prompt-2',
        type: 'prompt',
        title: 'How Fear Shows Up',
        content:
          'Fear manifests differently for everyone.',
        prompt:
          'How does fear affect you? Do you avoid, freeze, rush, overthink? What happens in your body when you\'re afraid? What does fear sound like in your mind?',
        skippable: true,
      },
      {
        id: 'fear-exercise-1',
        type: 'exercise',
        title: 'Grounding in Safety',
        content:
          'Reminding ourselves of present safety can calm fear.',
        exerciseInstructions: [
          'Feel your feet on the ground',
          'Look around and name what you see',
          'Remind yourself: "Right now, in this moment, I am safe"',
          'Take a slow, deep breath',
          'Notice any shift in your body',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'fear-prompt-3',
        type: 'prompt',
        title: 'The Origins of Fear',
        content:
          'Our fears often have roots in past experiences.',
        prompt:
          'Where do your fears come from? Are they based on past experiences, things you learned, or imagined possibilities? How realistic are they in your current life?',
        skippable: true,
      },
      {
        id: 'fear-prompt-4',
        type: 'prompt',
        title: 'What Fear Costs You',
        content:
          'Avoidance keeps us safe but also keeps us small.',
        prompt:
          'What has fear cost you? What have you avoided, missed, or not tried because of fear? What would be different if fear didn\'t hold you back?',
        skippable: true,
      },
      {
        id: 'fear-prompt-5',
        type: 'prompt',
        title: 'One Brave Step',
        content:
          'Courage is built through small acts, not giant leaps.',
        prompt:
          'What\'s one small thing you\'ve been avoiding because of fear? What\'s the smallest possible step you could take toward it?',
        skippable: true,
      },
      {
        id: 'fear-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You don\'t have to be fearless. You just have to be willing to act despite fear.',
        prompt:
          'What have you learned about your fears? What small act of courage might you take?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-purpose',
    title: 'Finding Purpose',
    tagline: 'Discover meaning and direction',
    category: 'Growth & Purpose',
    description:
      'A sense of purpose gives life direction and meaning. This path helps you explore what matters to you and how to align your life with your values.',
    icon: 'Compass',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-indigo-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'purpose-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Purpose doesn't have to be a grand calling or a single life mission. It can be found in small things, relationships, growth, creativity, or service. This path is about exploring what gives your life meaning and how to cultivate more of it.",
        skippable: false,
      },
      {
        id: 'purpose-prompt-1',
        type: 'prompt',
        title: 'Where You Are Now',
        content:
          'Understanding your current sense of purpose is the starting point.',
        prompt:
          'How would you describe your current sense of purpose? Do you feel like your life has meaning and direction? What\'s missing, if anything?',
        skippable: true,
      },
      {
        id: 'purpose-prompt-2',
        type: 'prompt',
        title: 'What You Value',
        content:
          'Purpose is often connected to our deepest values.',
        prompt:
          'What do you truly value? Not what you think you should value, but what actually matters to you. Family, creativity, justice, growth, connection, freedom?',
        skippable: true,
      },
      {
        id: 'purpose-prompt-3',
        type: 'prompt',
        title: 'When You Feel Alive',
        content:
          'Moments of engagement and flow can point toward purpose.',
        prompt:
          'When do you feel most alive, engaged, or in flow? What activities make you lose track of time? What were you doing when you last felt deeply fulfilled?',
        skippable: true,
      },
      {
        id: 'purpose-exercise-1',
        type: 'exercise',
        title: 'Values Visualization',
        content:
          'Imagining a life aligned with values can clarify direction.',
        exerciseInstructions: [
          'Close your eyes and imagine a day in your ideal life',
          'What are you doing? Who are you with?',
          'What values are being honored?',
          'Notice how this vision makes you feel',
          'What stands out as most important?',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'purpose-prompt-4',
        type: 'prompt',
        title: 'Your Unique Gifts',
        content:
          'Purpose often emerges at the intersection of what you\'re good at and what the world needs.',
        prompt:
          'What are your unique strengths, skills, or gifts? What do others come to you for? How might these be of service to something larger than yourself?',
        skippable: true,
      },
      {
        id: 'purpose-prompt-5',
        type: 'prompt',
        title: 'Purpose in Daily Life',
        content:
          'Purpose doesn\'t have to be about career. It can be woven into ordinary life.',
        prompt:
          'How might you bring more purpose into your everyday life? Through how you treat others, approach work, or spend your time?',
        skippable: true,
      },
      {
        id: 'purpose-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Purpose is discovered through exploration and action, not just thinking. Follow what calls to you.',
        prompt:
          'What insights have emerged about your sense of purpose? What\'s one thing you might do to align your life more with what matters?',
        skippable: false,
      },
    ],
  },
  {
    id: 'body-image-acceptance',
    title: 'Body Image & Acceptance',
    tagline: 'Develop a kinder relationship with your body',
    category: 'Wellness',
    description:
      'Many of us struggle with how we see our bodies. This path offers a space to explore your relationship with your body and move toward greater acceptance.',
    icon: 'User',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'body-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We live in a culture that sends constant messages about how our bodies should look. It's no wonder so many of us struggle with body image. This path isn't about fixing how you look. It's about changing how you relate to your body, moving from criticism toward care.",
        skippable: false,
      },
      {
        id: 'body-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Your Body',
        content:
          'Our relationship with our bodies is complex and personal.',
        prompt:
          'How would you describe your relationship with your body right now? What thoughts do you have about it? How do you treat it? How does your body feel about this?',
        skippable: true,
      },
      {
        id: 'body-prompt-2',
        type: 'prompt',
        title: 'Where the Messages Came From',
        content:
          'Body image is shaped by messages from family, media, peers, and culture.',
        prompt:
          'What messages did you receive about bodies growing up? From family, media, peers? How do these messages still affect how you see yourself?',
        skippable: true,
      },
      {
        id: 'body-exercise-1',
        type: 'exercise',
        title: 'Body Appreciation',
        content:
          'Shifting focus from appearance to function can help us appreciate our bodies.',
        exerciseInstructions: [
          'Take a breath and tune into your body',
          'Thank your legs for carrying you',
          'Thank your hands for all they do',
          'Thank your heart for beating without being asked',
          'Offer gratitude to your body for supporting your life',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'body-prompt-3',
        type: 'prompt',
        title: 'What Your Body Has Done for You',
        content:
          'Your body has been with you through everything.',
        prompt:
          'What has your body done for you? What has it carried you through? What experiences has it allowed you to have? What does it do for you every day?',
        skippable: true,
      },
      {
        id: 'body-prompt-4',
        type: 'prompt',
        title: 'Beyond Appearance',
        content:
          'You are so much more than how your body looks.',
        prompt:
          'If you couldn\'t see your body, how would you know yourself? What qualities, abilities, and traits define you beyond appearance?',
        skippable: true,
      },
      {
        id: 'body-prompt-5',
        type: 'prompt',
        title: 'Kind Body Care',
        content:
          'What would it look like to care for your body from a place of kindness rather than criticism?',
        prompt:
          'How might you treat your body differently if you were caring for it out of love rather than trying to fix or punish it? What would change?',
        skippable: true,
      },
      {
        id: 'body-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Body acceptance is a journey, not a destination. Every moment of kindness toward your body matters.',
        prompt:
          'What insight from this reflection do you want to remember? How might you be kinder to your body?',
        skippable: false,
      },
    ],
  },
  {
    id: 'digital-wellness',
    title: 'Digital Wellness',
    tagline: 'Find balance with technology',
    category: 'Wellness',
    description:
      'Technology connects us but can also overwhelm us. This path explores your relationship with digital devices and how to use them more mindfully.',
    icon: 'Smartphone',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-blue-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'digital-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Our devices are designed to capture our attention. That's not a personal failing. But mindless scrolling, constant notifications, and digital overload can affect our mental health, relationships, and presence. This path is about finding a healthier balance.",
        skippable: false,
      },
      {
        id: 'digital-prompt-1',
        type: 'prompt',
        title: 'Your Digital Habits',
        content:
          'Awareness is the first step toward change.',
        prompt:
          'How would you describe your relationship with technology right now? How much time do you spend on screens? How does it make you feel? What patterns do you notice?',
        skippable: true,
      },
      {
        id: 'digital-prompt-2',
        type: 'prompt',
        title: 'What Technology Gives You',
        content:
          'Technology isn\'t all bad. It serves real needs.',
        prompt:
          'What positive things does technology provide in your life? Connection, information, entertainment, productivity? What would you genuinely miss without it?',
        skippable: true,
      },
      {
        id: 'digital-prompt-3',
        type: 'prompt',
        title: 'What It Takes Away',
        content:
          'Digital engagement often has hidden costs.',
        prompt:
          'What does excessive screen time take away from your life? Time, presence, sleep, attention, real connection? What suffers when you\'re too plugged in?',
        skippable: true,
      },
      {
        id: 'digital-exercise-1',
        type: 'exercise',
        title: 'Device-Free Moment',
        content:
          'Practice being present without digital input.',
        exerciseInstructions: [
          'Put your phone face down or out of sight',
          'Close any extra tabs or apps',
          'Take three deep breaths',
          'Look around the room and notice 5 things',
          'Sit in this stillness for a moment',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'digital-prompt-4',
        type: 'prompt',
        title: 'Your Triggers',
        content:
          'We often reach for devices out of habit or to avoid feelings.',
        prompt:
          'When do you most reach for your phone or device? Boredom, anxiety, avoidance, habit? What feelings or situations trigger mindless scrolling?',
        skippable: true,
      },
      {
        id: 'digital-prompt-5',
        type: 'prompt',
        title: 'Boundaries That Might Help',
        content:
          'Small boundaries can make a big difference.',
        prompt:
          'What boundaries might help your digital wellness? Phone-free times, notification limits, social media breaks? What feels doable to try?',
        skippable: true,
      },
      {
        id: 'digital-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Technology is a tool. You get to decide how to use it.',
        prompt:
          'What have you realized about your digital habits? What\'s one change you\'d like to make?',
        skippable: false,
      },
    ],
  },
  {
    id: 'processing-guilt-shame',
    title: 'Processing Guilt & Shame',
    tagline: 'Understand and release these heavy emotions',
    category: 'Emotional Regulation',
    description:
      'Guilt and shame can motivate growth or keep us stuck. This path helps you understand the difference and find ways to move through these difficult emotions.',
    icon: 'Weight',
    gradientFrom: 'from-stone-50',
    gradientTo: 'to-neutral-50',
    borderColor: 'border-stone-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'guilt-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Guilt says 'I did something bad.' Shame says 'I am bad.' Both can be heavy to carry. While guilt can sometimes motivate us to make amends, shame rarely helps. This path is about understanding these feelings and finding ways to lighten their weight.",
        skippable: false,
      },
      {
        id: 'guilt-prompt-1',
        type: 'prompt',
        title: 'What You\'re Carrying',
        content:
          'Name the guilt or shame you\'re carrying.',
        prompt:
          'What feelings of guilt or shame are you carrying? What do you feel bad about? What do you criticize yourself for? Try to name it without judgment.',
        skippable: true,
      },
      {
        id: 'guilt-prompt-2',
        type: 'prompt',
        title: 'Guilt vs. Shame',
        content:
          'Understanding the difference can help you respond more skillfully.',
        prompt:
          'Is what you\'re feeling more like guilt (I did something wrong) or shame (I am wrong/bad)? How does each one feel different in your body and mind?',
        skippable: true,
      },
      {
        id: 'guilt-prompt-3',
        type: 'prompt',
        title: 'Is It Warranted?',
        content:
          'Some guilt is helpful; some is based on unrealistic standards.',
        prompt:
          'Does your guilt reflect something that genuinely violated your values? Or are you holding yourself to impossible standards? Would you feel this way about someone else in the same situation?',
        skippable: true,
      },
      {
        id: 'guilt-exercise-1',
        type: 'exercise',
        title: 'Self-Forgiveness',
        content:
          'Sometimes we need to offer ourselves the forgiveness we would give others.',
        exerciseInstructions: [
          'Place a hand on your heart',
          'Acknowledge: "I made a mistake" or "I am struggling"',
          'Say: "I am human. Humans make mistakes."',
          'Offer yourself: "May I forgive myself"',
          'Breathe and let this settle',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'guilt-prompt-4',
        type: 'prompt',
        title: 'Making Amends',
        content:
          'If guilt is warranted, action can help release it.',
        prompt:
          'If you\'ve done something wrong, is there a way to make amends? An apology, changed behavior, or repair? What would help you move forward?',
        skippable: true,
      },
      {
        id: 'guilt-prompt-5',
        type: 'prompt',
        title: 'Releasing Shame',
        content:
          'Shame loses power when we bring it into the light.',
        prompt:
          'What would it be like to let go of the belief that you are fundamentally bad or broken? What evidence contradicts this shame? What would you tell a friend who felt this way about themselves?',
        skippable: true,
      },
      {
        id: 'guilt-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are not your mistakes. You are capable of growth, repair, and moving forward.',
        prompt:
          'What insight about your guilt or shame do you want to carry forward? What might help you release some of this weight?',
        skippable: false,
      },
    ],
  },
  {
    id: 'self-discovery',
    title: 'Self-Discovery',
    tagline: 'Explore who you really are',
    category: 'Self-Development',
    description:
      'Who are you, really? Beyond roles, expectations, and what others think. This path invites you to explore your authentic self.',
    icon: 'Search',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-indigo-50',
    borderColor: 'border-violet-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'discovery-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Many of us spend so much time meeting others' expectations that we lose touch with who we really are. Self-discovery is an ongoing journey of reconnecting with your authentic self, your true desires, values, and identity beyond what you've been told to be.",
        skippable: false,
      },
      {
        id: 'discovery-prompt-1',
        type: 'prompt',
        title: 'Who Are You?',
        content:
          'A deceptively simple question with complex answers.',
        prompt:
          'If someone asked "Who are you?", what would you say beyond your name and job? What defines you? What are the core aspects of who you are?',
        skippable: true,
      },
      {
        id: 'discovery-prompt-2',
        type: 'prompt',
        title: 'Roles vs. Self',
        content:
          'We play many roles, but we are more than any of them.',
        prompt:
          'What roles do you play in life? Parent, employee, friend, caretaker? Which of these feel most like "you"? Which feel like masks? Who are you underneath all the roles?',
        skippable: true,
      },
      {
        id: 'discovery-prompt-3',
        type: 'prompt',
        title: 'Childhood Dreams',
        content:
          'Our younger selves often knew things our adult selves have forgotten.',
        prompt:
          'What did you love as a child? What did you dream of? What were you curious about? Are any of these things still part of your life, or have they been lost?',
        skippable: true,
      },
      {
        id: 'discovery-exercise-1',
        type: 'exercise',
        title: 'Inner Listening',
        content:
          'Connecting with your inner self requires slowing down and listening.',
        exerciseInstructions: [
          'Close your eyes and take a few deep breaths',
          'Ask yourself: "What do I really want?"',
          'Don\'t answer immediately. Just listen.',
          'Notice what arises without judgment',
          'Stay open to whatever comes up',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'discovery-prompt-4',
        type: 'prompt',
        title: 'When You Feel Most Yourself',
        content:
          'There are moments when we feel truly authentic.',
        prompt:
          'When do you feel most like yourself? What are you doing? Who are you with? What does authenticity feel like for you?',
        skippable: true,
      },
      {
        id: 'discovery-prompt-5',
        type: 'prompt',
        title: 'What You\'re Still Discovering',
        content:
          'Self-discovery is lifelong. There\'s always more to explore.',
        prompt:
          'What aspects of yourself are you still discovering or curious about? What would you like to explore further? What questions about yourself remain unanswered?',
        skippable: true,
      },
      {
        id: 'discovery-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are always becoming. Self-discovery is not about finding a fixed answer but staying curious.',
        prompt:
          'What have you discovered or remembered about yourself? How might you stay connected to your authentic self?',
        skippable: false,
      },
    ],
  },
  {
    id: 'mindfulness-basics',
    title: 'Mindfulness Basics',
    tagline: 'Introduction to present-moment awareness',
    category: 'Wellness',
    description:
      'Mindfulness is simply paying attention to the present moment without judgment. This path introduces fundamental mindfulness practices for everyday life.',
    icon: 'Brain',
    gradientFrom: 'from-teal-50',
    gradientTo: 'to-emerald-50',
    borderColor: 'border-teal-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'mindful-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Mindfulness isn't about emptying your mind or achieving a special state. It's simply about paying attention to what's happening right now, in this moment, without harsh judgment. It's a skill anyone can develop, and it can help with stress, anxiety, and overall wellbeing.",
        skippable: false,
      },
      {
        id: 'mindful-prompt-1',
        type: 'prompt',
        title: 'Your Current Relationship with the Present',
        content:
          'Most of us spend a lot of time in the past or future.',
        prompt:
          'How present do you tend to be in your daily life? Where does your mind usually go? Do you get caught up in the past or worry about the future? What pulls you out of the present?',
        skippable: true,
      },
      {
        id: 'mindful-exercise-1',
        type: 'exercise',
        title: 'Basic Breath Awareness',
        content:
          'The breath is always available as an anchor to the present.',
        exerciseInstructions: [
          'Sit comfortably and close your eyes if it helps',
          'Notice your natural breath without changing it',
          'Feel where you notice the breath most clearly',
          'When your mind wanders, gently return to the breath',
          'Continue for 5-6 breaths',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'mindful-prompt-2',
        type: 'prompt',
        title: 'Noticing the Mind',
        content:
          'Mindfulness includes noticing what the mind does.',
        prompt:
          'During the breathing exercise, what happened? Did your mind wander? Where did it go? This wandering is normal. How did it feel to bring your attention back?',
        skippable: true,
      },
      {
        id: 'mindful-exercise-2',
        type: 'exercise',
        title: 'Body Awareness',
        content:
          'The body is another doorway to present-moment awareness.',
        exerciseInstructions: [
          'Feel your feet on the floor',
          'Notice the sensation of sitting',
          'Scan upward through your body',
          'Notice any areas of tension or ease',
          'Simply observe without trying to change anything',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'mindful-prompt-3',
        type: 'prompt',
        title: 'Everyday Mindfulness',
        content:
          'Mindfulness doesn\'t require meditation. It can be practiced in daily activities.',
        prompt:
          'What everyday activities might you do more mindfully? Eating, walking, showering, listening? How might bringing more attention to these moments change your experience?',
        skippable: true,
      },
      {
        id: 'mindful-prompt-4',
        type: 'prompt',
        title: 'Obstacles to Presence',
        content:
          'Various things pull us away from the present moment.',
        prompt:
          'What makes it hard for you to be present? Busy mind, difficult emotions, constant distractions? How might you work with these obstacles kindly?',
        skippable: true,
      },
      {
        id: 'mindful-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Mindfulness is a practice, not a perfect state. Every moment of awareness counts.',
        prompt:
          'What have you noticed about your relationship with the present moment? How might you bring more mindfulness into your life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'dealing-with-overwhelm',
    title: 'Dealing with Overwhelm',
    tagline: 'When everything feels like too much',
    category: 'Emotional Regulation',
    description:
      'Overwhelm happens when demands exceed our capacity. This path helps you understand your overwhelm and find ways to restore balance.',
    icon: 'Layers',
    gradientFrom: 'from-gray-50',
    gradientTo: 'to-slate-50',
    borderColor: 'border-gray-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'overwhelm-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "When everything piles up, it can feel like you're drowning. Overwhelm isn't about being weak. It's about having more on your plate than anyone could reasonably handle. This path is about understanding what's overwhelming you and finding ways to come back to solid ground.",
        skippable: false,
      },
      {
        id: 'overwhelm-prompt-1',
        type: 'prompt',
        title: 'What\'s Overwhelming You',
        content:
          'Name what\'s on your plate right now.',
        prompt:
          'What\'s contributing to your sense of overwhelm? Tasks, responsibilities, emotions, decisions, expectations? Try to list everything that\'s weighing on you.',
        skippable: true,
      },
      {
        id: 'overwhelm-prompt-2',
        type: 'prompt',
        title: 'How Overwhelm Feels',
        content:
          'Understanding how overwhelm shows up helps us respond to it.',
        prompt:
          'How does overwhelm manifest for you? Paralysis, panic, shutdown, irritability? What happens in your body? What thoughts come up?',
        skippable: true,
      },
      {
        id: 'overwhelm-exercise-1',
        type: 'exercise',
        title: 'Pause and Ground',
        content:
          'When overwhelmed, the first step is to pause and ground yourself.',
        exerciseInstructions: [
          'Stop what you\'re doing',
          'Take 3 slow, deep breaths',
          'Feel your feet on the floor',
          'Say to yourself: "I can only do one thing at a time"',
          'Let your shoulders drop',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'overwhelm-prompt-3',
        type: 'prompt',
        title: 'What Can Wait',
        content:
          'Not everything is equally urgent, even if it all feels that way.',
        prompt:
          'Looking at your list, what actually needs to happen today? What can wait until tomorrow or later? What could be let go entirely? What\'s someone else\'s responsibility?',
        skippable: true,
      },
      {
        id: 'overwhelm-prompt-4',
        type: 'prompt',
        title: 'One Next Step',
        content:
          'You can\'t do everything at once. You can only do one thing.',
        prompt:
          'What is the single next step you could take? Not the whole project, just one small action. What\'s the tiniest thing that would help?',
        skippable: true,
      },
      {
        id: 'overwhelm-prompt-5',
        type: 'prompt',
        title: 'Asking for Help',
        content:
          'Overwhelm often comes from trying to do everything alone.',
        prompt:
          'Is there anything you could ask for help with? Delegate, share, or simply let someone know you\'re struggling? What would help lighten the load?',
        skippable: true,
      },
      {
        id: 'overwhelm-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You don\'t have to do everything. You just have to do the next thing.',
        prompt:
          'What\'s one thing you can do to reduce your overwhelm right now? What might you let go of?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-self-trust',
    title: 'Building Self-Trust',
    tagline: 'Learn to trust yourself again',
    category: 'Self-Development',
    description:
      'Self-trust is knowing you can count on yourself. This path explores how to rebuild trust with yourself after it\'s been shaken.',
    icon: 'Key',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'trust-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-trust is the foundation of confidence and wellbeing. It's knowing you'll follow through, that you can handle what comes, and that you won't abandon yourself. When self-trust is damaged, it affects everything. But it can be rebuilt, one kept promise at a time.",
        skippable: false,
      },
      {
        id: 'trust-prompt-1',
        type: 'prompt',
        title: 'Your Current Self-Trust',
        content:
          'Where are you starting from?',
        prompt:
          'How much do you trust yourself right now? In what areas do you trust yourself? Where has that trust been broken or shaken?',
        skippable: true,
      },
      {
        id: 'trust-prompt-2',
        type: 'prompt',
        title: 'How Trust Was Broken',
        content:
          'Self-trust can be damaged in many ways.',
        prompt:
          'How did you lose trust in yourself? Broken promises to yourself, poor decisions, letting yourself down, or believing others over your own intuition? What happened?',
        skippable: true,
      },
      {
        id: 'trust-prompt-3',
        type: 'prompt',
        title: 'When You Did Trust Yourself',
        content:
          'You\'ve had moments of self-trust. Those count.',
        prompt:
          'Think of a time when you trusted yourself and it worked out. What did that feel like? What made you able to trust yourself then?',
        skippable: true,
      },
      {
        id: 'trust-exercise-1',
        type: 'exercise',
        title: 'Self-Commitment',
        content:
          'Self-trust is built through keeping small promises to yourself.',
        exerciseInstructions: [
          'Think of one small thing you can commit to today',
          'Something absolutely doable',
          'Say to yourself: "I will do this, and I will follow through"',
          'Feel the weight of this promise',
          'Commit to keeping it',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'trust-prompt-4',
        type: 'prompt',
        title: 'Listening to Yourself',
        content:
          'Self-trust involves trusting your own feelings and intuition.',
        prompt:
          'How well do you listen to yourself? Your body, your feelings, your intuition? Do you dismiss these signals or honor them? How might you listen better?',
        skippable: true,
      },
      {
        id: 'trust-prompt-5',
        type: 'prompt',
        title: 'Small Promises',
        content:
          'Big promises often lead to failure. Small ones build trust.',
        prompt:
          'What small promises could you make to yourself and keep? Things so small they feel almost too easy? What would it feel like to keep these consistently?',
        skippable: true,
      },
      {
        id: 'trust-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Self-trust is rebuilt one kept promise at a time. Start small and be consistent.',
        prompt:
          'What have you learned about your self-trust? What small promise will you make and keep?',
        skippable: false,
      },
    ],
  },
  {
    id: 'setting-meaningful-goals',
    title: 'Setting Meaningful Goals',
    tagline: 'Create goals that actually matter to you',
    category: 'Growth & Purpose',
    description:
      'Goals give direction, but the wrong goals lead nowhere fulfilling. This path helps you set goals aligned with what truly matters to you.',
    icon: 'Target',
    gradientFrom: 'from-lime-50',
    gradientTo: 'to-green-50',
    borderColor: 'border-lime-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'goals-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Many of us set goals based on what we think we should want, not what we actually want. The result? Goals we don't achieve or achievements that don't satisfy. This path is about connecting with what truly matters to you and setting goals that reflect your authentic desires.",
        skippable: false,
      },
      {
        id: 'goals-prompt-1',
        type: 'prompt',
        title: 'Goals You\'ve Set Before',
        content:
          'Reflect on your history with goal-setting.',
        prompt:
          'What goals have you set in the past? Which did you achieve? Which did you abandon? Looking back, which goals actually mattered to you versus sounded good?',
        skippable: true,
      },
      {
        id: 'goals-prompt-2',
        type: 'prompt',
        title: 'Why Do You Want It?',
        content:
          'The "why" behind a goal determines whether it sustains you.',
        prompt:
          'Think of a goal you\'re considering. Why do you want it? Keep asking "why" until you get to something that feels core. Is this about external validation or internal fulfillment?',
        skippable: true,
      },
      {
        id: 'goals-prompt-3',
        type: 'prompt',
        title: 'Values-Based Goals',
        content:
          'Goals aligned with values are more motivating and satisfying.',
        prompt:
          'What do you value most? How might your goals reflect these values? What goals would let you live more in alignment with what matters to you?',
        skippable: true,
      },
      {
        id: 'goals-exercise-1',
        type: 'exercise',
        title: 'Future Self Visualization',
        content:
          'Connecting with your future self can clarify meaningful goals.',
        exerciseInstructions: [
          'Close your eyes and imagine yourself one year from now',
          'Imagine you\'ve been living well, aligned with your values',
          'What has changed? What have you accomplished?',
          'What does your future self want you to know?',
          'Let this inform your goals',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'goals-prompt-4',
        type: 'prompt',
        title: 'Process vs. Outcome',
        content:
          'Outcome goals depend on factors outside your control. Process goals don\'t.',
        prompt:
          'Can you reframe your goals as processes rather than outcomes? Instead of "lose 20 pounds," perhaps "move my body regularly"? What would process-focused goals look like for you?',
        skippable: true,
      },
      {
        id: 'goals-prompt-5',
        type: 'prompt',
        title: 'One Meaningful Goal',
        content:
          'Sometimes one focused goal is better than many scattered ones.',
        prompt:
          'If you could only focus on one goal right now, what would make the biggest positive difference in your life? What\'s the single most meaningful thing you could work toward?',
        skippable: true,
      },
      {
        id: 'goals-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'The best goals come from within, not from what others expect. Choose goals that matter to you.',
        prompt:
          'What have you learned about setting meaningful goals? What goal will you commit to?',
        skippable: false,
      },
    ],
  },
  {
    id: 'healing-inner-child',
    title: 'Healing Your Inner Child',
    tagline: 'Connect with and nurture your younger self',
    category: 'Relationships',
    description:
      'We all carry our younger selves within us. This path gently explores connecting with your inner child and offering the care they may have needed.',
    icon: 'Heart',
    gradientFrom: 'from-fuchsia-50',
    gradientTo: 'to-pink-50',
    borderColor: 'border-fuchsia-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'inner-child-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Inner child work involves connecting with the younger parts of ourselves that may still carry wounds, needs, or feelings from childhood. This isn't about blame or dwelling in the past. It's about offering your younger self the understanding, validation, and care that can help heal old hurts.",
        skippable: false,
      },
      {
        id: 'inner-child-prompt-1',
        type: 'prompt',
        title: 'Memories of Childhood',
        content:
          'Gently recall your younger self.',
        prompt:
          'What was your childhood like? What do you remember most clearly? What feelings come up when you think about yourself as a child?',
        skippable: true,
      },
      {
        id: 'inner-child-prompt-2',
        type: 'prompt',
        title: 'What Your Younger Self Needed',
        content:
          'Children have basic needs that aren\'t always met.',
        prompt:
          'What did you need as a child that you didn\'t fully receive? Safety, validation, attention, freedom to be yourself, unconditional love? What was missing?',
        skippable: true,
      },
      {
        id: 'inner-child-exercise-1',
        type: 'exercise',
        title: 'Meeting Your Inner Child',
        content:
          'This visualization helps you connect with your younger self.',
        exerciseInstructions: [
          'Close your eyes and take some deep breaths',
          'Imagine yourself as a child at whatever age comes to mind',
          'See this child clearly: their face, their clothes, their expression',
          'Notice how they seem to be feeling',
          'Simply be present with them',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'inner-child-prompt-3',
        type: 'prompt',
        title: 'What You Would Tell Them',
        content:
          'Your adult self has wisdom your child self didn\'t have.',
        prompt:
          'If you could speak to your younger self, what would you tell them? What do they need to hear? What comfort, validation, or truth could you offer?',
        skippable: true,
      },
      {
        id: 'inner-child-prompt-4',
        type: 'prompt',
        title: 'How They Still Show Up',
        content:
          'Our inner child often influences our adult behavior.',
        prompt:
          'How does your inner child show up in your life now? In what situations do you react from a younger, wounded place? When do you feel small or helpless like a child?',
        skippable: true,
      },
      {
        id: 'inner-child-prompt-5',
        type: 'prompt',
        title: 'Reparenting Yourself',
        content:
          'You can now give yourself what you needed then.',
        prompt:
          'How might you "reparent" yourself? What nurturing, boundaries, encouragement, or protection could you offer yourself now that your inner child needed then?',
        skippable: true,
      },
      {
        id: 'inner-child-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Your inner child is still part of you, and they deserve your care. Healing happens when we offer ourselves what we once needed.',
        prompt:
          'What has this reflection shown you about your inner child? How might you care for this part of yourself going forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-procrastination',
    title: 'Managing Procrastination',
    tagline: 'Understand why you delay and move forward',
    category: 'Self-Development',
    description:
      'Procrastination often isn\'t about laziness, it\'s about emotions. This path helps you understand what\'s behind your procrastination and find gentler ways forward.',
    icon: 'Clock',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'procrastination-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Procrastination is one of the most common struggles, yet it's often misunderstood. It's rarely about being lazy, more often, it's about avoiding uncomfortable emotions like anxiety, perfectionism, or fear of failure. This path is about understanding your procrastination with curiosity rather than judgment.",
        skippable: false,
      },
      {
        id: 'procrastination-prompt-1',
        type: 'prompt',
        title: 'Your Procrastination Patterns',
        content:
          'Understanding when and what you procrastinate on can reveal important patterns.',
        prompt:
          'What kinds of tasks do you tend to procrastinate on? Are there certain situations, times, or types of work where procrastination shows up most? Describe your patterns.',
        skippable: true,
      },
      {
        id: 'procrastination-prompt-2',
        type: 'prompt',
        title: 'What\'s Underneath',
        content:
          'Procrastination is often a way of avoiding uncomfortable feelings.',
        prompt:
          'When you procrastinate, what feelings are you avoiding? Is it fear of failure, perfectionism, overwhelm, boredom, or something else? What would it feel like to start the task?',
        skippable: true,
      },
      {
        id: 'procrastination-exercise-1',
        type: 'exercise',
        title: 'The 2-Minute Start',
        content:
          'Sometimes the hardest part is just beginning. This exercise helps you practice starting.',
        exerciseInstructions: [
          'Think of something you\'ve been putting off',
          'Commit to working on it for just 2 minutes',
          'Set a timer if it helps',
          'Notice how it feels to begin',
          'You can stop after 2 minutes if you want',
        ],
        exerciseDuration: 120,
        skippable: true,
      },
      {
        id: 'procrastination-prompt-3',
        type: 'prompt',
        title: 'Your Inner Critic\'s Role',
        content:
          'Self-criticism often makes procrastination worse, not better.',
        prompt:
          'How do you talk to yourself when you procrastinate? What does your inner critic say? Does this harsh voice help you get started, or does it make things worse?',
        skippable: true,
      },
      {
        id: 'procrastination-prompt-4',
        type: 'prompt',
        title: 'What Actually Helps',
        content:
          'You\'ve probably found some strategies that work for you, even if inconsistently.',
        prompt:
          'What has helped you overcome procrastination in the past? What conditions make it easier for you to start? What might you try more often?',
        skippable: true,
      },
      {
        id: 'procrastination-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Procrastination is common and human. Understanding it is the first step to changing your relationship with it.',
        prompt:
          'What have you learned about your procrastination? What\'s one compassionate step you could take next time you notice yourself delaying?',
        skippable: false,
      },
    ],
  },
  {
    id: 'cultivating-patience',
    title: 'Cultivating Patience',
    tagline: 'Find peace in the waiting',
    category: 'Emotional Regulation',
    description:
      'In a world of instant gratification, patience can feel impossible. This path explores what triggers your impatience and how to find more calm in the waiting.',
    icon: 'Hourglass',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'patience-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Patience isn't about passive waiting, it's about how we relate to time and uncertainty. Impatience often signals something important: anxiety about outcomes, a need for control, or difficulty being in the present moment. This path explores patience with compassion.",
        skippable: false,
      },
      {
        id: 'patience-prompt-1',
        type: 'prompt',
        title: 'When Patience Runs Thin',
        content:
          'Understanding your impatience triggers helps you work with them.',
        prompt:
          'When do you feel most impatient? Is it waiting for results, dealing with slow progress, interacting with others, or something else? What situations test your patience most?',
        skippable: true,
      },
      {
        id: 'patience-prompt-2',
        type: 'prompt',
        title: 'The Cost of Impatience',
        content:
          'Impatience often costs us more than it saves.',
        prompt:
          'How has impatience affected your life? What has it cost you in terms of relationships, decisions, or peace of mind? What might you have done differently with more patience?',
        skippable: true,
      },
      {
        id: 'patience-exercise-1',
        type: 'exercise',
        title: 'Present Moment Pause',
        content:
          'Impatience pulls us into the future. This exercise brings you back to now.',
        exerciseInstructions: [
          'Take a slow breath',
          'Notice your current surroundings',
          'Remind yourself: "Right now, everything is okay"',
          'Feel your body in this moment',
          'Let the urgency soften',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'patience-prompt-3',
        type: 'prompt',
        title: 'What Patience Allows',
        content:
          'Patience opens doors that impatience closes.',
        prompt:
          'What might become possible if you had more patience? In what areas of your life would patience serve you? What could you allow to unfold naturally?',
        skippable: true,
      },
      {
        id: 'patience-prompt-4',
        type: 'prompt',
        title: 'Growing Patience',
        content:
          'Patience is a skill that can be developed.',
        prompt:
          'What small practice might help you cultivate more patience? Is there one area of your life where you could intentionally practice patience this week?',
        skippable: true,
      },
      {
        id: 'patience-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Patience is a form of trust in yourself, in others, and in life\'s timing.',
        prompt:
          'What insight about patience resonates most with you? How might you practice patience more intentionally?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-life-balance',
    title: 'Finding Life Balance',
    tagline: 'Create harmony across life\'s demands',
    category: 'Wellness',
    description:
      'Balance isn\'t about perfect equality, it\'s about alignment with what matters. This path helps you examine your current balance and make intentional adjustments.',
    icon: 'Scale',
    gradientFrom: 'from-teal-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-teal-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'balance-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "The idea of 'work-life balance' can feel like an impossible ideal. True balance isn't about splitting time equally, it's about feeling aligned with your values and having enough energy for what matters most. This path explores what balance means for you.",
        skippable: false,
      },
      {
        id: 'balance-prompt-1',
        type: 'prompt',
        title: 'Your Current Balance',
        content:
          'Taking stock of where your time and energy go reveals your actual priorities.',
        prompt:
          'How would you describe your current life balance? Where does most of your time and energy go? What areas feel neglected? Be honest without judgment.',
        skippable: true,
      },
      {
        id: 'balance-prompt-2',
        type: 'prompt',
        title: 'What Matters Most',
        content:
          'Balance requires knowing what to balance against.',
        prompt:
          'What are the most important areas of your life? Work, relationships, health, creativity, rest, spirituality? If you had to choose your top 3-4 priorities, what would they be?',
        skippable: true,
      },
      {
        id: 'balance-exercise-1',
        type: 'exercise',
        title: 'Life Wheel Check-In',
        content:
          'Visualize how satisfied you feel in different life areas.',
        exerciseInstructions: [
          'Think of these areas: Work, Relationships, Health, Fun, Growth, Rest',
          'For each, rate your satisfaction from 1-10',
          'Notice which areas score lowest',
          'Consider what small change might help',
          'Choose one area to focus on',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'balance-prompt-3',
        type: 'prompt',
        title: 'Barriers to Balance',
        content:
          'Understanding what throws you off balance helps you protect your equilibrium.',
        prompt:
          'What tends to throw your life out of balance? Is it overwork, saying yes too much, neglecting self-care, or something else? What patterns do you notice?',
        skippable: true,
      },
      {
        id: 'balance-prompt-4',
        type: 'prompt',
        title: 'Small Adjustments',
        content:
          'Balance is maintained through small, consistent choices.',
        prompt:
          'What small adjustment could you make this week to improve your balance? Think of something doable, even 15 minutes redirected can make a difference.',
        skippable: true,
      },
      {
        id: 'balance-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Balance is not a destination but an ongoing practice of alignment.',
        prompt:
          'What does balance mean to you? What\'s one thing you want to remember about creating more balance in your life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'dealing-with-disappointment',
    title: 'Dealing with Disappointment',
    tagline: 'Process letdowns with grace',
    category: 'Emotional Regulation',
    description:
      'Disappointment is inevitable, but how we process it matters. This path helps you sit with disappointment and find ways to move through it.',
    icon: 'CloudOff',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-gray-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'disappointment-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Disappointment is one of life's most common and painful emotions. It comes when reality doesn't meet our hopes or expectations. While we can't avoid disappointment, we can learn to process it in ways that don't leave us stuck or bitter.",
        skippable: false,
      },
      {
        id: 'disappointment-prompt-1',
        type: 'prompt',
        title: 'A Recent Disappointment',
        content:
          'Naming our disappointments helps us process them.',
        prompt:
          'What disappointment are you currently carrying or have recently experienced? It can be big or small. Describe what happened and what you were hoping for.',
        skippable: true,
      },
      {
        id: 'disappointment-prompt-2',
        type: 'prompt',
        title: 'The Feelings Underneath',
        content:
          'Disappointment often covers other emotions.',
        prompt:
          'What feelings come with this disappointment? Is there sadness, anger, embarrassment, or grief underneath? What did this disappointment touch in you?',
        skippable: true,
      },
      {
        id: 'disappointment-exercise-1',
        type: 'exercise',
        title: 'Allowing the Feeling',
        content:
          'Sometimes we need to simply feel our disappointment without trying to fix it.',
        exerciseInstructions: [
          'Close your eyes and breathe',
          'Let yourself feel the disappointment',
          'Notice where it sits in your body',
          'Say to yourself: "It\'s okay to be disappointed"',
          'Stay with the feeling for a moment',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'disappointment-prompt-3',
        type: 'prompt',
        title: 'Adjusting Expectations',
        content:
          'Sometimes disappointment teaches us about our expectations.',
        prompt:
          'Looking back, were your expectations realistic? What can this disappointment teach you about what to expect in the future? Is there wisdom here?',
        skippable: true,
      },
      {
        id: 'disappointment-prompt-4',
        type: 'prompt',
        title: 'Moving Forward',
        content:
          'We can honor our disappointment while still moving on.',
        prompt:
          'What would it look like to accept this disappointment without letting it define you? What might still be possible? What small step forward could you take?',
        skippable: true,
      },
      {
        id: 'disappointment-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Disappointment is part of caring about things. It hurts because something mattered to you.',
        prompt:
          'What has this reflection shown you about dealing with disappointment? How might you be gentler with yourself in future letdowns?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-emotional-intelligence',
    title: 'Building Emotional Intelligence',
    tagline: 'Understand and manage your emotions better',
    category: 'Self-Development',
    description:
      'Emotional intelligence is the ability to recognize, understand, and work with emotions, both yours and others\'. This path helps you develop this essential skill.',
    icon: 'Lightbulb',
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-yellow-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'eq-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Emotional intelligence (EQ) isn't about being emotional or suppressing emotions, it's about having a healthy relationship with your inner world. High EQ helps with relationships, decision-making, and overall wellbeing. Like any skill, it can be developed.",
        skippable: false,
      },
      {
        id: 'eq-prompt-1',
        type: 'prompt',
        title: 'Your Emotional Awareness',
        content:
          'The first component of EQ is recognizing what you\'re feeling.',
        prompt:
          'How aware are you of your emotions moment to moment? Do you tend to notice feelings quickly, or do they build up before you recognize them? How would you rate your emotional awareness?',
        skippable: true,
      },
      {
        id: 'eq-prompt-2',
        type: 'prompt',
        title: 'Naming Emotions',
        content:
          'Having a rich emotional vocabulary helps us process feelings.',
        prompt:
          'Think of a recent situation that stirred emotions. Try to name all the feelings involved, go beyond "good" or "bad." Can you identify subtle emotions like frustration, relief, unease, or longing?',
        skippable: true,
      },
      {
        id: 'eq-exercise-1',
        type: 'exercise',
        title: 'Emotion Check-In',
        content:
          'Practice noticing your current emotional state.',
        exerciseInstructions: [
          'Pause and turn attention inward',
          'Ask yourself: "What am I feeling right now?"',
          'Try to name 2-3 emotions present',
          'Notice where you feel them in your body',
          'Accept whatever you find',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'eq-prompt-3',
        type: 'prompt',
        title: 'Managing Strong Emotions',
        content:
          'EQ includes being able to regulate intense feelings without suppressing them.',
        prompt:
          'How do you typically handle strong emotions? Do you express them, suppress them, or something in between? What strategies help you manage intense feelings in healthy ways?',
        skippable: true,
      },
      {
        id: 'eq-prompt-4',
        type: 'prompt',
        title: 'Reading Others',
        content:
          'EQ also involves understanding others\' emotions.',
        prompt:
          'How well do you pick up on others\' emotional states? Can you usually tell how someone is feeling? When have you misread someone\'s emotions, and what did you learn?',
        skippable: true,
      },
      {
        id: 'eq-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Emotional intelligence grows with practice and intention. Every moment of emotional awareness builds the skill.',
        prompt:
          'What aspect of emotional intelligence would you like to develop? What\'s one way you could practice this week?',
        skippable: false,
      },
    ],
  },
  {
    id: 'creating-healthy-habits',
    title: 'Creating Healthy Habits',
    tagline: 'Build routines that support your wellbeing',
    category: 'Wellness',
    description:
      'Habits shape our lives more than we realize. This path explores how to build habits that serve you and let go of those that don\'t.',
    icon: 'Repeat',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-emerald-50',
    borderColor: 'border-green-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'habits-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Our daily habits, tiny as they seem, compound over time to shape our health, relationships, and success. Building good habits isn't about willpower, it's about understanding how habits work and designing your environment to support you.",
        skippable: false,
      },
      {
        id: 'habits-prompt-1',
        type: 'prompt',
        title: 'Your Current Habits',
        content:
          'Awareness of existing habits is the starting point for change.',
        prompt:
          'What habits do you currently have, both helpful and unhelpful? Think about your morning routine, work habits, evening patterns. What do you do almost automatically?',
        skippable: true,
      },
      {
        id: 'habits-prompt-2',
        type: 'prompt',
        title: 'A Habit You Want',
        content:
          'Focusing on one habit at a time increases your chances of success.',
        prompt:
          'What one healthy habit would you most like to build? Why is this habit important to you? How would your life be different if this habit was automatic?',
        skippable: true,
      },
      {
        id: 'habits-exercise-1',
        type: 'exercise',
        title: 'Habit Stacking',
        content:
          'Connecting new habits to existing ones makes them easier to remember.',
        exerciseInstructions: [
          'Think of a habit you already do daily',
          'Link your new habit to it: "After I [current habit], I will [new habit]"',
          'Make the new habit tiny - just 2 minutes',
          'Visualize yourself doing both in sequence',
          'Plan to try this tomorrow',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'habits-prompt-3',
        type: 'prompt',
        title: 'Obstacles and Solutions',
        content:
          'Anticipating challenges helps you prepare for them.',
        prompt:
          'What typically gets in the way when you try to build new habits? What could you do differently to make your desired habit easier to do and harder to skip?',
        skippable: true,
      },
      {
        id: 'habits-prompt-4',
        type: 'prompt',
        title: 'Environment Design',
        content:
          'Your environment shapes your behavior more than motivation does.',
        prompt:
          'How could you change your environment to make your desired habit more obvious and convenient? What friction could you remove?',
        skippable: true,
      },
      {
        id: 'habits-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Small habits, consistently practiced, create remarkable change over time.',
        prompt:
          'What\'s your plan for building your desired habit? What\'s the smallest version of it you could start with?',
        skippable: false,
      },
    ],
  },
  {
    id: 'embracing-vulnerability',
    title: 'Embracing Vulnerability',
    tagline: 'Find strength in being open',
    category: 'Relationships',
    description:
      'Vulnerability feels risky, but it\'s the birthplace of connection, creativity, and courage. This path explores how to embrace vulnerability as strength.',
    icon: 'HeartHandshake',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-pink-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'vulnerability-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We often see vulnerability as weakness, but it's actually the foundation of genuine connection and courage. Being vulnerable means showing up authentically, even when there's no guarantee of how we'll be received. It's scary, but it's also where the magic happens.",
        skippable: false,
      },
      {
        id: 'vulnerability-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Vulnerability',
        content:
          'Understanding how you currently relate to vulnerability is the first step.',
        prompt:
          'How do you feel about being vulnerable? Do you tend to avoid it, or can you embrace it sometimes? What messages did you receive growing up about showing vulnerability?',
        skippable: true,
      },
      {
        id: 'vulnerability-prompt-2',
        type: 'prompt',
        title: 'Your Armor',
        content:
          'We all develop ways to protect ourselves from vulnerability.',
        prompt:
          'What "armor" do you wear to avoid being vulnerable? Do you use humor, perfectionism, staying busy, or emotional distance? How does this armor protect you, and what does it cost?',
        skippable: true,
      },
      {
        id: 'vulnerability-exercise-1',
        type: 'exercise',
        title: 'Safe Vulnerability',
        content:
          'Practice the feeling of vulnerability in a safe space.',
        exerciseInstructions: [
          'Think of something true about yourself you rarely share',
          'Imagine sharing it with someone you trust',
          'Notice what feelings come up',
          'Breathe into any discomfort',
          'Recognize your courage in even imagining this',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'vulnerability-prompt-3',
        type: 'prompt',
        title: 'When Vulnerability Paid Off',
        content:
          'You\'ve likely had positive experiences with vulnerability, even if they felt scary.',
        prompt:
          'Think of a time when being vulnerable led to deeper connection, understanding, or relief. What happened? What made you willing to take that risk?',
        skippable: true,
      },
      {
        id: 'vulnerability-prompt-4',
        type: 'prompt',
        title: 'Growing Your Capacity',
        content:
          'Vulnerability is a skill that can be developed gradually.',
        prompt:
          'Where in your life might you practice a little more vulnerability? With whom would it feel safest to start? What small step could you take?',
        skippable: true,
      },
      {
        id: 'vulnerability-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Vulnerability is not weakness, it\'s the courage to be seen as you truly are.',
        prompt:
          'How has your perspective on vulnerability shifted? What would you like to remember about the strength in being vulnerable?',
        skippable: false,
      },
    ],
  },
  {
    id: 'overcoming-imposter-syndrome',
    title: 'Overcoming Imposter Syndrome',
    tagline: 'Stop feeling like a fraud',
    category: 'Self-Development',
    description:
      'Imposter syndrome makes you feel like you don\'t belong or deserve your success. This path helps you recognize and challenge these feelings.',
    icon: 'UserCheck',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-blue-50',
    borderColor: 'border-indigo-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'imposter-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Imposter syndrome is that nagging feeling that you're a fraud, that your success is just luck, and that any moment someone will discover you don't really belong. It's incredibly common, especially among high achievers, and it's not based in reality. This path helps you see yourself more clearly.",
        skippable: false,
      },
      {
        id: 'imposter-prompt-1',
        type: 'prompt',
        title: 'Your Imposter Experience',
        content:
          'Understanding how imposter syndrome shows up for you is the first step.',
        prompt:
          'Where does imposter syndrome show up in your life? At work, in relationships, in creative pursuits? What does your inner imposter voice say to you?',
        skippable: true,
      },
      {
        id: 'imposter-prompt-2',
        type: 'prompt',
        title: 'The Evidence Against',
        content:
          'Imposter syndrome ignores real evidence of your competence.',
        prompt:
          'List some concrete evidence that you do belong, that you have earned your place. What have you accomplished? What skills have you developed? What feedback have you received?',
        skippable: true,
      },
      {
        id: 'imposter-exercise-1',
        type: 'exercise',
        title: 'Reframing Success',
        content:
          'Practice attributing your successes accurately.',
        exerciseInstructions: [
          'Think of a recent success or accomplishment',
          'Notice if you dismiss it as "luck" or "anyone could do that"',
          'Instead, identify the skills, effort, or knowledge you contributed',
          'Say to yourself: "I contributed to this success"',
          'Let yourself feel a moment of earned pride',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'imposter-prompt-3',
        type: 'prompt',
        title: 'The Cost of Imposter Feelings',
        content:
          'Imposter syndrome often holds us back from opportunities.',
        prompt:
          'What has imposter syndrome cost you? Opportunities not taken, ideas not shared, promotions not pursued? How has it limited you?',
        skippable: true,
      },
      {
        id: 'imposter-prompt-4',
        type: 'prompt',
        title: 'You\'re Not Alone',
        content:
          'Most successful people experience imposter syndrome.',
        prompt:
          'Knowing that imposter syndrome is nearly universal among achievers, how does that change how you view your own feelings of being a fraud? What would you say to a friend who felt this way?',
        skippable: true,
      },
      {
        id: 'imposter-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are not a fraud. Your achievements are real. You belong.',
        prompt:
          'What truth about yourself do you want to remember when imposter syndrome strikes? What mantra or reminder could help?',
        skippable: false,
      },
    ],
  },
  {
    id: 'processing-grief',
    title: 'Processing Grief',
    tagline: 'Navigate loss with gentleness',
    category: 'Life Transitions',
    description:
      'Grief has no timeline and no "right" way. This path offers a gentle space to be with your grief, whatever form it takes.',
    icon: 'Cloud',
    gradientFrom: 'from-gray-50',
    gradientTo: 'to-slate-50',
    borderColor: 'border-gray-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'grief-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Grief is love with nowhere to go. It's the natural response to losing someone or something precious. There's no right way to grieve, no correct timeline, and no stage you 'should' be in. This path is simply a space to be with your grief, whatever it looks like today.",
        skippable: false,
      },
      {
        id: 'grief-prompt-1',
        type: 'prompt',
        title: 'Your Loss',
        content:
          'Naming what we\'ve lost honors the significance of the loss.',
        prompt:
          'What loss are you grieving? It could be a person, a relationship, a dream, a phase of life, or anything else. Take your time describing what you\'ve lost and what it meant to you.',
        skippable: true,
      },
      {
        id: 'grief-prompt-2',
        type: 'prompt',
        title: 'How Grief Shows Up',
        content:
          'Grief manifests in many ways, not just sadness.',
        prompt:
          'How is grief showing up for you right now? Is it sadness, anger, numbness, guilt, relief, or a mix? How is it affecting your body, your thoughts, your daily life?',
        skippable: true,
      },
      {
        id: 'grief-exercise-1',
        type: 'exercise',
        title: 'Being With Grief',
        content:
          'Sometimes grief needs to be felt, not fixed.',
        exerciseInstructions: [
          'Find a quiet space',
          'Allow yourself to feel whatever is present',
          'You don\'t need to do anything with the feeling',
          'Place a hand on your heart if that feels comforting',
          'Stay as long as you need',
        ],
        exerciseDuration: 120,
        skippable: true,
      },
      {
        id: 'grief-prompt-3',
        type: 'prompt',
        title: 'What Helps',
        content:
          'Even in grief, there are things that bring small moments of comfort.',
        prompt:
          'What has helped you, even a little, in your grief? Certain people, activities, rituals, or ways of remembering? What brings even small moments of peace?',
        skippable: true,
      },
      {
        id: 'grief-prompt-4',
        type: 'prompt',
        title: 'Carrying Them Forward',
        content:
          'Sometimes grief transforms into a way of honoring what we\'ve lost.',
        prompt:
          'How might you carry forward what you loved? What would honor their memory or the meaning of what you\'ve lost? How does their impact continue in your life?',
        skippable: true,
      },
      {
        id: 'grief-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Grief is not something to get over, but something to carry with increasing grace.',
        prompt:
          'What do you want to remember about your grief and your capacity to hold it? What support do you need as you continue?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-inner-peace',
    title: 'Finding Inner Peace',
    tagline: 'Cultivate calm within the storm',
    category: 'Wellness',
    description:
      'Inner peace isn\'t about having a perfect life, it\'s about finding stillness within regardless of external chaos. This path explores how to access that calm.',
    icon: 'Flower2',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-teal-50',
    borderColor: 'border-emerald-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'peace-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Inner peace isn't the absence of problems or challenges, it's finding a place of calm within yourself that remains steady regardless of what's happening around you. It's not about suppressing emotions, but about developing a centered awareness from which to experience life.",
        skippable: false,
      },
      {
        id: 'peace-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Peace',
        content:
          'Understanding where you are helps you know where to go.',
        prompt:
          'How would you describe your current level of inner peace? What tends to disturb your peace most? When do you feel most calm and centered?',
        skippable: true,
      },
      {
        id: 'peace-prompt-2',
        type: 'prompt',
        title: 'Sources of Inner Turbulence',
        content:
          'Identifying what disrupts your peace helps you work with it.',
        prompt:
          'What thoughts, situations, or relationships most disturb your inner peace? Are there patterns in what triggers inner turmoil? What keeps your mind from being still?',
        skippable: true,
      },
      {
        id: 'peace-exercise-1',
        type: 'exercise',
        title: 'The Still Point',
        content:
          'Practice accessing a moment of stillness within.',
        exerciseInstructions: [
          'Close your eyes and take several deep breaths',
          'Imagine a still, calm place deep within you',
          'It might be like a quiet pool of water',
          'Rest your attention there',
          'Notice that this stillness is always available',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'peace-prompt-3',
        type: 'prompt',
        title: 'Acceptance and Peace',
        content:
          'Much of our inner turbulence comes from resisting what is.',
        prompt:
          'What in your life are you struggling to accept? How might acceptance (not approval, just acknowledgment) bring more peace? What would it mean to stop fighting reality?',
        skippable: true,
      },
      {
        id: 'peace-prompt-4',
        type: 'prompt',
        title: 'Cultivating Peace Daily',
        content:
          'Peace is cultivated through regular practice.',
        prompt:
          'What practices or habits might help you cultivate more inner peace? What could you do daily to connect with that calm center within yourself?',
        skippable: true,
      },
      {
        id: 'peace-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Peace is always within you, waiting to be accessed. It doesn\'t depend on circumstances.',
        prompt:
          'What insight about inner peace resonates most with you? How might you nurture more peace in your daily life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'navigating-conflict',
    title: 'Navigating Conflict',
    tagline: 'Handle disagreements with skill',
    category: 'Relationships',
    description:
      'Conflict is inevitable in relationships, but it doesn\'t have to be destructive. This path helps you approach conflict with more skill and less fear.',
    icon: 'Swords',
    gradientFrom: 'from-red-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-red-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'conflict-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Conflict is a natural part of human relationships. When handled well, it can actually strengthen bonds and lead to better understanding. When handled poorly, it damages trust and connection. This path is about developing healthier ways to navigate disagreements.",
        skippable: false,
      },
      {
        id: 'conflict-prompt-1',
        type: 'prompt',
        title: 'Your Conflict Style',
        content:
          'We all have default ways of handling conflict.',
        prompt:
          'How do you typically respond to conflict? Do you avoid it, get aggressive, shut down, over-accommodate, or something else? Where did you learn this style?',
        skippable: true,
      },
      {
        id: 'conflict-prompt-2',
        type: 'prompt',
        title: 'A Current or Recent Conflict',
        content:
          'Working with a real example helps us learn.',
        prompt:
          'Think of a conflict you\'re in or recently experienced. What was it about on the surface? What might be underneath for you and the other person (needs, fears, values)?',
        skippable: true,
      },
      {
        id: 'conflict-exercise-1',
        type: 'exercise',
        title: 'Perspective Taking',
        content:
          'Practice seeing conflict from the other side.',
        exerciseInstructions: [
          'Think of the conflict you just described',
          'Imagine being the other person',
          'What might they be feeling?',
          'What might they need?',
          'What might make them feel heard?',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'conflict-prompt-3',
        type: 'prompt',
        title: 'What You Really Need',
        content:
          'Conflicts often involve unmet needs beneath surface issues.',
        prompt:
          'In conflicts, what do you really need? Is it respect, understanding, safety, fairness, or something else? How might you express this need clearly?',
        skippable: true,
      },
      {
        id: 'conflict-prompt-4',
        type: 'prompt',
        title: 'Conflict Repair',
        content:
          'Healthy relationships repair after conflict.',
        prompt:
          'How do you typically repair after conflicts? Do you apologize, discuss what happened, or pretend it didn\'t occur? What would healthy repair look like for you?',
        skippable: true,
      },
      {
        id: 'conflict-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Conflict is inevitable; damage is optional. How we handle disagreements shapes our relationships.',
        prompt:
          'What have you learned about your relationship with conflict? What\'s one thing you\'d like to do differently next time?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-self-worth',
    title: 'Building Self-Worth',
    tagline: 'Know your inherent value',
    category: 'Self-Development',
    description:
      'Self-worth isn\'t about achievements or others\' opinions, it\'s knowing you have value simply because you exist. This path helps you strengthen that foundation.',
    icon: 'Gem',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-violet-50',
    borderColor: 'border-purple-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'worth-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-worth is the deep-down belief that you have value as a person, not because of what you do, achieve, or provide to others, but simply because you exist. Many of us have a fragile sense of worth that depends on external validation. This path is about building something more solid.",
        skippable: false,
      },
      {
        id: 'worth-prompt-1',
        type: 'prompt',
        title: 'Your Current Sense of Worth',
        content:
          'Honestly assessing where you are is the starting point.',
        prompt:
          'How would you describe your sense of self-worth? Does it feel stable or fragile? What tends to boost it, and what tends to deflate it?',
        skippable: true,
      },
      {
        id: 'worth-prompt-2',
        type: 'prompt',
        title: 'Where You Learned Your Worth',
        content:
          'Our beliefs about our worth often have old origins.',
        prompt:
          'What messages did you receive about your worth growing up? Were you valued unconditionally, or was worth tied to performance, appearance, or behavior? How do these messages still affect you?',
        skippable: true,
      },
      {
        id: 'worth-exercise-1',
        type: 'exercise',
        title: 'Unconditional Worth',
        content:
          'Practice the feeling of inherent value.',
        exerciseInstructions: [
          'Place a hand on your heart',
          'Say to yourself: "I have worth simply because I exist"',
          'Notice any resistance or disbelief',
          'Repeat: "My worth is not dependent on what I do"',
          'Let these words sink in',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'worth-prompt-3',
        type: 'prompt',
        title: 'Worth vs. Achievement',
        content:
          'Many of us confuse worth with accomplishment.',
        prompt:
          'How much does your sense of worth depend on achievement, productivity, or external validation? What would it mean to feel worthy even on days when you accomplish nothing?',
        skippable: true,
      },
      {
        id: 'worth-prompt-4',
        type: 'prompt',
        title: 'Building a Stronger Foundation',
        content:
          'Self-worth can be strengthened through practice.',
        prompt:
          'What might help you build a more stable sense of self-worth? How could you remind yourself of your inherent value? What beliefs might you need to challenge?',
        skippable: true,
      },
      {
        id: 'worth-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are worthy. Not because of anything you do, but because of who you are.',
        prompt:
          'What truth about your worth do you most need to remember? How can you nurture a stronger sense of inherent value?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-expectations',
    title: 'Managing Expectations',
    tagline: 'Find freedom from impossible standards',
    category: 'Emotional Regulation',
    description:
      'Unexamined expectations cause much of our suffering. This path helps you identify and adjust expectations, of yourself, others, and life.',
    icon: 'ListChecks',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-blue-50',
    borderColor: 'border-sky-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'expectations-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Expectations are beliefs about how things should be. When reality matches expectations, we're satisfied. When it doesn't, we suffer. Many of our expectations are unconscious and unrealistic. This path is about bringing awareness to expectations and making peace with reality.",
        skippable: false,
      },
      {
        id: 'expectations-prompt-1',
        type: 'prompt',
        title: 'Expectations of Yourself',
        content:
          'We often hold ourselves to impossible standards.',
        prompt:
          'What do you expect of yourself? Are these expectations realistic and kind, or impossibly high? What happens when you don\'t meet your own expectations?',
        skippable: true,
      },
      {
        id: 'expectations-prompt-2',
        type: 'prompt',
        title: 'Expectations of Others',
        content:
          'Our expectations of others often go unspoken.',
        prompt:
          'What do you expect from people in your life, partner, friends, family, colleagues? Are these expectations fair and clearly communicated? How do unmet expectations affect your relationships?',
        skippable: true,
      },
      {
        id: 'expectations-exercise-1',
        type: 'exercise',
        title: 'Expectation Inquiry',
        content:
          'Question the validity of your expectations.',
        exerciseInstructions: [
          'Think of an expectation that\'s causing you stress',
          'Ask: Is this expectation realistic?',
          'Ask: Where did this expectation come from?',
          'Ask: What if I let this expectation go?',
          'Notice how questioning changes your relationship to it',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'expectations-prompt-3',
        type: 'prompt',
        title: 'Expectations vs. Reality',
        content:
          'Acceptance doesn\'t mean approval, it means acknowledging what is.',
        prompt:
          'Where is there a gap between your expectations and reality? What would it mean to accept things as they are, rather than as you think they should be?',
        skippable: true,
      },
      {
        id: 'expectations-prompt-4',
        type: 'prompt',
        title: 'Healthy Expectations',
        content:
          'The goal isn\'t to have no expectations, but to have realistic ones.',
        prompt:
          'What would healthy, realistic expectations look like, of yourself, of others, of life? How might you adjust your expectations to reduce unnecessary suffering?',
        skippable: true,
      },
      {
        id: 'expectations-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Peace often comes not from getting what we expect, but from examining and adjusting our expectations.',
        prompt:
          'What have you learned about your expectations? What adjustment might bring you more peace?',
        skippable: false,
      },
    ],
  },
  {
    id: 'cultivating-optimism',
    title: 'Cultivating Optimism',
    tagline: 'Develop a more hopeful outlook',
    category: 'Growth & Purpose',
    description:
      'Optimism isn\'t about ignoring problems, it\'s about believing in possibility. This path helps you develop a more hopeful way of seeing the world.',
    icon: 'Sunrise',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'optimism-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Optimism isn't naive positivity that ignores problems. It's a perspective that acknowledges difficulties while believing in the possibility of positive outcomes. Research shows optimism can be learned and has real benefits for mental and physical health.",
        skippable: false,
      },
      {
        id: 'optimism-prompt-1',
        type: 'prompt',
        title: 'Your Current Outlook',
        content:
          'Understanding your default perspective helps you work with it.',
        prompt:
          'Would you describe yourself as generally optimistic, pessimistic, or somewhere in between? What shaped this outlook? How does it serve you, and how does it limit you?',
        skippable: true,
      },
      {
        id: 'optimism-prompt-2',
        type: 'prompt',
        title: 'The Stories You Tell',
        content:
          'How we explain events shapes our outlook.',
        prompt:
          'When something bad happens, what story do you tell yourself? Do you see it as permanent or temporary? Personal or situational? How about when something good happens?',
        skippable: true,
      },
      {
        id: 'optimism-exercise-1',
        type: 'exercise',
        title: 'Finding the Possible',
        content:
          'Practice looking for possibility.',
        exerciseInstructions: [
          'Think of a current challenge or problem',
          'Ask: What\'s one possible good outcome?',
          'Ask: What\'s one thing I could do?',
          'Ask: What might I learn from this?',
          'Notice how this shifts your feeling about it',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'optimism-prompt-3',
        type: 'prompt',
        title: 'Evidence for Hope',
        content:
          'Sometimes we need to actively look for reasons for hope.',
        prompt:
          'What evidence do you have that good things can happen? Think of times when things worked out, when you overcame challenges, when unexpected good came your way.',
        skippable: true,
      },
      {
        id: 'optimism-prompt-4',
        type: 'prompt',
        title: 'Practicing Optimism',
        content:
          'Optimism is a skill that grows with practice.',
        prompt:
          'How might you practice a more optimistic outlook? What daily habits might help you notice the good and believe in possibility more often?',
        skippable: true,
      },
      {
        id: 'optimism-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Optimism isn\'t about denying difficulty, it\'s about believing in your ability to handle it and in the possibility of good.',
        prompt:
          'What would you like to remember about cultivating optimism? What hopeful thought can you carry forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'dealing-with-criticism',
    title: 'Dealing with Criticism',
    tagline: 'Handle feedback without crumbling',
    category: 'Emotional Regulation',
    description:
      'Criticism can sting, but it doesn\'t have to devastate. This path helps you develop a healthier relationship with feedback and judgment.',
    icon: 'MessageSquare',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-zinc-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'criticism-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Criticism is inevitable, we'll all face judgment, feedback, and disapproval at times. What matters is how we receive it. Some criticism is valuable; some isn't. Learning to tell the difference and respond skillfully is a key life skill.",
        skippable: false,
      },
      {
        id: 'criticism-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Criticism',
        content:
          'How you typically respond to criticism reveals important patterns.',
        prompt:
          'How do you usually react when criticized? Do you get defensive, shut down, over-apologize, or ruminate? Where did you learn to respond this way?',
        skippable: true,
      },
      {
        id: 'criticism-prompt-2',
        type: 'prompt',
        title: 'A Recent Criticism',
        content:
          'Working with a specific example helps us learn.',
        prompt:
          'Think of a recent criticism you received. How did it make you feel? How did you respond? Looking back, was there any truth in it, or was it unfair?',
        skippable: true,
      },
      {
        id: 'criticism-exercise-1',
        type: 'exercise',
        title: 'The Pause',
        content:
          'Practice pausing before reacting to criticism.',
        exerciseInstructions: [
          'Imagine receiving a critical comment',
          'Instead of immediately reacting, pause',
          'Take a breath',
          'Separate the feedback from your worth as a person',
          'Then decide how to respond',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'criticism-prompt-3',
        type: 'prompt',
        title: 'Sorting Feedback',
        content:
          'Not all criticism deserves the same weight.',
        prompt:
          'How can you tell the difference between criticism worth considering and criticism to let go? What makes feedback valuable? Whose opinions matter most to you?',
        skippable: true,
      },
      {
        id: 'criticism-prompt-4',
        type: 'prompt',
        title: 'Criticism and Self-Worth',
        content:
          'The deeper issue is often about worthiness.',
        prompt:
          'Why does criticism hurt so much? What does it threaten? How might you receive feedback without it affecting your core sense of worth?',
        skippable: true,
      },
      {
        id: 'criticism-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You can receive feedback without letting it define you. Your worth isn\'t up for debate.',
        prompt:
          'What would you like to remember about handling criticism? How can you stay grounded when facing judgment?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-your-voice',
    title: 'Finding Your Voice',
    tagline: 'Speak your truth with confidence',
    category: 'Self-Development',
    description:
      'Your voice matters. This path helps you discover what you want to say and develop the confidence to say it.',
    icon: 'Megaphone',
    gradientFrom: 'from-cyan-50',
    gradientTo: 'to-teal-50',
    borderColor: 'border-cyan-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'voice-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Finding your voice is about more than speaking up, it's about knowing what you think, feel, and believe, and being willing to express it authentically. Many of us learned to silence ourselves or adapt our voice to please others. This path is about reclaiming your authentic expression.",
        skippable: false,
      },
      {
        id: 'voice-prompt-1',
        type: 'prompt',
        title: 'Your Current Voice',
        content:
          'Assessing where you are with self-expression.',
        prompt:
          'How comfortable are you speaking up and sharing your true thoughts? In what situations do you hold back? When do you feel free to express yourself fully?',
        skippable: true,
      },
      {
        id: 'voice-prompt-2',
        type: 'prompt',
        title: 'What Silenced You',
        content:
          'Understanding why we learned to stay quiet.',
        prompt:
          'What experiences taught you to silence your voice? Were you criticized, ignored, or punished for speaking up? What messages did you receive about your right to be heard?',
        skippable: true,
      },
      {
        id: 'voice-exercise-1',
        type: 'exercise',
        title: 'The Unspoken',
        content:
          'Practice identifying what you haven\'t been saying.',
        exerciseInstructions: [
          'Think of something you\'ve wanted to say but haven\'t',
          'It could be an opinion, a feeling, or a need',
          'Write it down or say it aloud to yourself',
          'Notice how it feels to express it, even privately',
          'Your truth is valid',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'voice-prompt-3',
        type: 'prompt',
        title: 'Fear of Being Heard',
        content:
          'Sometimes we fear the consequences of speaking up.',
        prompt:
          'What do you fear might happen if you fully expressed yourself? Rejection, conflict, disappointment? What\'s the worst that could happen, and could you handle it?',
        skippable: true,
      },
      {
        id: 'voice-prompt-4',
        type: 'prompt',
        title: 'Reclaiming Your Voice',
        content:
          'Your voice can be strengthened with practice.',
        prompt:
          'Where in your life could you practice speaking up more? What would you say if you knew it would be received with respect? What small step could you take?',
        skippable: true,
      },
      {
        id: 'voice-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Your voice is an essential part of who you are. It deserves to be heard.',
        prompt:
          'What truth do you most want to express? How will you nurture your authentic voice going forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'embracing-change',
    title: 'Embracing Change',
    tagline: 'Find opportunity in transition',
    category: 'Life Transitions',
    description:
      'Change is the only constant, yet we often resist it. This path helps you develop a more open relationship with life\'s transitions.',
    icon: 'RefreshCw',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-violet-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'embrace-change-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Change is inevitable, but our resistance to it is optional. While some changes are painful and unwelcome, fighting against change often increases our suffering. This path explores how to flow with life's transitions rather than struggling against them.",
        skippable: false,
      },
      {
        id: 'embrace-change-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Change',
        content:
          'How we relate to change shapes our experience of it.',
        prompt:
          'How do you typically respond to change? Do you embrace it, resist it, or something in between? What kinds of change are hardest for you?',
        skippable: true,
      },
      {
        id: 'embrace-change-prompt-2',
        type: 'prompt',
        title: 'A Change You\'re Facing',
        content:
          'Working with a real change helps make this concrete.',
        prompt:
          'What change are you currently facing or anticipating? How do you feel about it? What are you resisting, and what might you be able to accept?',
        skippable: true,
      },
      {
        id: 'embrace-change-exercise-1',
        type: 'exercise',
        title: 'Letting Go',
        content:
          'Practice the feeling of releasing resistance.',
        exerciseInstructions: [
          'Close your eyes and breathe',
          'Notice where you\'re holding tension about change',
          'With each exhale, imagine softening that resistance',
          'Say to yourself: "I can flow with this"',
          'Feel the difference when you stop fighting',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'embrace-change-prompt-3',
        type: 'prompt',
        title: 'What Change Makes Possible',
        content:
          'Every ending contains the seeds of a beginning.',
        prompt:
          'What might this change make possible? Even if it\'s unwelcome, what doors might it open? What could you learn, develop, or discover through this transition?',
        skippable: true,
      },
      {
        id: 'embrace-change-prompt-4',
        type: 'prompt',
        title: 'Building Change Resilience',
        content:
          'We can develop our capacity to navigate change.',
        prompt:
          'What has helped you navigate changes in the past? What resources, beliefs, or practices support you through transitions? How can you strengthen your change resilience?',
        skippable: true,
      },
      {
        id: 'embrace-change-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'The only way out is through. Embracing change doesn\'t mean liking it, it means working with it rather than against it.',
        prompt:
          'What shift in perspective about change resonates with you? How will you approach your current or next transition?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-empathy',
    title: 'Building Empathy',
    tagline: 'Deepen your connection with others',
    category: 'Relationships',
    description:
      'Empathy is the ability to understand and share others\' feelings. This path helps you develop this essential relationship skill.',
    icon: 'Users',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-pink-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'empathy-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Empathy is the ability to understand what someone else is feeling and to share in that experience. It's different from sympathy (feeling for someone) - empathy is feeling with them. This capacity for understanding others is at the heart of meaningful connection.",
        skippable: false,
      },
      {
        id: 'empathy-prompt-1',
        type: 'prompt',
        title: 'Your Empathic Capacity',
        content:
          'We all have varying levels of natural empathy.',
        prompt:
          'How empathetic do you consider yourself? Are there certain people or situations where empathy comes easily, and others where it\'s harder? What gets in the way?',
        skippable: true,
      },
      {
        id: 'empathy-prompt-2',
        type: 'prompt',
        title: 'Barriers to Empathy',
        content:
          'Certain things can block our ability to empathize.',
        prompt:
          'What makes empathy difficult for you? Is it when you disagree with someone, when you\'re stressed, when you don\'t understand their experience? What barriers do you notice?',
        skippable: true,
      },
      {
        id: 'empathy-exercise-1',
        type: 'exercise',
        title: 'Walking in Their Shoes',
        content:
          'Practice imagining another\'s perspective.',
        exerciseInstructions: [
          'Think of someone you\'ve had difficulty understanding',
          'Imagine waking up as them',
          'What might their fears be? Their hopes?',
          'What might be driving their behavior?',
          'Notice if this changes how you feel toward them',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'empathy-prompt-3',
        type: 'prompt',
        title: 'Empathy in Action',
        content:
          'Empathy is most valuable when expressed.',
        prompt:
          'How do you show empathy to others? When someone shares their struggles, what do you do or say? How might you express empathy more skillfully?',
        skippable: true,
      },
      {
        id: 'empathy-prompt-4',
        type: 'prompt',
        title: 'Self-Empathy',
        content:
          'Empathy for others often starts with empathy for ourselves.',
        prompt:
          'How empathetic are you with yourself? Can you understand and accept your own feelings with compassion? How might more self-empathy help you empathize with others?',
        skippable: true,
      },
      {
        id: 'empathy-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Empathy is a bridge between hearts. It\'s how we truly see and are seen by others.',
        prompt:
          'What would you like to remember about building empathy? How might you practice it more intentionally?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-energy-levels',
    title: 'Managing Energy Levels',
    tagline: 'Protect and replenish your energy',
    category: 'Wellness',
    description:
      'Your energy is a precious resource. This path helps you understand what drains and restores you, and how to manage your energy more wisely.',
    icon: 'BatteryCharging',
    gradientFrom: 'from-lime-50',
    gradientTo: 'to-green-50',
    borderColor: 'border-lime-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'energy-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Your energy is finite. Unlike time, which passes regardless, energy can be generated and depleted. Understanding what drains you and what fills you up is essential for sustainable wellbeing. This path is about becoming a better steward of your energy.",
        skippable: false,
      },
      {
        id: 'energy-prompt-1',
        type: 'prompt',
        title: 'Your Current Energy',
        content:
          'Taking stock of where you are helps you know what you need.',
        prompt:
          'How would you describe your energy levels lately? Are you running on empty, reasonably charged, or full? What\'s been affecting your energy most?',
        skippable: true,
      },
      {
        id: 'energy-prompt-2',
        type: 'prompt',
        title: 'Energy Drains',
        content:
          'Some activities, people, and habits deplete us.',
        prompt:
          'What drains your energy? Certain tasks, people, environments, or habits? Make a mental list of your biggest energy drains. Are any of these within your control to change?',
        skippable: true,
      },
      {
        id: 'energy-exercise-1',
        type: 'exercise',
        title: 'Quick Energy Reset',
        content:
          'Practice a rapid energy refresh.',
        exerciseInstructions: [
          'Stand up if you can',
          'Take 3 deep breaths',
          'Shake out your hands and arms',
          'Roll your shoulders back',
          'Notice any shift in your energy',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'energy-prompt-3',
        type: 'prompt',
        title: 'Energy Sources',
        content:
          'Just as some things drain us, others fill us up.',
        prompt:
          'What gives you energy? Certain activities, people, places, or practices? What makes you feel alive and recharged? How often do you engage with these energy sources?',
        skippable: true,
      },
      {
        id: 'energy-prompt-4',
        type: 'prompt',
        title: 'Energy Management Plan',
        content:
          'Intentional energy management improves everything.',
        prompt:
          'How might you better protect your energy from drains and increase contact with energy sources? What one change could you make this week to improve your energy management?',
        skippable: true,
      },
      {
        id: 'energy-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You can\'t pour from an empty cup. Taking care of your energy is taking care of everything.',
        prompt:
          'What insight about your energy do you want to remember? What will you do to protect and replenish it?',
        skippable: false,
      },
    ],
  },
  {
    id: 'overcoming-negative-self-talk',
    title: 'Overcoming Negative Self-Talk',
    tagline: 'Transform your inner dialogue',
    category: 'Self-Development',
    description:
      'The way you talk to yourself matters more than you think. This path helps you recognize and shift unhelpful inner dialogue.',
    icon: 'MessageCircleOff',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-violet-50',
    borderColor: 'border-indigo-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'self-talk-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We all have an inner voice that narrates our experience. For many of us, this voice is harsh, critical, and discouraging. But this voice isn't telling the truth, it's just a pattern. And patterns can be changed. This path is about developing a kinder inner dialogue.",
        skippable: false,
      },
      {
        id: 'self-talk-prompt-1',
        type: 'prompt',
        title: 'Your Inner Voice',
        content:
          'Getting to know your inner dialogue is the first step.',
        prompt:
          'What does your inner voice typically say to you? Is it critical or supportive? What phrases or messages come up most often? How does it make you feel?',
        skippable: true,
      },
      {
        id: 'self-talk-prompt-2',
        type: 'prompt',
        title: 'Origins of the Voice',
        content:
          'Our inner critic often has external origins.',
        prompt:
          'Where did your negative self-talk come from? Does it sound like anyone from your past? What experiences taught you to speak to yourself this way?',
        skippable: true,
      },
      {
        id: 'self-talk-exercise-1',
        type: 'exercise',
        title: 'Catching the Critic',
        content:
          'Practice noticing negative self-talk in real-time.',
        exerciseInstructions: [
          'Think of a recent moment of self-criticism',
          'Notice the exact words your inner critic used',
          'Observe them without believing them',
          'Ask: Would I say this to a friend?',
          'Notice that thoughts are not facts',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'self-talk-prompt-3',
        type: 'prompt',
        title: 'Reframing',
        content:
          'We can learn to respond to negative self-talk with more balanced perspectives.',
        prompt:
          'Take a typical negative thought you have about yourself. What\'s a more balanced, fair, or compassionate way to look at the same situation?',
        skippable: true,
      },
      {
        id: 'self-talk-prompt-4',
        type: 'prompt',
        title: 'A Kinder Voice',
        content:
          'Developing a supportive inner voice takes practice.',
        prompt:
          'What would you like your inner voice to say instead? If you had an encouraging inner mentor, what would they tell you? How can you practice this kinder voice?',
        skippable: true,
      },
      {
        id: 'self-talk-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are not your thoughts. You are the awareness that can observe and choose what to believe.',
        prompt:
          'What new perspective on your self-talk will you carry forward? What phrase might you use to counter your inner critic?',
        skippable: false,
      },
    ],
  },
  {
    id: 'setting-healthy-priorities',
    title: 'Setting Healthy Priorities',
    tagline: 'Focus on what truly matters',
    category: 'Growth & Purpose',
    description:
      'When everything feels important, nothing is. This path helps you get clear on what truly matters and align your life accordingly.',
    icon: 'ArrowUpCircle',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-indigo-50',
    borderColor: 'border-blue-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'priorities-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We can't do everything, and trying to leads to burnout and dissatisfaction. Setting priorities means deciding what matters most and aligning your time and energy accordingly. It requires saying no to good things so you can say yes to great ones.",
        skippable: false,
      },
      {
        id: 'priorities-prompt-1',
        type: 'prompt',
        title: 'Your Claimed Priorities',
        content:
          'What we say matters and where our time goes often differ.',
        prompt:
          'What do you say your priorities are? What do you claim is most important in your life? Now honestly: where does most of your time and energy actually go?',
        skippable: true,
      },
      {
        id: 'priorities-prompt-2',
        type: 'prompt',
        title: 'The Gap',
        content:
          'Noticing the gap between stated and lived priorities is illuminating.',
        prompt:
          'Is there a gap between your claimed priorities and your actual behavior? What\'s getting more attention than it deserves? What\'s being neglected?',
        skippable: true,
      },
      {
        id: 'priorities-exercise-1',
        type: 'exercise',
        title: 'The Deathbed Test',
        content:
          'Perspective on what truly matters.',
        exerciseInstructions: [
          'Imagine yourself at the end of your life',
          'What will you be glad you prioritized?',
          'What will seem unimportant in retrospect?',
          'What regrets might you have about misplaced priorities?',
          'Let this guide your current choices',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'priorities-prompt-3',
        type: 'prompt',
        title: 'Your True Priorities',
        content:
          'Getting clear on what actually matters most.',
        prompt:
          'If you could only focus on 3-4 things in your life, what would they be? What must you say no to in order to say yes to these? What tradeoffs are you willing to make?',
        skippable: true,
      },
      {
        id: 'priorities-prompt-4',
        type: 'prompt',
        title: 'Protecting Your Priorities',
        content:
          'Priorities only matter if we protect them.',
        prompt:
          'How will you protect your true priorities from the urgent but unimportant? What boundaries, systems, or habits might help you stay focused on what matters most?',
        skippable: true,
      },
      {
        id: 'priorities-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Your priorities are shown by your actions, not your words. Make them match.',
        prompt:
          'What clarity about priorities do you want to carry forward? What one change might better align your life with what matters most?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-contentment',
    title: 'Finding Contentment',
    tagline: 'Discover the peace of enough',
    category: 'Growth & Purpose',
    description:
      'Contentment isn\'t complacency - it\'s appreciating what is while still growing. This path explores how to find peace with where you are.',
    icon: 'SmilePlus',
    gradientFrom: 'from-teal-50',
    gradientTo: 'to-emerald-50',
    borderColor: 'border-teal-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'contentment-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Contentment is often confused with settling or giving up on dreams. But true contentment is appreciating what you have while remaining open to growth. It's finding the peace of 'enough' in a culture that always wants more.",
        skippable: false,
      },
      {
        id: 'contentment-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Contentment',
        content:
          'How content are you with your life as it is?',
        prompt:
          'On a scale from constant dissatisfaction to deep contentment, where are you? What areas of life feel satisfying, and which feel lacking? What drives your discontent?',
        skippable: true,
      },
      {
        id: 'contentment-prompt-2',
        type: 'prompt',
        title: 'The Pursuit of More',
        content:
          'We often believe contentment lies just ahead.',
        prompt:
          'Have you ever achieved something you thought would make you content, only to immediately want more? What does this pattern reveal about the source of contentment?',
        skippable: true,
      },
      {
        id: 'contentment-exercise-1',
        type: 'exercise',
        title: 'Savoring What Is',
        content:
          'Practice appreciating the present moment.',
        exerciseInstructions: [
          'Look around where you are right now',
          'Find 3 things you can appreciate',
          'They can be small - a comfortable chair, sunlight, breath',
          'Really savor each one',
          'Notice the feeling of appreciation',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'contentment-prompt-3',
        type: 'prompt',
        title: 'What\'s Already Enough',
        content:
          'Much of what we need, we already have.',
        prompt:
          'What in your life is already enough? What needs are already met? What would you miss terribly if it were gone? Can you appreciate these things more?',
        skippable: true,
      },
      {
        id: 'contentment-prompt-4',
        type: 'prompt',
        title: 'Contentment and Growth',
        content:
          'Contentment doesn\'t mean giving up on dreams.',
        prompt:
          'How can you be content with where you are while still growing and striving? What would it look like to pursue goals from a place of contentment rather than desperation?',
        skippable: true,
      },
      {
        id: 'contentment-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Contentment is available now, not in some future state. It\'s a practice of appreciation.',
        prompt:
          'What insight about contentment resonates with you? How might you cultivate more contentment in daily life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-authentic-connections',
    title: 'Building Authentic Connections',
    tagline: 'Create deeper, more real relationships',
    category: 'Relationships',
    description:
      'Surface-level relationships leave us lonely. This path explores how to build more genuine, meaningful connections with others.',
    icon: 'Link',
    gradientFrom: 'from-fuchsia-50',
    gradientTo: 'to-pink-50',
    borderColor: 'border-fuchsia-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'connections-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We can be surrounded by people and still feel alone if our connections lack depth and authenticity. Genuine connection requires showing up as ourselves and allowing others to do the same. It's vulnerable and sometimes scary, but it's the foundation of meaningful relationships.",
        skippable: false,
      },
      {
        id: 'connections-prompt-1',
        type: 'prompt',
        title: 'Your Current Connections',
        content:
          'Assessing the quality of your relationships.',
        prompt:
          'How would you describe your closest relationships? Do you feel truly known and understood by anyone? Where do you have depth, and where do things stay surface-level?',
        skippable: true,
      },
      {
        id: 'connections-prompt-2',
        type: 'prompt',
        title: 'Barriers to Authenticity',
        content:
          'What prevents us from being real with others?',
        prompt:
          'What gets in the way of being your true self in relationships? Fear of rejection, habit, not knowing yourself, or something else? What masks do you wear?',
        skippable: true,
      },
      {
        id: 'connections-exercise-1',
        type: 'exercise',
        title: 'Authentic Expression',
        content:
          'Practice identifying what you really want to share.',
        exerciseInstructions: [
          'Think of someone you\'d like to connect more deeply with',
          'What do you wish they knew about you?',
          'What question would you love to ask them?',
          'Imagine having that deeper conversation',
          'Notice what becomes possible',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'connections-prompt-3',
        type: 'prompt',
        title: 'Creating Safety',
        content:
          'Authentic connection requires feeling safe.',
        prompt:
          'What makes you feel safe enough to be authentic with someone? How might you create that safety for others? What would help you feel more comfortable being real?',
        skippable: true,
      },
      {
        id: 'connections-prompt-4',
        type: 'prompt',
        title: 'Deepening One Connection',
        content:
          'Start with one relationship and go deeper.',
        prompt:
          'Choose one relationship you\'d like to deepen. What would it look like to be more authentic with this person? What small step could you take toward more genuine connection?',
        skippable: true,
      },
      {
        id: 'connections-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Authentic connection is a gift we give to ourselves and others. It requires courage, but the reward is being truly seen.',
        prompt:
          'What would you like to remember about building authentic connections? What will you do differently?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-worry',
    title: 'Managing Worry',
    tagline: 'Stop the cycle of anxious thoughts',
    category: 'Emotional Regulation',
    description:
      'Worry pretends to be useful but often just causes suffering. This path helps you understand your worry patterns and find more peace.',
    icon: 'AlertCircle',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'worry-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Worry is the mind's attempt to solve future problems. But most of what we worry about never happens, and worry itself doesn't solve anything - it just makes us suffer in advance. This path explores how to have a healthier relationship with worrying.",
        skippable: false,
      },
      {
        id: 'worry-prompt-1',
        type: 'prompt',
        title: 'Your Worry Patterns',
        content:
          'Understanding what you worry about reveals patterns.',
        prompt:
          'What do you tend to worry about most? Is it health, relationships, work, money, the future? When does worry spike? What triggers your anxious thoughts?',
        skippable: true,
      },
      {
        id: 'worry-prompt-2',
        type: 'prompt',
        title: 'The Illusion of Control',
        content:
          'We often worry as if it gives us control.',
        prompt:
          'What purpose does your worrying serve? Does it feel like preparing or protecting yourself? Does worrying actually help, or does it just feel like it should?',
        skippable: true,
      },
      {
        id: 'worry-exercise-1',
        type: 'exercise',
        title: 'Coming Back to Now',
        content:
          'Worry lives in the future. This brings you back to present.',
        exerciseInstructions: [
          'Notice you are worrying',
          'Ask: "Am I okay right now, in this moment?"',
          'Feel your body in the present',
          'Take a breath',
          'Recognize: the future isn\'t here yet',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'worry-prompt-3',
        type: 'prompt',
        title: 'Worry vs. Problem-Solving',
        content:
          'There\'s a difference between useful concern and useless worry.',
        prompt:
          'Can you tell the difference between productive problem-solving and unproductive worry? When does thinking about a problem help, and when does it just spin?',
        skippable: true,
      },
      {
        id: 'worry-prompt-4',
        type: 'prompt',
        title: 'Strategies for Worry',
        content:
          'We can develop healthier responses to anxious thoughts.',
        prompt:
          'What helps you when you\'re caught in worry? What strategies might you try - scheduled worry time, reality-checking thoughts, or physical activity? What works for you?',
        skippable: true,
      },
      {
        id: 'worry-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Worry steals the present to pay for a future that may never come. You can learn to let it go.',
        prompt:
          'What have you learned about your relationship with worry? What will you try when anxiety rises?',
        skippable: false,
      },
    ],
  },
  {
    id: 'developing-self-awareness',
    title: 'Developing Self-Awareness',
    tagline: 'Know yourself more deeply',
    category: 'Self-Development',
    description:
      'Self-awareness is the foundation of personal growth. This path helps you develop a clearer, more honest understanding of yourself.',
    icon: 'ScanEye',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-violet-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'awareness-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-awareness is the ability to see ourselves clearly - our patterns, motivations, blind spots, and impact on others. It's the foundation of emotional intelligence and personal growth. The more we know ourselves, the more choice we have in how we live.",
        skippable: false,
      },
      {
        id: 'awareness-prompt-1',
        type: 'prompt',
        title: 'How Well Do You Know Yourself?',
        content:
          'Self-awareness varies across different domains.',
        prompt:
          'How self-aware do you consider yourself? In what areas do you have good insight? Where might you have blind spots? How open are you to seeing yourself accurately?',
        skippable: true,
      },
      {
        id: 'awareness-prompt-2',
        type: 'prompt',
        title: 'Your Patterns',
        content:
          'We all have recurring patterns in how we think, feel, and act.',
        prompt:
          'What patterns do you notice in yourself? In how you handle stress, relate to others, or respond to challenges? What do you tend to do over and over?',
        skippable: true,
      },
      {
        id: 'awareness-exercise-1',
        type: 'exercise',
        title: 'The Observer',
        content:
          'Practice observing yourself without judgment.',
        exerciseInstructions: [
          'Close your eyes',
          'Notice your current thoughts without following them',
          'Notice your current emotions without judging them',
          'Notice sensations in your body',
          'Be the observer of your experience',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'awareness-prompt-3',
        type: 'prompt',
        title: 'What Others See',
        content:
          'Others sometimes see things about us that we miss.',
        prompt:
          'What might others see about you that you don\'t see in yourself? If you asked trusted friends for honest feedback, what might they say? Are you open to finding out?',
        skippable: true,
      },
      {
        id: 'awareness-prompt-4',
        type: 'prompt',
        title: 'Growing Self-Awareness',
        content:
          'Self-awareness deepens with intentional practice.',
        prompt:
          'How might you develop greater self-awareness? Through reflection, feedback, therapy, journaling? What practice could you commit to for knowing yourself better?',
        skippable: true,
      },
      {
        id: 'awareness-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Knowing yourself is a lifelong journey. Each insight opens the door to more choice and freedom.',
        prompt:
          'What have you noticed about yourself through this reflection? How will you continue developing self-awareness?',
        skippable: false,
      },
    ],
  },
  {
    id: 'coping-with-comparison',
    title: 'Coping with Comparison',
    tagline: 'Stop measuring against others',
    category: 'Self-Development',
    description:
      'Comparison steals our joy and distorts our self-perception. This path helps you break free from the comparison trap.',
    icon: 'GitCompare',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-sky-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'comparison-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Comparison is natural - our brains are wired to evaluate ourselves relative to others. But in the age of social media, comparison has become toxic for many of us. We compare our insides to others' outsides and always come up short. This path is about finding freedom from the comparison trap.",
        skippable: false,
      },
      {
        id: 'comparison-prompt-1',
        type: 'prompt',
        title: 'Your Comparison Habits',
        content:
          'Awareness of how you compare is the first step.',
        prompt:
          'Who or what do you tend to compare yourself to? Is it appearance, career, relationships, possessions? When does comparison hit hardest? How does it make you feel?',
        skippable: true,
      },
      {
        id: 'comparison-prompt-2',
        type: 'prompt',
        title: 'The Comparison Illusion',
        content:
          'Comparison is based on incomplete information.',
        prompt:
          'When you compare yourself to others, what information are you missing? Do you know their struggles, failures, and insecurities? How might comparison be a distorted picture?',
        skippable: true,
      },
      {
        id: 'comparison-exercise-1',
        type: 'exercise',
        title: 'Returning to Your Lane',
        content:
          'Practice coming back to your own journey.',
        exerciseInstructions: [
          'Notice when comparison thoughts arise',
          'Acknowledge them without fighting: "I\'m comparing"',
          'Gently redirect: "Let me focus on my own path"',
          'Ask: "What matters to ME?"',
          'Feel the relief of staying in your lane',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'comparison-prompt-3',
        type: 'prompt',
        title: 'Your Unique Path',
        content:
          'Your journey is incomparable because it\'s uniquely yours.',
        prompt:
          'What makes your path unique? What experiences, challenges, and gifts do you bring that no one else has? What would it mean to fully embrace your own journey?',
        skippable: true,
      },
      {
        id: 'comparison-prompt-4',
        type: 'prompt',
        title: 'From Comparison to Inspiration',
        content:
          'Others\' success can inspire rather than diminish us.',
        prompt:
          'How might you shift from envious comparison to genuine inspiration? Can someone else\'s achievement motivate you rather than deflate you? What would that shift look like?',
        skippable: true,
      },
      {
        id: 'comparison-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are incomparable - literally. Your only meaningful comparison is with who you were yesterday.',
        prompt:
          'What insight about comparison will you carry forward? How will you stay focused on your own path?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-forgiveness',
    title: 'Finding Forgiveness',
    tagline: 'Release the burden of holding on',
    category: 'Relationships',
    description:
      'Forgiveness is for you, not them. This path explores what forgiveness really means and how to move toward it at your own pace.',
    icon: 'HeartOff',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-red-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'forgiveness-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Forgiveness is one of the most misunderstood concepts. It doesn't mean condoning what happened, forgetting, or reconciling. It means releasing the grip that the hurt has on you. It's a gift you give yourself. This path gently explores the possibility of forgiveness.",
        skippable: false,
      },
      {
        id: 'forgiveness-prompt-1',
        type: 'prompt',
        title: 'What You\'re Holding',
        content:
          'Naming the hurt is part of the process.',
        prompt:
          'Is there someone you\'re struggling to forgive - including yourself? Without going into detail if it\'s painful, what happened, and how has holding onto it affected you?',
        skippable: true,
      },
      {
        id: 'forgiveness-prompt-2',
        type: 'prompt',
        title: 'What Forgiveness Isn\'t',
        content:
          'Clearing up misconceptions about forgiveness.',
        prompt:
          'What does forgiveness mean to you? Do you have any beliefs about forgiveness that might be making it harder - like that it means approving, forgetting, or reconciling?',
        skippable: true,
      },
      {
        id: 'forgiveness-exercise-1',
        type: 'exercise',
        title: 'The Weight of Unforgiveness',
        content:
          'Feel the burden of holding on.',
        exerciseInstructions: [
          'Bring to mind the hurt you\'re carrying',
          'Notice how it feels in your body',
          'Notice the energy it takes to hold onto it',
          'Ask yourself: "Who is this unforgiveness hurting?"',
          'Consider the possibility of letting go',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'forgiveness-prompt-3',
        type: 'prompt',
        title: 'Willingness',
        content:
          'Forgiveness often starts with willingness.',
        prompt:
          'Are you willing to consider forgiveness - not forced, but as a possibility? What would you need to be more willing? Is there any part of you that wants to let go?',
        skippable: true,
      },
      {
        id: 'forgiveness-prompt-4',
        type: 'prompt',
        title: 'Forgiving Yourself',
        content:
          'Sometimes the hardest person to forgive is ourselves.',
        prompt:
          'Is there anything you need to forgive yourself for? What would it mean to extend the same compassion to yourself that you might offer a friend?',
        skippable: true,
      },
      {
        id: 'forgiveness-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Forgiveness is a process, not an event. It happens in its own time, and even the willingness to consider it is a step.',
        prompt:
          'Where are you in your forgiveness journey? What, if anything, has shifted? What support do you need?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-daily-rituals',
    title: 'Building Daily Rituals',
    tagline: 'Create meaningful structure for your days',
    category: 'Wellness',
    description:
      'Rituals bring intention and meaning to ordinary moments. This path helps you design daily practices that support your wellbeing.',
    icon: 'CalendarCheck',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-green-50',
    borderColor: 'border-emerald-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'rituals-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Rituals are different from habits or routines - they're intentional practices that bring meaning and presence to our days. A morning ritual isn't just going through motions; it's setting an intention for how you want to show up. This path explores how to create rituals that support you.",
        skippable: false,
      },
      {
        id: 'rituals-prompt-1',
        type: 'prompt',
        title: 'Your Current Rituals',
        content:
          'You may already have rituals without recognizing them.',
        prompt:
          'What rituals, if any, do you currently have? Morning coffee, evening walks, weekly practices? What makes something feel like a ritual versus just a routine?',
        skippable: true,
      },
      {
        id: 'rituals-prompt-2',
        type: 'prompt',
        title: 'What You Need',
        content:
          'Rituals should serve your actual needs.',
        prompt:
          'What do you need more of in your daily life? Calm, energy, connection, reflection, joy? What times of day feel like they need more intention or structure?',
        skippable: true,
      },
      {
        id: 'rituals-exercise-1',
        type: 'exercise',
        title: 'Designing a Ritual',
        content:
          'Create a simple ritual for yourself.',
        exerciseInstructions: [
          'Choose one transition point in your day (waking, starting work, evening)',
          'Design a 5-10 minute ritual for that time',
          'Include something for body, mind, or spirit',
          'Make it simple enough to do daily',
          'Visualize yourself doing it',
        ],
        exerciseDuration: 120,
        skippable: true,
      },
      {
        id: 'rituals-prompt-3',
        type: 'prompt',
        title: 'Morning Intentions',
        content:
          'How we start the day sets the tone.',
        prompt:
          'What would an ideal morning ritual look like for you? How would you like to start each day? What practices might help you feel centered and intentional?',
        skippable: true,
      },
      {
        id: 'rituals-prompt-4',
        type: 'prompt',
        title: 'Evening Closure',
        content:
          'How we end the day affects sleep and the next morning.',
        prompt:
          'What would an ideal evening ritual look like? How would you like to close each day? What might help you reflect, release, and prepare for rest?',
        skippable: true,
      },
      {
        id: 'rituals-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'Rituals transform ordinary moments into meaningful ones. They\'re how we bring intention to daily life.',
        prompt:
          'What ritual will you commit to trying? How might it support your wellbeing?',
        skippable: false,
      },
    ],
  },
  {
    id: 'embracing-imperfection',
    title: 'Embracing Imperfection',
    tagline: 'Find freedom in being human',
    category: 'Self-Development',
    description:
      'Imperfection isn\'t something to fix - it\'s what makes us human and relatable. This path helps you make peace with your flaws and limitations.',
    icon: 'Puzzle',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'imperfection-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We live in a culture obsessed with perfection and optimization. But perfection is impossible, and the pursuit of it is exhausting. Our imperfections - our quirks, flaws, and limitations - are part of what makes us human and relatable. This path is about making friends with your imperfect self.",
        skippable: false,
      },
      {
        id: 'imperfection-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Imperfection',
        content:
          'How do you relate to your own imperfections?',
        prompt:
          'How do you feel about your flaws and limitations? Do you hide them, fight them, or accept them? What imperfections bother you most? Why?',
        skippable: true,
      },
      {
        id: 'imperfection-prompt-2',
        type: 'prompt',
        title: 'The Cost of Perfection',
        content:
          'Striving for perfection has hidden costs.',
        prompt:
          'What has the pursuit of perfection cost you? In terms of joy, spontaneity, relationships, or self-acceptance? What would be different if you could embrace "good enough"?',
        skippable: true,
      },
      {
        id: 'imperfection-exercise-1',
        type: 'exercise',
        title: 'Loving Your Flaws',
        content:
          'Practice accepting an imperfection.',
        exerciseInstructions: [
          'Think of one imperfection you\'ve been fighting',
          'Instead of wishing it away, acknowledge it',
          'Say: "This is part of me, and that\'s okay"',
          'Consider how it might have served or shaped you',
          'Offer yourself acceptance',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'imperfection-prompt-3',
        type: 'prompt',
        title: 'Imperfection and Connection',
        content:
          'Our imperfections make us relatable.',
        prompt:
          'How might your imperfections help you connect with others? When have your flaws or struggles actually made you more relatable or trustworthy?',
        skippable: true,
      },
      {
        id: 'imperfection-prompt-4',
        type: 'prompt',
        title: 'Living Imperfectly',
        content:
          'What would life look like if you stopped striving for perfection?',
        prompt:
          'If you fully accepted your imperfections, how might your life be different? What would you try? What would you let go of? What would you enjoy more?',
        skippable: true,
      },
      {
        id: 'imperfection-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          'You are imperfect, and you are enough. Your flaws don\'t diminish your worth - they make you real.',
        prompt:
          'What imperfection are you willing to embrace? How might accepting yourself change how you live?',
        skippable: false,
      },
    ],
  },
  {
    id: 'navigating-social-anxiety',
    title: 'Navigating Social Anxiety',
    tagline: 'Find ease in social situations',
    category: 'Emotional Regulation',
    description:
      'Social situations can feel overwhelming. This path helps you understand your social anxiety patterns and find ways to feel more at ease around others.',
    icon: 'Users',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-violet-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'social-anxiety-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Social anxiety is more common than you might think. It's that worried feeling before a party, the dread of small talk, or the fear of being judged. This path is a gentle space to explore your experiences with social situations and discover what helps you feel more comfortable.",
        skippable: false,
      },
      {
        id: 'social-anxiety-prompt-1',
        type: 'prompt',
        title: 'Your Social Landscape',
        content:
          'Social anxiety shows up differently for everyone. Some dread large groups, others struggle with one-on-one conversations.',
        prompt:
          'What types of social situations feel most challenging for you? Describe a recent situation where you felt socially anxious.',
        skippable: true,
      },
      {
        id: 'social-anxiety-prompt-2',
        type: 'prompt',
        title: 'The Inner Critic',
        content:
          'Often, social anxiety is fueled by worries about how others perceive us.',
        prompt:
          'What thoughts typically run through your mind in social situations? What are you most afraid others will think about you?',
        skippable: true,
      },
      {
        id: 'social-anxiety-exercise-1',
        type: 'exercise',
        title: 'Grounding Before Socializing',
        content:
          'This simple grounding technique can help calm your nervous system before or during social situations.',
        exerciseInstructions: [
          'Take three slow, deep breaths',
          'Feel your feet firmly on the ground',
          'Notice five things you can see around you',
          'Remind yourself: "I am safe in this moment"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'social-anxiety-prompt-3',
        type: 'prompt',
        title: 'Moments of Ease',
        content:
          'Even if social situations are difficult, there are likely times when you feel more comfortable.',
        prompt:
          'Think of a time when you felt relatively at ease in a social situation. What was different about that time? Who were you with? What made it easier?',
        skippable: true,
      },
      {
        id: 'social-anxiety-prompt-4',
        type: 'prompt',
        title: 'Small Steps',
        content:
          'Building social confidence often happens through small, manageable steps rather than dramatic leaps.',
        prompt:
          'What is one small social interaction you could practice that feels slightly outside your comfort zone but not overwhelming?',
        skippable: true,
      },
      {
        id: 'social-anxiety-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "You've taken time to explore your relationship with social situations. Be patient with yourself - social ease grows gradually.",
        prompt:
          'What insight about your social anxiety feels most important? What small step might you try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'coping-with-financial-stress',
    title: 'Coping with Financial Stress',
    tagline: 'Find calm amid money worries',
    category: 'Life Transitions',
    description:
      'Financial stress can feel all-consuming. This path helps you process your feelings about money and find clarity amid uncertainty.',
    icon: 'Wallet',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-green-50',
    borderColor: 'border-emerald-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'financial-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Money worries can affect every part of life - sleep, relationships, self-worth, and hope for the future. This isn't about financial advice, but about exploring your emotional relationship with money and finding some peace amid the stress.",
        skippable: false,
      },
      {
        id: 'financial-prompt-1',
        type: 'prompt',
        title: 'The Weight of Worry',
        content:
          'Financial stress often carries emotions beyond just worry about numbers.',
        prompt:
          'How is financial stress affecting you right now? What emotions come up when you think about your financial situation?',
        skippable: true,
      },
      {
        id: 'financial-prompt-2',
        type: 'prompt',
        title: 'Money Messages',
        content:
          'Our beliefs about money often come from childhood and past experiences.',
        prompt:
          'What messages did you receive about money growing up? How might those messages be affecting how you feel now?',
        skippable: true,
      },
      {
        id: 'financial-exercise-1',
        type: 'exercise',
        title: 'Releasing Financial Tension',
        content:
          'Financial stress often manifests physically. Take a moment to release some of that tension.',
        exerciseInstructions: [
          'Notice where you hold financial stress in your body',
          'Take a deep breath and imagine breathing into that area',
          'As you exhale, visualize the tension releasing',
          'Repeat three times',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'financial-prompt-3',
        type: 'prompt',
        title: 'What You Can Control',
        content:
          'While we cannot control everything about our financial situation, there are usually some things within our influence.',
        prompt:
          'What aspects of your financial situation feel within your control? What small actions might help you feel more empowered?',
        skippable: true,
      },
      {
        id: 'financial-prompt-4',
        type: 'prompt',
        title: 'Beyond the Numbers',
        content:
          'Your worth as a person is not determined by your bank account.',
        prompt:
          'What parts of your life bring value that have nothing to do with money? What are you grateful for that cannot be bought?',
        skippable: true,
      },
      {
        id: 'financial-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Financial stress is real and valid. Be gentle with yourself as you navigate this challenge.",
        prompt:
          'What would you like to remember from this reflection? What one thing might help you feel a bit more at peace with your financial situation?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-creative-confidence',
    title: 'Building Creative Confidence',
    tagline: 'Reconnect with your creative self',
    category: 'Self-Development',
    description:
      'Many of us have lost touch with our creativity. This path helps you rediscover your creative spirit and overcome the blocks that hold you back.',
    icon: 'Palette',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-pink-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'creative-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Creativity isn't just for artists - it's a fundamental human capacity. Yet many of us have been told we're 'not creative' or have lost confidence in our creative abilities. This path is about reconnecting with your innate creativity.",
        skippable: false,
      },
      {
        id: 'creative-prompt-1',
        type: 'prompt',
        title: 'Creative History',
        content:
          'Our relationship with creativity often has roots in childhood experiences.',
        prompt:
          'What was your relationship with creativity as a child? What did you love to create? When did that change, if it did?',
        skippable: true,
      },
      {
        id: 'creative-prompt-2',
        type: 'prompt',
        title: 'Creative Blocks',
        content:
          'Various fears and beliefs can block our creative expression.',
        prompt:
          'What holds you back from being creative now? Is it fear of judgment, perfectionism, lack of time, or something else?',
        skippable: true,
      },
      {
        id: 'creative-exercise-1',
        type: 'exercise',
        title: 'Creative Visualization',
        content:
          'Imagine yourself freely creating without any judgment or expectation.',
        exerciseInstructions: [
          'Close your eyes and take a few breaths',
          'Imagine yourself creating something - anything',
          'Notice how it feels to create without judgment',
          'Let yourself enjoy the process, not the outcome',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'creative-prompt-3',
        type: 'prompt',
        title: 'Everyday Creativity',
        content:
          'Creativity shows up in many ways beyond traditional art forms.',
        prompt:
          'Where does creativity already show up in your life? This could be problem-solving, cooking, conversation, or anything else.',
        skippable: true,
      },
      {
        id: 'creative-prompt-4',
        type: 'prompt',
        title: 'Permission to Create',
        content:
          'Sometimes we just need to give ourselves permission to be creative.',
        prompt:
          'If you gave yourself full permission to create without worrying about the result, what would you want to try?',
        skippable: true,
      },
      {
        id: 'creative-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Creativity is your birthright. It doesn't require talent or skill - just willingness to play and explore.",
        prompt:
          'What creative pursuit would you like to explore? How might you make space for more creativity in your life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'cultivating-self-discipline',
    title: 'Cultivating Self-Discipline',
    tagline: 'Build sustainable inner strength',
    category: 'Growth & Purpose',
    description:
      'Self-discipline often feels like a struggle. This path helps you develop a more sustainable, compassionate approach to following through on what matters.',
    icon: 'Target',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-gray-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'discipline-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-discipline isn't about forcing yourself to do things you hate. True discipline comes from connecting with what matters to you and building systems that support your goals. This path explores a kinder approach to discipline.",
        skippable: false,
      },
      {
        id: 'discipline-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Discipline',
        content:
          'How we think about discipline often shapes how successful we are at it.',
        prompt:
          'What comes to mind when you think of self-discipline? What has your history with discipline been like?',
        skippable: true,
      },
      {
        id: 'discipline-prompt-2',
        type: 'prompt',
        title: 'What Matters',
        content:
          'Sustainable discipline is connected to what truly matters to you.',
        prompt:
          'What goals or values do you want self-discipline to serve? Why do these matter to you?',
        skippable: true,
      },
      {
        id: 'discipline-exercise-1',
        type: 'exercise',
        title: 'Connecting to Your Why',
        content:
          'When discipline wavers, reconnecting to your deeper purpose can help.',
        exerciseInstructions: [
          'Think of something you want to be more disciplined about',
          'Ask yourself: "Why does this matter to me?"',
          'Keep asking "why" to go deeper',
          'Notice the feeling when you connect to your core reason',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'discipline-prompt-3',
        type: 'prompt',
        title: 'Obstacles and Patterns',
        content:
          'Understanding what derails your discipline helps you plan for it.',
        prompt:
          'What typically causes you to abandon your disciplined intentions? What patterns do you notice?',
        skippable: true,
      },
      {
        id: 'discipline-prompt-4',
        type: 'prompt',
        title: 'Small and Sustainable',
        content:
          'The most effective discipline often starts smaller than we think.',
        prompt:
          'What is the smallest version of your disciplined practice that you could do even on your worst day? How might starting small help?',
        skippable: true,
      },
      {
        id: 'discipline-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Discipline is a practice, not a personality trait. Every moment is a new opportunity to choose alignment with your values.",
        prompt:
          'What approach to self-discipline would you like to try? How can you be kind to yourself when you falter?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-work-anxiety',
    title: 'Managing Work Anxiety',
    tagline: 'Find peace in your work life',
    category: 'Wellness',
    description:
      'Work can be a significant source of stress and anxiety. This path helps you examine your work-related worries and find strategies for more peace at work.',
    icon: 'Briefcase',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-indigo-50',
    borderColor: 'border-blue-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'work-anxiety-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Work occupies a huge part of our lives, and work-related anxiety can spill over into everything else. Whether it's deadlines, difficult colleagues, job security, or performance pressure, this path offers space to explore your work worries.",
        skippable: false,
      },
      {
        id: 'work-anxiety-prompt-1',
        type: 'prompt',
        title: 'Work Worries',
        content:
          'Work anxiety can come from many sources - some obvious, some hidden.',
        prompt:
          'What aspects of work cause you the most anxiety right now? Try to be specific about what worries you.',
        skippable: true,
      },
      {
        id: 'work-anxiety-prompt-2',
        type: 'prompt',
        title: 'The Underlying Fears',
        content:
          'Beneath work anxiety often lie deeper fears about ourselves and our future.',
        prompt:
          'What are you really afraid will happen? What does work anxiety seem to be protecting you from?',
        skippable: true,
      },
      {
        id: 'work-anxiety-exercise-1',
        type: 'exercise',
        title: 'Workplace Calm',
        content:
          'A brief practice you can use at work when anxiety rises.',
        exerciseInstructions: [
          'Pause and notice you are feeling anxious',
          'Place both feet flat on the floor',
          'Take three slow breaths',
          'Ask: "What is actually within my control right now?"',
        ],
        exerciseDuration: 45,
        skippable: true,
      },
      {
        id: 'work-anxiety-prompt-3',
        type: 'prompt',
        title: 'Boundaries at Work',
        content:
          'Sometimes work anxiety comes from blurry boundaries between work and life.',
        prompt:
          'How are your boundaries between work and personal life? Where might clearer boundaries help reduce your anxiety?',
        skippable: true,
      },
      {
        id: 'work-anxiety-prompt-4',
        type: 'prompt',
        title: 'What Would Help',
        content:
          'While you cannot control everything at work, there are often things that could help.',
        prompt:
          'What changes - in your environment, habits, or mindset - might help reduce your work anxiety? What is one thing you could try?',
        skippable: true,
      },
      {
        id: 'work-anxiety-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Work is important, but it's not everything. You deserve to feel peace in your work life.",
        prompt:
          'What insight about your work anxiety stands out? What would you like to remember or try going forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'strengthening-communication',
    title: 'Strengthening Communication',
    tagline: 'Express yourself more clearly',
    category: 'Relationships',
    description:
      'Good communication is the foundation of healthy relationships. This path helps you reflect on your communication patterns and develop more effective ways of expressing yourself.',
    icon: 'MessageCircle',
    gradientFrom: 'from-cyan-50',
    gradientTo: 'to-teal-50',
    borderColor: 'border-cyan-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'communication-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Communication seems simple - we do it all day - yet meaningful communication can be surprisingly difficult. This path invites you to reflect on how you communicate and what might help you connect more deeply with others.",
        skippable: false,
      },
      {
        id: 'communication-prompt-1',
        type: 'prompt',
        title: 'Communication Patterns',
        content:
          'We all have patterns in how we communicate - some helpful, some less so.',
        prompt:
          'How would you describe your communication style? What are your strengths? What do you struggle with?',
        skippable: true,
      },
      {
        id: 'communication-prompt-2',
        type: 'prompt',
        title: 'What Goes Unsaid',
        content:
          'Often the most important things are the hardest to say.',
        prompt:
          'What do you tend to leave unsaid in your important relationships? What holds you back from expressing these things?',
        skippable: true,
      },
      {
        id: 'communication-exercise-1',
        type: 'exercise',
        title: 'Mindful Listening',
        content:
          'Good communication starts with truly listening to others.',
        exerciseInstructions: [
          'Think of your next conversation',
          'Commit to listening without planning your response',
          'Notice any urge to interrupt or fix',
          'Practice simply being present with the other person',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'communication-prompt-3',
        type: 'prompt',
        title: 'Difficult Conversations',
        content:
          'Some conversations feel particularly challenging to have.',
        prompt:
          'What types of conversations do you avoid or find difficult? What would help you approach them with more confidence?',
        skippable: true,
      },
      {
        id: 'communication-prompt-4',
        type: 'prompt',
        title: 'Expressing Needs',
        content:
          'Being able to clearly express your needs is essential for healthy relationships.',
        prompt:
          'How comfortable are you expressing your needs to others? What need would you like to express more clearly?',
        skippable: true,
      },
      {
        id: 'communication-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Communication is a skill that can always be developed. Small improvements can transform your relationships.",
        prompt:
          'What aspect of your communication would you most like to improve? What is one small step you could take?',
        skippable: false,
      },
    ],
  },
  {
    id: 'recovering-from-failure',
    title: 'Recovering from Failure',
    tagline: 'Transform setbacks into growth',
    category: 'Life Transitions',
    description:
      'Failure is painful but universal. This path helps you process a failure experience and find the lessons and growth opportunities within it.',
    icon: 'RefreshCw',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'failure-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Failure hurts. Whether it's a failed project, relationship, goal, or expectation - the sting is real. But failure is also one of life's greatest teachers. This path is a space to process your failure and begin transforming it into wisdom.",
        skippable: false,
      },
      {
        id: 'failure-prompt-1',
        type: 'prompt',
        title: 'Acknowledging the Failure',
        content:
          'Before we can learn from failure, we need to acknowledge it fully.',
        prompt:
          'What failure are you processing? Describe what happened without minimizing or catastrophizing it.',
        skippable: true,
      },
      {
        id: 'failure-prompt-2',
        type: 'prompt',
        title: 'The Emotional Impact',
        content:
          'Failure carries emotional weight that needs to be honored.',
        prompt:
          'What emotions have come up around this failure? Disappointment, shame, anger, sadness? Let yourself feel them.',
        skippable: true,
      },
      {
        id: 'failure-exercise-1',
        type: 'exercise',
        title: 'Self-Compassion for Failure',
        content:
          'When we fail, we often need self-compassion most - and give it least.',
        exerciseInstructions: [
          'Place your hand over your heart',
          'Say to yourself: "This is a moment of difficulty"',
          'Remind yourself: "Failure is part of being human"',
          'Offer yourself kindness as you would a good friend',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'failure-prompt-3',
        type: 'prompt',
        title: 'Lessons Within',
        content:
          'Every failure contains information that can help us grow.',
        prompt:
          'Looking at this failure with curiosity rather than judgment, what can you learn from it? What might you do differently?',
        skippable: true,
      },
      {
        id: 'failure-prompt-4',
        type: 'prompt',
        title: 'Moving Forward',
        content:
          'Failure does not have to define you or your future.',
        prompt:
          'How would you like to move forward from this failure? What does "recovery" look like for you?',
        skippable: true,
      },
      {
        id: 'failure-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "You have survived failures before and you will survive this one. Each failure is a stepping stone when we choose to learn from it.",
        prompt:
          'What is the most important lesson from this failure? How will you carry this wisdom forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-focus',
    title: 'Finding Focus',
    tagline: 'Cultivate attention and presence',
    category: 'Wellness',
    description:
      'In a world of constant distraction, focus has become rare. This path helps you understand your attention patterns and develop greater capacity for focus.',
    icon: 'Crosshair',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-violet-50',
    borderColor: 'border-indigo-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'focus-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Our attention is constantly pulled in different directions - notifications, worries, tasks, and endless information. This path is about understanding your relationship with focus and finding ways to cultivate deeper attention.",
        skippable: false,
      },
      {
        id: 'focus-prompt-1',
        type: 'prompt',
        title: 'Your Attention Landscape',
        content:
          'Understanding how your attention currently works is the first step.',
        prompt:
          'How would you describe your ability to focus? When is focus easiest? When is it hardest?',
        skippable: true,
      },
      {
        id: 'focus-prompt-2',
        type: 'prompt',
        title: 'Distraction Patterns',
        content:
          'We all have patterns in what distracts us and why.',
        prompt:
          'What are your biggest sources of distraction? What do you notice about when and why you get distracted?',
        skippable: true,
      },
      {
        id: 'focus-exercise-1',
        type: 'exercise',
        title: 'Single Point of Focus',
        content:
          'Practice bringing your attention to a single point.',
        exerciseInstructions: [
          'Choose one thing to focus on - your breath, a sound, or an object',
          'Give it your full attention for 60 seconds',
          'When your mind wanders, gently return',
          'Notice how it feels to focus completely',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'focus-prompt-3',
        type: 'prompt',
        title: 'The Cost of Distraction',
        content:
          'Distraction has real costs to our work, relationships, and wellbeing.',
        prompt:
          'How has lack of focus affected your life? What has distraction cost you?',
        skippable: true,
      },
      {
        id: 'focus-prompt-4',
        type: 'prompt',
        title: 'Creating Conditions for Focus',
        content:
          'Focus often depends on environment and conditions.',
        prompt:
          'What conditions help you focus best? What changes to your environment or habits might support deeper attention?',
        skippable: true,
      },
      {
        id: 'focus-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Focus is a skill that can be trained. With practice and the right conditions, your capacity for attention can grow.",
        prompt:
          'What would better focus make possible in your life? What is one thing you will try to improve your focus?',
        skippable: false,
      },
    ],
  },
  {
    id: 'processing-envy',
    title: 'Processing Envy',
    tagline: 'Transform envy into self-understanding',
    category: 'Emotional Regulation',
    description:
      'Envy is an uncomfortable but informative emotion. This path helps you explore feelings of envy and discover what they reveal about your desires and values.',
    icon: 'Eye',
    gradientFrom: 'from-lime-50',
    gradientTo: 'to-green-50',
    borderColor: 'border-lime-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'envy-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Envy is one of those emotions we rarely talk about, yet almost everyone experiences it. Rather than judging yourself for feeling envious, this path invites you to explore what envy might be telling you about what you want and value.",
        skippable: false,
      },
      {
        id: 'envy-prompt-1',
        type: 'prompt',
        title: 'Acknowledging Envy',
        content:
          'The first step is honestly acknowledging where envy shows up.',
        prompt:
          'Who or what do you feel envious of? Be honest - no one is reading this but you.',
        skippable: true,
      },
      {
        id: 'envy-prompt-2',
        type: 'prompt',
        title: 'What Envy Reveals',
        content:
          'Envy is often a signpost pointing to something we want or value.',
        prompt:
          'Looking at your envy, what does it reveal about what you desire? What unmet need or longing does it point to?',
        skippable: true,
      },
      {
        id: 'envy-exercise-1',
        type: 'exercise',
        title: 'Transforming Envy',
        content:
          'A brief practice for shifting your relationship with envy.',
        exerciseInstructions: [
          'Bring to mind something you feel envious about',
          'Notice where you feel it in your body',
          'Say to yourself: "This shows me what I want"',
          'Consider: "How might I move toward this in my own way?"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'envy-prompt-3',
        type: 'prompt',
        title: 'Your Own Path',
        content:
          'What someone else has achieved is often possible for you too - in your own way, on your own timeline.',
        prompt:
          'What steps could you take toward what you envy in others? What would pursuing this look like for you?',
        skippable: true,
      },
      {
        id: 'envy-prompt-4',
        type: 'prompt',
        title: 'Gratitude Balance',
        content:
          'Envy often makes us forget what we already have.',
        prompt:
          'What do you have in your life that others might envy? What are you grateful for that you sometimes overlook?',
        skippable: true,
      },
      {
        id: 'envy-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Envy, when approached with curiosity, can become a teacher. It shows us what we value and invites us to pursue our own version of fulfillment.",
        prompt:
          'What has envy taught you about yourself? How might you use this insight constructively?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-trust-in-others',
    title: 'Building Trust in Others',
    tagline: 'Learn to trust wisely',
    category: 'Relationships',
    description:
      'Trust can be difficult, especially if you have been hurt before. This path helps you explore your relationship with trust and develop discernment in who to trust.',
    icon: 'Shield',
    gradientFrom: 'from-teal-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-teal-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'trust-others-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Trust is the foundation of meaningful relationships, yet it can feel risky. If you've been hurt, trusting again can feel impossible. This path is about understanding your relationship with trust and learning to trust wisely.",
        skippable: false,
      },
      {
        id: 'trust-others-prompt-1',
        type: 'prompt',
        title: 'Your Trust History',
        content:
          'Our ability to trust is often shaped by past experiences.',
        prompt:
          'How has your ability to trust been shaped by your experiences? What has trust looked like in your life?',
        skippable: true,
      },
      {
        id: 'trust-others-prompt-2',
        type: 'prompt',
        title: 'Trust Wounds',
        content:
          'When trust has been broken, it leaves wounds that affect future relationships.',
        prompt:
          'Have you experienced significant betrayals of trust? How have those experiences affected your ability to trust now?',
        skippable: true,
      },
      {
        id: 'trust-others-exercise-1',
        type: 'exercise',
        title: 'Discerning Trust',
        content:
          'Trust is not all-or-nothing. We can develop discernment about who and how much to trust.',
        exerciseInstructions: [
          'Think of someone you trust deeply',
          'Notice what makes them trustworthy to you',
          'Consider: what behaviors earn your trust?',
          'Reflect on how trust was built over time',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'trust-others-prompt-3',
        type: 'prompt',
        title: 'Small Steps of Trust',
        content:
          'Trust can be built gradually through small steps.',
        prompt:
          'What would small steps of trust look like for you? How might you test trust with someone before going all in?',
        skippable: true,
      },
      {
        id: 'trust-others-prompt-4',
        type: 'prompt',
        title: 'Trusting Yourself',
        content:
          'Sometimes the hardest part is trusting yourself to handle whatever happens.',
        prompt:
          'Do you trust yourself to handle it if trust is broken again? What would help you feel more confident in your resilience?',
        skippable: true,
      },
      {
        id: 'trust-others-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Trust takes courage and wisdom. You can learn to trust again while also protecting yourself through discernment.",
        prompt:
          'What insight about trust feels most important? What small step toward trusting might you try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'embracing-solitude',
    title: 'Embracing Solitude',
    tagline: 'Find richness in being alone',
    category: 'Wellness',
    description:
      'Solitude can be uncomfortable or nourishing - often it depends on how we approach it. This path helps you develop a healthier relationship with being alone.',
    icon: 'Moon',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-zinc-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'solitude-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "There's a difference between loneliness and solitude. Loneliness is painful isolation; solitude is chosen aloneness that can be deeply nourishing. This path explores how to transform time alone into an opportunity for connection with yourself.",
        skippable: false,
      },
      {
        id: 'solitude-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Alone Time',
        content:
          'We all have different comfort levels with being alone.',
        prompt:
          'How do you typically feel when you are alone? Do you seek solitude or avoid it? Why do you think that is?',
        skippable: true,
      },
      {
        id: 'solitude-prompt-2',
        type: 'prompt',
        title: 'What Comes Up',
        content:
          'Being alone often brings up thoughts and feelings we normally avoid.',
        prompt:
          'What tends to come up for you when you are alone with your thoughts? What do you notice yourself trying to escape from?',
        skippable: true,
      },
      {
        id: 'solitude-exercise-1',
        type: 'exercise',
        title: 'Being Present Alone',
        content:
          'Practice simply being present with yourself.',
        exerciseInstructions: [
          'Sit quietly without any distractions',
          'Notice your breath and your body',
          'Observe whatever thoughts arise without judgment',
          'Practice simply being with yourself',
        ],
        exerciseDuration: 120,
        skippable: true,
      },
      {
        id: 'solitude-prompt-3',
        type: 'prompt',
        title: 'Nourishing Solitude',
        content:
          'Solitude can be a time for activities that feed your soul.',
        prompt:
          'What activities or practices make your alone time feel nourishing rather than lonely? What would you like to try?',
        skippable: true,
      },
      {
        id: 'solitude-prompt-4',
        type: 'prompt',
        title: 'Befriending Yourself',
        content:
          'The quality of your solitude depends on the quality of your relationship with yourself.',
        prompt:
          'What would it mean to be a good friend to yourself during alone time? How might you treat yourself more kindly?',
        skippable: true,
      },
      {
        id: 'solitude-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Learning to enjoy your own company is one of life's great gifts. You are never truly alone when you are at home with yourself.",
        prompt:
          'How has your perspective on solitude shifted? What would you like to explore in your alone time?',
        skippable: false,
      },
    ],
  },
  {
    id: 'navigating-career-transitions',
    title: 'Navigating Career Transitions',
    tagline: 'Find clarity in career change',
    category: 'Life Transitions',
    description:
      'Career transitions can be exciting and terrifying. This path helps you process the emotions and uncertainties of changing your professional direction.',
    icon: 'Route',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-red-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'career-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Career transitions - whether chosen or forced - bring up a complex mix of emotions. Hope and fear, excitement and grief, possibility and uncertainty. This path offers space to process where you are and imagine where you might go.",
        skippable: false,
      },
      {
        id: 'career-prompt-1',
        type: 'prompt',
        title: 'Where You Are',
        content:
          'Understanding your current situation is the first step.',
        prompt:
          'Describe your current career situation. What is prompting thoughts of transition? What feels uncertain?',
        skippable: true,
      },
      {
        id: 'career-prompt-2',
        type: 'prompt',
        title: 'What You Leave Behind',
        content:
          'Transitions involve letting go of something, even if it was not perfect.',
        prompt:
          'What would you be leaving behind in a career change? What might you miss? What are you ready to release?',
        skippable: true,
      },
      {
        id: 'career-exercise-1',
        type: 'exercise',
        title: 'Envisioning Possibilities',
        content:
          'Allow yourself to imagine without constraints.',
        exerciseInstructions: [
          'Close your eyes and take a few breaths',
          'Imagine yourself in a fulfilling career',
          'What are you doing? Where are you? How do you feel?',
          'Let the vision be vivid and detailed',
        ],
        exerciseDuration: 120,
        skippable: true,
      },
      {
        id: 'career-prompt-3',
        type: 'prompt',
        title: 'Values and Meaning',
        content:
          'The best career decisions are grounded in your values.',
        prompt:
          'What values do you want your work to reflect? What would make your work feel meaningful?',
        skippable: true,
      },
      {
        id: 'career-prompt-4',
        type: 'prompt',
        title: 'Fear and Courage',
        content:
          'Career transitions often require courage in the face of uncertainty.',
        prompt:
          'What fears come up when you think about changing careers? What would help you move forward despite those fears?',
        skippable: true,
      },
      {
        id: 'career-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Career transitions are rarely linear. Trust that clarity often comes through exploration and action, not just thinking.",
        prompt:
          'What feels most important to consider as you navigate this transition? What is one step you could take?',
        skippable: false,
      },
    ],
  },
  {
    id: 'developing-courage',
    title: 'Developing Courage',
    tagline: 'Act despite your fears',
    category: 'Self-Development',
    description:
      'Courage is not the absence of fear but acting in spite of it. This path helps you understand your relationship with fear and develop greater courage.',
    icon: 'Flame',
    gradientFrom: 'from-red-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-red-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'courage-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Courage is not feeling fearless - it's being afraid and choosing to act anyway. Every courageous person you admire has felt fear. This path helps you develop your own relationship with courage.",
        skippable: false,
      },
      {
        id: 'courage-prompt-1',
        type: 'prompt',
        title: 'Defining Courage',
        content:
          'Courage means different things to different people.',
        prompt:
          'What does courage mean to you? Think of someone you consider courageous - what makes them that way?',
        skippable: true,
      },
      {
        id: 'courage-prompt-2',
        type: 'prompt',
        title: 'Your Courageous Moments',
        content:
          'You have already shown courage in your life, even if you do not recognize it.',
        prompt:
          'When have you acted courageously in the past? What helped you do so? How did it feel?',
        skippable: true,
      },
      {
        id: 'courage-exercise-1',
        type: 'exercise',
        title: 'Feeling Fear and Choosing',
        content:
          'Practice acknowledging fear while choosing your response.',
        exerciseInstructions: [
          'Think of something you want to do but fear holds you back',
          'Notice where fear shows up in your body',
          'Say to yourself: "I can feel afraid and still choose"',
          'Visualize yourself taking the action despite fear',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'courage-prompt-3',
        type: 'prompt',
        title: 'What Courage Calls For',
        content:
          'There may be areas of your life currently calling for courage.',
        prompt:
          'Where in your life is courage being called for right now? What would you do if you were braver?',
        skippable: true,
      },
      {
        id: 'courage-prompt-4',
        type: 'prompt',
        title: 'Building Courage',
        content:
          'Courage, like a muscle, grows stronger with use.',
        prompt:
          'What small courageous act could you practice? How might small acts of courage build toward bigger ones?',
        skippable: true,
      },
      {
        id: 'courage-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Courage is available to you in every moment. It's a choice you can make again and again.",
        prompt:
          'What courageous action would you like to take? What will help you follow through?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-decision-fatigue',
    title: 'Managing Decision Fatigue',
    tagline: 'Simplify your choices',
    category: 'Wellness',
    description:
      'Too many decisions drain our mental energy. This path helps you understand decision fatigue and find strategies for preserving your mental resources.',
    icon: 'GitBranch',
    gradientFrom: 'from-gray-50',
    gradientTo: 'to-neutral-50',
    borderColor: 'border-gray-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'decisions-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Every day we make thousands of decisions, from what to eat to how to respond to emails. Each decision uses mental energy, and when we run low, our decision quality suffers. This path explores how to manage your decision-making energy more wisely.",
        skippable: false,
      },
      {
        id: 'decisions-prompt-1',
        type: 'prompt',
        title: 'Your Decision Load',
        content:
          'Awareness of your decision load is the first step.',
        prompt:
          'What kinds of decisions do you face most frequently? Which ones feel most draining? When do you notice decision fatigue most?',
        skippable: true,
      },
      {
        id: 'decisions-prompt-2',
        type: 'prompt',
        title: 'Decision Patterns',
        content:
          'We often have patterns in how we make decisions - some helpful, some not.',
        prompt:
          'How do you typically make decisions? Do you overthink, decide impulsively, or avoid deciding? What patterns do you notice?',
        skippable: true,
      },
      {
        id: 'decisions-exercise-1',
        type: 'exercise',
        title: 'Decision Reset',
        content:
          'A brief pause can help reset your decision-making capacity.',
        exerciseInstructions: [
          'Step away from the decision momentarily',
          'Take five slow, deep breaths',
          'Ask: "What truly matters here?"',
          'Return with fresh perspective',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'decisions-prompt-3',
        type: 'prompt',
        title: 'Simplifying Decisions',
        content:
          'Many decisions can be simplified, automated, or eliminated.',
        prompt:
          'What recurring decisions could you simplify through routines, defaults, or eliminating options? What decisions do not really need to be made?',
        skippable: true,
      },
      {
        id: 'decisions-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Your mental energy is precious. Protecting it allows you to make better decisions about what truly matters.",
        prompt:
          'What changes could help you reduce decision fatigue? What will you try?',
        skippable: false,
      },
    ],
  },
  {
    id: 'healing-from-betrayal',
    title: 'Healing from Betrayal',
    tagline: 'Process and recover from broken trust',
    category: 'Relationships',
    description:
      'Betrayal wounds deeply. This path offers a space to process the pain of betrayal and begin the journey toward healing.',
    icon: 'HeartCrack',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-pink-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'betrayal-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Betrayal - whether by a partner, friend, family member, or colleague - is one of life's most painful experiences. The violation of trust can shake our sense of reality. This path is a gentle space to begin processing that pain.",
        skippable: false,
      },
      {
        id: 'betrayal-prompt-1',
        type: 'prompt',
        title: 'Acknowledging the Betrayal',
        content:
          'Healing begins with acknowledging what happened.',
        prompt:
          'What betrayal are you processing? Describe what happened and how it affected you.',
        skippable: true,
      },
      {
        id: 'betrayal-prompt-2',
        type: 'prompt',
        title: 'The Layers of Pain',
        content:
          'Betrayal brings many emotions - not just anger, but often grief, shame, and confusion.',
        prompt:
          'What emotions are you experiencing around this betrayal? What is the most painful part?',
        skippable: true,
      },
      {
        id: 'betrayal-exercise-1',
        type: 'exercise',
        title: 'Holding Your Pain',
        content:
          'A moment to acknowledge and hold your pain with compassion.',
        exerciseInstructions: [
          'Place your hand over your heart',
          'Acknowledge: "This betrayal hurt deeply"',
          'Say: "I am allowed to feel this pain"',
          'Breathe kindness toward yourself',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'betrayal-prompt-3',
        type: 'prompt',
        title: 'Impact on Trust',
        content:
          'Betrayal often affects our ability to trust - others and ourselves.',
        prompt:
          'How has this betrayal affected your ability to trust? What do you need to feel safe again?',
        skippable: true,
      },
      {
        id: 'betrayal-prompt-4',
        type: 'prompt',
        title: 'Path to Healing',
        content:
          'Healing from betrayal is a journey, not a destination.',
        prompt:
          'What might healing look like for you? What do you need most right now in your healing process?',
        skippable: true,
      },
      {
        id: 'betrayal-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Healing from betrayal takes time. Be patient with yourself. The pain will not last forever, even if it feels that way now.",
        prompt:
          'What do you need to remember as you heal? What one thing might support your healing?',
        skippable: false,
      },
    ],
  },
  {
    id: 'cultivating-curiosity',
    title: 'Cultivating Curiosity',
    tagline: 'Rediscover wonder in life',
    category: 'Growth & Purpose',
    description:
      'Curiosity keeps life interesting and minds engaged. This path helps you reconnect with your natural curiosity and bring more wonder into daily life.',
    icon: 'Search',
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-yellow-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'curiosity-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Children are naturally curious, asking endless questions about everything. Somewhere along the way, many of us lose that wonder. This path is about rekindling your curiosity and bringing more engagement to life.",
        skippable: false,
      },
      {
        id: 'curiosity-prompt-1',
        type: 'prompt',
        title: 'Childhood Curiosities',
        content:
          'Reconnecting with what fascinated you as a child can reveal lasting interests.',
        prompt:
          'What were you curious about as a child? What questions did you love to explore? What fascinated you?',
        skippable: true,
      },
      {
        id: 'curiosity-prompt-2',
        type: 'prompt',
        title: 'Current Curiosities',
        content:
          'Curiosity may be quieter now, but it is still there.',
        prompt:
          'What are you genuinely curious about now? What topics, questions, or mysteries draw your attention?',
        skippable: true,
      },
      {
        id: 'curiosity-exercise-1',
        type: 'exercise',
        title: 'Curious Observation',
        content:
          'Practice looking at something familiar with fresh, curious eyes.',
        exerciseInstructions: [
          'Look around and choose an ordinary object',
          'Examine it as if seeing it for the first time',
          'Ask questions: How was this made? Why this shape?',
          'Notice details you have never observed before',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'curiosity-prompt-3',
        type: 'prompt',
        title: 'Barriers to Curiosity',
        content:
          'Various things can dampen our natural curiosity.',
        prompt:
          'What gets in the way of your curiosity? Is it busyness, fear of looking foolish, or something else?',
        skippable: true,
      },
      {
        id: 'curiosity-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Curiosity is a choice you can make every day. The world is endlessly fascinating if we choose to look with wonder.",
        prompt:
          'What would you like to explore or learn more about? How might you bring more curiosity into your daily life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'setting-work-life-boundaries',
    title: 'Setting Work-Life Boundaries',
    tagline: 'Protect your personal time',
    category: 'Wellness',
    description:
      'The line between work and life has become increasingly blurred. This path helps you establish healthier boundaries to protect your wellbeing.',
    icon: 'Clock',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-blue-50',
    borderColor: 'border-sky-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'work-life-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Work emails at dinner, tasks on weekends, the feeling that you are always 'on' - these patterns drain us. This path explores how to create boundaries that protect your time and energy outside of work.",
        skippable: false,
      },
      {
        id: 'work-life-prompt-1',
        type: 'prompt',
        title: 'Current Boundaries',
        content:
          'Understanding your current situation helps identify where change is needed.',
        prompt:
          'How are your work-life boundaries right now? Where does work intrude on your personal time? How does this affect you?',
        skippable: true,
      },
      {
        id: 'work-life-prompt-2',
        type: 'prompt',
        title: 'Why Boundaries Blur',
        content:
          'There are often specific reasons boundaries become unclear.',
        prompt:
          'Why do you think your work-life boundaries are where they are? Is it expectations, fear, habit, or something else?',
        skippable: true,
      },
      {
        id: 'work-life-exercise-1',
        type: 'exercise',
        title: 'The Transition Ritual',
        content:
          'Creating a ritual to mark the end of work helps your mind shift gears.',
        exerciseInstructions: [
          'Think of a simple action to end your workday',
          'It could be closing your laptop, changing clothes, or a short walk',
          'Imagine doing this ritual consistently',
          'Notice how it might help you mentally leave work',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'work-life-prompt-3',
        type: 'prompt',
        title: 'Boundaries You Need',
        content:
          'Consider what boundaries would truly support your wellbeing.',
        prompt:
          'What work-life boundaries do you need? Be specific about what you would like to change.',
        skippable: true,
      },
      {
        id: 'work-life-prompt-4',
        type: 'prompt',
        title: 'Communicating Boundaries',
        content:
          'Boundaries often need to be communicated to others.',
        prompt:
          'Who needs to know about your boundaries? How might you communicate them clearly and kindly?',
        skippable: true,
      },
      {
        id: 'work-life-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Boundaries are not selfish - they are essential for sustainable performance and personal wellbeing.",
        prompt:
          'What boundary will you establish or strengthen? What will help you maintain it?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-mental-flexibility',
    title: 'Building Mental Flexibility',
    tagline: 'Adapt to change with ease',
    category: 'Self-Development',
    description:
      'Mental flexibility helps us adapt to change and see situations from multiple perspectives. This path develops your capacity for cognitive flexibility.',
    icon: 'Shuffle',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-fuchsia-50',
    borderColor: 'border-purple-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'flexibility-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Life constantly challenges our expectations and plans. Mental flexibility - the ability to adapt our thinking and see things from different angles - helps us navigate change more gracefully. This path develops this essential skill.",
        skippable: false,
      },
      {
        id: 'flexibility-prompt-1',
        type: 'prompt',
        title: 'Your Current Flexibility',
        content:
          'We all have areas where we are more or less mentally flexible.',
        prompt:
          'How would you rate your mental flexibility? Where do you adapt easily? Where do you get stuck in rigid thinking?',
        skippable: true,
      },
      {
        id: 'flexibility-prompt-2',
        type: 'prompt',
        title: 'When Rigidity Costs',
        content:
          'Rigid thinking often has consequences.',
        prompt:
          'Think of a time when rigid thinking caused problems for you. What happened? What might flexibility have changed?',
        skippable: true,
      },
      {
        id: 'flexibility-exercise-1',
        type: 'exercise',
        title: 'Perspective Shifting',
        content:
          'Practice seeing a situation from multiple viewpoints.',
        exerciseInstructions: [
          'Think of a current challenge or disagreement',
          'See it from your perspective',
          'Now imagine you are the other person - see their view',
          'Finally, imagine a neutral observer - what do they see?',
        ],
        exerciseDuration: 120,
        skippable: true,
      },
      {
        id: 'flexibility-prompt-3',
        type: 'prompt',
        title: 'Beliefs Worth Questioning',
        content:
          'Sometimes our rigid thinking is tied to beliefs we have not examined.',
        prompt:
          'What beliefs or assumptions might be limiting your flexibility? Which ones might be worth questioning?',
        skippable: true,
      },
      {
        id: 'flexibility-prompt-4',
        type: 'prompt',
        title: 'Practicing Flexibility',
        content:
          'Mental flexibility grows with practice.',
        prompt:
          'How might you practice mental flexibility in your daily life? What situations could be opportunities to try different perspectives?',
        skippable: true,
      },
      {
        id: 'flexibility-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "A flexible mind is a resilient mind. The ability to adapt your thinking is a superpower in an ever-changing world.",
        prompt:
          'What insight about mental flexibility stands out? How will you practice greater flexibility?',
        skippable: false,
      },
    ],
  },
  {
    id: 'coping-with-seasonal-changes',
    title: 'Coping with Seasonal Changes',
    tagline: 'Navigate seasonal mood shifts',
    category: 'Wellness',
    description:
      'Many people experience mood changes with the seasons. This path helps you understand and manage the emotional impact of seasonal transitions.',
    icon: 'CloudSun',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-blue-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'seasonal-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Seasons affect us more than we often realize. Changes in light, temperature, and nature can influence our mood, energy, and outlook. This path explores your relationship with seasonal changes and how to navigate them.",
        skippable: false,
      },
      {
        id: 'seasonal-prompt-1',
        type: 'prompt',
        title: 'Seasonal Patterns',
        content:
          'Notice how different seasons affect you.',
        prompt:
          'How do different seasons affect your mood and energy? Which season is most challenging for you? Which feels best?',
        skippable: true,
      },
      {
        id: 'seasonal-prompt-2',
        type: 'prompt',
        title: 'Seasonal Challenges',
        content:
          'Each season brings its own challenges.',
        prompt:
          'What specific challenges do you face during difficult seasons? How do these affect your daily life?',
        skippable: true,
      },
      {
        id: 'seasonal-exercise-1',
        type: 'exercise',
        title: 'Seasonal Appreciation',
        content:
          'Find something to appreciate in the current season.',
        exerciseInstructions: [
          'Think about the current season',
          'Find three things unique to this season you can appreciate',
          'Notice any resistance and breathe through it',
          'Allow gratitude for this moment in time',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'seasonal-prompt-3',
        type: 'prompt',
        title: 'Seasonal Self-Care',
        content:
          'Different seasons may call for different self-care practices.',
        prompt:
          'What self-care practices help you during challenging seasons? What might you add to your seasonal toolkit?',
        skippable: true,
      },
      {
        id: 'seasonal-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Seasons change, and so can our approach to them. With awareness and intentional care, you can find beauty and growth in every season.",
        prompt:
          'How will you care for yourself through seasonal changes? What will you remember?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-support-network',
    title: 'Building a Support Network',
    tagline: 'Cultivate meaningful connections',
    category: 'Relationships',
    description:
      'We all need people we can rely on. This path helps you assess and strengthen your support network for better wellbeing.',
    icon: 'Network',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-emerald-50',
    borderColor: 'border-green-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'support-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Having people who support us - through good times and bad - is essential for wellbeing. Yet building and maintaining a support network takes intention. This path helps you think about who supports you and how to strengthen those connections.",
        skippable: false,
      },
      {
        id: 'support-prompt-1',
        type: 'prompt',
        title: 'Your Current Network',
        content:
          'Take stock of who currently supports you.',
        prompt:
          'Who are the people you can turn to for support? This might include family, friends, colleagues, or others. List them and what each provides.',
        skippable: true,
      },
      {
        id: 'support-prompt-2',
        type: 'prompt',
        title: 'Support Gaps',
        content:
          'Sometimes we lack certain types of support.',
        prompt:
          'What types of support do you feel you lack? Is it emotional support, practical help, professional guidance, or something else?',
        skippable: true,
      },
      {
        id: 'support-exercise-1',
        type: 'exercise',
        title: 'Gratitude for Support',
        content:
          'Appreciate those who support you.',
        exerciseInstructions: [
          'Think of someone who has supported you',
          'Recall a specific time they were there for you',
          'Feel gratitude for their presence in your life',
          'Consider how you might express appreciation',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'support-prompt-3',
        type: 'prompt',
        title: 'Strengthening Connections',
        content:
          'Relationships require nurturing to stay strong.',
        prompt:
          'Which supportive relationships would you like to strengthen? What might help deepen these connections?',
        skippable: true,
      },
      {
        id: 'support-prompt-4',
        type: 'prompt',
        title: 'Expanding Your Network',
        content:
          'Sometimes we need to build new connections.',
        prompt:
          'Where might you find new sources of support? What communities or groups align with your interests and needs?',
        skippable: true,
      },
      {
        id: 'support-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "A strong support network is built one relationship at a time. Investing in connections pays dividends in wellbeing.",
        prompt:
          'What action will you take to strengthen or expand your support network?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-meaning-in-daily-life',
    title: 'Finding Meaning in Daily Life',
    tagline: 'Discover purpose in the ordinary',
    category: 'Growth & Purpose',
    description:
      'Meaning does not only come from big achievements. This path helps you find purpose and significance in everyday moments.',
    icon: 'Sparkles',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'daily-meaning-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We often look for meaning in grand achievements or future goals, while overlooking the significance available in ordinary moments. This path is about finding depth and purpose in daily life.",
        skippable: false,
      },
      {
        id: 'daily-meaning-prompt-1',
        type: 'prompt',
        title: 'What Feels Meaningful',
        content:
          'Meaning is personal - what matters to one person may not matter to another.',
        prompt:
          'What activities or moments in your life feel most meaningful to you? When do you feel most purposeful?',
        skippable: true,
      },
      {
        id: 'daily-meaning-prompt-2',
        type: 'prompt',
        title: 'Overlooked Moments',
        content:
          'Meaning often hides in plain sight.',
        prompt:
          'What ordinary moments might hold more meaning than you usually notice? A morning routine, a conversation, a simple task?',
        skippable: true,
      },
      {
        id: 'daily-meaning-exercise-1',
        type: 'exercise',
        title: 'Mindful Meaning',
        content:
          'Practice finding meaning in a simple moment.',
        exerciseInstructions: [
          'Think of a simple daily activity',
          'Consider why you do it and who it serves',
          'Notice how it connects to your values',
          'Find the meaning within the mundane',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'daily-meaning-prompt-3',
        type: 'prompt',
        title: 'Creating Meaning',
        content:
          'Meaning can be created through intention.',
        prompt:
          'How might you bring more intention and meaning to your daily activities? What would change if you approached ordinary tasks as meaningful?',
        skippable: true,
      },
      {
        id: 'daily-meaning-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Meaning is not found only in the exceptional - it is woven through the fabric of ordinary days when we choose to see it.",
        prompt:
          'What ordinary moment will you approach with more appreciation? How will you cultivate daily meaning?',
        skippable: false,
      },
    ],
  },
  {
    id: 'processing-nostalgia',
    title: 'Processing Nostalgia',
    tagline: 'Make peace with the past',
    category: 'Emotional Regulation',
    description:
      'Nostalgia can be bittersweet - comforting yet painful. This path helps you explore nostalgic feelings and find a healthy relationship with the past.',
    icon: 'History',
    gradientFrom: 'from-sepia-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'nostalgia-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Nostalgia pulls us back to times that felt simpler, happier, or more connected. While it can provide comfort, it can also keep us stuck in the past. This path explores your relationship with nostalgia.",
        skippable: false,
      },
      {
        id: 'nostalgia-prompt-1',
        type: 'prompt',
        title: 'What You Miss',
        content:
          'Nostalgia often centers on specific times, places, or relationships.',
        prompt:
          'What do you feel most nostalgic about? What time, place, or period do you find yourself longing for?',
        skippable: true,
      },
      {
        id: 'nostalgia-prompt-2',
        type: 'prompt',
        title: 'The Longing Beneath',
        content:
          'Nostalgia often points to something we need now.',
        prompt:
          'What might your nostalgia be telling you? What need or feeling from the past do you wish you had more of now?',
        skippable: true,
      },
      {
        id: 'nostalgia-exercise-1',
        type: 'exercise',
        title: 'Honoring the Past',
        content:
          'A moment to honor what you miss while being present.',
        exerciseInstructions: [
          'Recall a nostalgic memory',
          'Let yourself fully feel the warmth of it',
          'Thank that time for what it gave you',
          'Gently return to the present moment',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'nostalgia-prompt-3',
        type: 'prompt',
        title: 'Present Possibilities',
        content:
          'The good of the past can sometimes be recreated in new forms.',
        prompt:
          'What elements of what you miss could you bring into your present life in some form? What is possible now?',
        skippable: true,
      },
      {
        id: 'nostalgia-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "The past gave you gifts that live on in who you are. Honor it, learn from it, but remember that today holds its own treasures.",
        prompt:
          'What will you take from reflecting on your nostalgia? How will you balance honoring the past with embracing the present?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-independence',
    title: 'Building Independence',
    tagline: 'Strengthen your self-reliance',
    category: 'Self-Development',
    description:
      'Independence is about trusting yourself and your ability to handle life. This path helps you develop greater self-reliance while staying connected to others.',
    icon: 'User',
    gradientFrom: 'from-stone-50',
    gradientTo: 'to-neutral-50',
    borderColor: 'border-stone-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'independence-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Healthy independence means trusting yourself to handle life while still valuing connection with others. It's not about doing everything alone, but about knowing you can. This path explores building that inner strength.",
        skippable: false,
      },
      {
        id: 'independence-prompt-1',
        type: 'prompt',
        title: 'Your Current Independence',
        content:
          'Assess where you are on the independence spectrum.',
        prompt:
          'In what areas of life do you feel independent and capable? Where do you feel overly dependent on others?',
        skippable: true,
      },
      {
        id: 'independence-prompt-2',
        type: 'prompt',
        title: 'Origins of Dependence',
        content:
          'Our patterns of dependence often have roots.',
        prompt:
          'Where might your patterns of dependence come from? What experiences or beliefs might be shaping them?',
        skippable: true,
      },
      {
        id: 'independence-exercise-1',
        type: 'exercise',
        title: 'Self-Reliance Affirmation',
        content:
          'Build confidence in your ability to handle things.',
        exerciseInstructions: [
          'Think of something you handled well on your own',
          'Remember the feeling of capability',
          'Say: "I can trust myself to figure things out"',
          'Feel that confidence in your body',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'independence-prompt-3',
        type: 'prompt',
        title: 'Growing Independence',
        content:
          'Independence grows through practice.',
        prompt:
          'What specific skill or area would you like to become more independent in? What small steps could you take?',
        skippable: true,
      },
      {
        id: 'independence-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "True independence is not isolation - it is knowing you can stand on your own while choosing to connect with others.",
        prompt:
          'What would greater independence make possible for you? What is one step toward building it?',
        skippable: false,
      },
    ],
  },
  {
    id: 'navigating-family-dynamics',
    title: 'Navigating Family Dynamics',
    tagline: 'Find peace in family relationships',
    category: 'Relationships',
    description:
      'Family relationships are complex and often challenging. This path helps you understand and navigate the dynamics within your family.',
    icon: 'Home',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-pink-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'family-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Family relationships shape us deeply and can be our greatest source of both joy and pain. This path offers space to explore your family dynamics and find ways to navigate them with more ease.",
        skippable: false,
      },
      {
        id: 'family-prompt-1',
        type: 'prompt',
        title: 'Your Family Landscape',
        content:
          'Every family has its own patterns and dynamics.',
        prompt:
          'Describe your family dynamics. What patterns do you notice in how your family interacts? What roles do people play?',
        skippable: true,
      },
      {
        id: 'family-prompt-2',
        type: 'prompt',
        title: 'Challenging Relationships',
        content:
          'Some family relationships are more difficult than others.',
        prompt:
          'Which family relationships feel most challenging? What makes them difficult? How do these relationships affect you?',
        skippable: true,
      },
      {
        id: 'family-exercise-1',
        type: 'exercise',
        title: 'Compassion for Family',
        content:
          'Practice seeing family members with compassion.',
        exerciseInstructions: [
          'Think of a challenging family member',
          'Consider what struggles they might carry',
          'Imagine them as a child, wanting to be loved',
          'Notice if any compassion arises naturally',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'family-prompt-3',
        type: 'prompt',
        title: 'Your Role',
        content:
          'We all play roles within our families.',
        prompt:
          'What role do you typically play in your family? How does this role serve you? How might it limit you?',
        skippable: true,
      },
      {
        id: 'family-prompt-4',
        type: 'prompt',
        title: 'Boundaries and Connection',
        content:
          'Finding the right balance between closeness and boundaries.',
        prompt:
          'What boundaries might help your family relationships? How can you stay connected while protecting your wellbeing?',
        skippable: true,
      },
      {
        id: 'family-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Family is complicated. You can love your family while also setting boundaries. You can accept them while also being your own person.",
        prompt:
          'What insight about your family dynamics feels most valuable? What might you do differently?',
        skippable: false,
      },
    ],
  },
  {
    id: 'developing-assertiveness',
    title: 'Developing Assertiveness',
    tagline: 'Express yourself clearly and kindly',
    category: 'Self-Development',
    description:
      'Assertiveness is the middle ground between passive and aggressive. This path helps you communicate your needs clearly while respecting others.',
    icon: 'Megaphone',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'assertive-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Assertiveness is about expressing your needs, opinions, and boundaries clearly and respectfully. It's not about being aggressive or demanding - it's about honest, direct communication that honors both you and others.",
        skippable: false,
      },
      {
        id: 'assertive-prompt-1',
        type: 'prompt',
        title: 'Your Communication Style',
        content:
          'Understanding your current patterns helps identify growth areas.',
        prompt:
          'How would you describe your communication style? Do you tend to be passive, aggressive, or assertive? When does this vary?',
        skippable: true,
      },
      {
        id: 'assertive-prompt-2',
        type: 'prompt',
        title: 'What Holds You Back',
        content:
          'There are often reasons we struggle with assertiveness.',
        prompt:
          'What makes assertiveness difficult for you? Is it fear of conflict, worry about being disliked, past experiences, or something else?',
        skippable: true,
      },
      {
        id: 'assertive-exercise-1',
        type: 'exercise',
        title: 'Practicing Assertive Language',
        content:
          'Practice expressing yourself assertively.',
        exerciseInstructions: [
          'Think of something you need to express',
          'Frame it as "I feel... when... because..."',
          'Add what you need: "I would like..."',
          'Practice saying it clearly and calmly',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'assertive-prompt-3',
        type: 'prompt',
        title: 'Situations Needing Assertiveness',
        content:
          'Identify where assertiveness would help you.',
        prompt:
          'What situations in your life currently call for more assertiveness? What would you like to express or request?',
        skippable: true,
      },
      {
        id: 'assertive-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Assertiveness is a skill that improves with practice. You have the right to express your needs while respecting others.",
        prompt:
          'What assertive conversation or expression will you practice? What will help you follow through?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-life-transitions',
    title: 'Managing Life Transitions',
    tagline: 'Navigate change with grace',
    category: 'Life Transitions',
    description:
      'Life transitions - moving, new jobs, relationships ending - can be disorienting. This path helps you process and navigate any major life change.',
    icon: 'ArrowRightLeft',
    gradientFrom: 'from-indigo-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-indigo-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'transitions-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Life transitions can feel exciting and terrifying, full of possibility and loss. Whether you chose this change or it was thrust upon you, this path offers space to process where you are and envision where you are going.",
        skippable: false,
      },
      {
        id: 'transitions-prompt-1',
        type: 'prompt',
        title: 'The Transition You Face',
        content:
          'Name and acknowledge the transition you are in.',
        prompt:
          'What life transition are you currently navigating? Describe where you were, what is changing, and where you might be heading.',
        skippable: true,
      },
      {
        id: 'transitions-prompt-2',
        type: 'prompt',
        title: 'The Emotional Landscape',
        content:
          'Transitions bring complex emotions.',
        prompt:
          'What emotions are you experiencing during this transition? Allow yourself to name the full range - excitement, fear, grief, hope.',
        skippable: true,
      },
      {
        id: 'transitions-exercise-1',
        type: 'exercise',
        title: 'Grounding in Transition',
        content:
          'Find stability amid change.',
        exerciseInstructions: [
          'Notice what remains constant in your life',
          'Feel your feet on the ground, your breath steady',
          'Remind yourself: "I am still me, even as things change"',
          'Find one thing you can count on today',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'transitions-prompt-3',
        type: 'prompt',
        title: 'What You Carry Forward',
        content:
          'You bring wisdom and strengths into new chapters.',
        prompt:
          'What strengths, lessons, and values are you carrying forward from your past into this new chapter?',
        skippable: true,
      },
      {
        id: 'transitions-prompt-4',
        type: 'prompt',
        title: 'Support Through Change',
        content:
          'Transitions are easier with support.',
        prompt:
          'What support do you have during this transition? What additional support might help? Who or what can you lean on?',
        skippable: true,
      },
      {
        id: 'transitions-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Transitions are bridges between chapters of your life. Trust that you have what it takes to cross to the other side.",
        prompt:
          'What do you want to remember as you navigate this transition? What will help you move through it with grace?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-positive-mindset',
    title: 'Building a Positive Mindset',
    tagline: 'Cultivate constructive thinking',
    category: 'Growth & Purpose',
    description:
      'A positive mindset is not about ignoring difficulties but about approaching life constructively. This path helps you develop more helpful thought patterns.',
    icon: 'Sun',
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-yellow-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'positive-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "A positive mindset does not mean pretending everything is fine. It means choosing to focus on what you can control, finding the good alongside the difficult, and approaching challenges with hope rather than despair.",
        skippable: false,
      },
      {
        id: 'positive-prompt-1',
        type: 'prompt',
        title: 'Your Current Mindset',
        content:
          'Notice your typical thought patterns.',
        prompt:
          'How would you describe your usual mindset? Do you tend toward optimism or pessimism? What thought patterns are most common for you?',
        skippable: true,
      },
      {
        id: 'positive-prompt-2',
        type: 'prompt',
        title: 'Negative Patterns',
        content:
          'Identifying unhelpful patterns is the first step to changing them.',
        prompt:
          'What negative thought patterns do you fall into most often? Catastrophizing, assuming the worst, self-criticism? How do these affect you?',
        skippable: true,
      },
      {
        id: 'positive-exercise-1',
        type: 'exercise',
        title: 'Reframing Practice',
        content:
          'Practice finding alternative perspectives.',
        exerciseInstructions: [
          'Think of a current challenge or negative thought',
          'Ask: "Is there another way to see this?"',
          'Find one thing you can learn or one silver lining',
          'Notice how the reframe feels different',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'positive-prompt-3',
        type: 'prompt',
        title: 'Sources of Positivity',
        content:
          'Certain things naturally boost our outlook.',
        prompt:
          'What people, activities, or practices tend to improve your mindset? How might you incorporate more of these?',
        skippable: true,
      },
      {
        id: 'positive-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Your mindset is a choice you make moment by moment. Choose thoughts that serve you.",
        prompt:
          'What shift in mindset would most benefit you? What practice will you try to cultivate more positive thinking?',
        skippable: false,
      },
    ],
  },
  {
    id: 'coping-with-health-challenges',
    title: 'Coping with Health Challenges',
    tagline: 'Find strength in health struggles',
    category: 'Wellness',
    description:
      'Health challenges affect not just the body but the mind and spirit. This path helps you process the emotional impact of health difficulties.',
    icon: 'Heart',
    gradientFrom: 'from-red-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-red-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'health-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Dealing with health challenges - your own or a loved one's - is one of life's hardest experiences. Beyond physical symptoms, there is emotional weight. This path is a space to process those feelings.",
        skippable: false,
      },
      {
        id: 'health-prompt-1',
        type: 'prompt',
        title: 'Your Health Challenge',
        content:
          'Acknowledge what you are facing.',
        prompt:
          'What health challenge are you dealing with? How has it affected your daily life? Share as much or as little as feels right.',
        skippable: true,
      },
      {
        id: 'health-prompt-2',
        type: 'prompt',
        title: 'Emotional Impact',
        content:
          'Health challenges bring complex emotions.',
        prompt:
          'What emotions have you been experiencing around your health situation? Fear, anger, grief, frustration? Let yourself name them.',
        skippable: true,
      },
      {
        id: 'health-exercise-1',
        type: 'exercise',
        title: 'Compassion for Your Body',
        content:
          'Offer kindness to your body, whatever state it is in.',
        exerciseInstructions: [
          'Place a hand somewhere on your body',
          'Thank your body for carrying you through life',
          'Send compassion to any areas of pain or illness',
          'Whisper: "I am here with you"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'health-prompt-3',
        type: 'prompt',
        title: 'What Helps',
        content:
          'Even in difficulty, there are sources of support and relief.',
        prompt:
          'What helps you cope with your health challenge? What brings moments of relief or hope? What support do you have?',
        skippable: true,
      },
      {
        id: 'health-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Health challenges test us in profound ways. You are more than your health status. Your worth remains unchanged.",
        prompt:
          'What do you need most right now in your health journey? What would you like to remember?',
        skippable: false,
      },
    ],
  },
  {
    id: 'learning-to-say-no',
    title: 'Learning to Say No',
    tagline: 'Protect your time and energy',
    category: 'Relationships',
    description:
      'Saying no is essential for self-care yet can feel incredibly difficult. This path helps you understand and overcome your barriers to saying no.',
    icon: 'Ban',
    gradientFrom: 'from-slate-50',
    gradientTo: 'to-gray-50',
    borderColor: 'border-slate-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'saying-no-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Every yes to something is a no to something else. When we cannot say no, we end up overcommitted, resentful, and exhausted. This path explores what makes saying no so hard and how to do it more freely.",
        skippable: false,
      },
      {
        id: 'saying-no-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with No',
        content:
          'Explore how you currently handle saying no.',
        prompt:
          'How easy or difficult is it for you to say no? What typically happens when you try to decline something?',
        skippable: true,
      },
      {
        id: 'saying-no-prompt-2',
        type: 'prompt',
        title: 'Why No Feels Hard',
        content:
          'There are usually specific fears or beliefs behind difficulty saying no.',
        prompt:
          'What makes saying no hard for you? Is it fear of disappointing others, being disliked, missing out, or something else?',
        skippable: true,
      },
      {
        id: 'saying-no-exercise-1',
        type: 'exercise',
        title: 'Practicing No',
        content:
          'Practice saying no in a low-stakes way.',
        exerciseInstructions: [
          'Think of a recent request you wish you had declined',
          'Imagine saying no kindly but clearly',
          'Practice the words: "Thank you, but I cannot"',
          'Notice how it feels to honor your limits',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'saying-no-prompt-3',
        type: 'prompt',
        title: 'The Cost of Yes',
        content:
          'Every unnecessary yes has a cost.',
        prompt:
          'What has saying yes when you meant no cost you? Time, energy, resentment, missed opportunities?',
        skippable: true,
      },
      {
        id: 'saying-no-prompt-4',
        type: 'prompt',
        title: 'Where You Need No',
        content:
          'Identify current opportunities to practice.',
        prompt:
          'Where in your life right now do you need to say no? What request or commitment needs to be declined or released?',
        skippable: true,
      },
      {
        id: 'saying-no-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "No is a complete sentence. Saying no to what drains you creates space to say yes to what matters.",
        prompt:
          'What no do you need to say? How will you honor your limits going forward?',
        skippable: false,
      },
    ],
  },
  {
    id: 'finding-inner-strength',
    title: 'Finding Inner Strength',
    tagline: 'Discover your resilient core',
    category: 'Self-Development',
    description:
      'Within you is a well of strength you may not realize you have. This path helps you connect with your inner resources and resilience.',
    icon: 'Mountain',
    gradientFrom: 'from-stone-50',
    gradientTo: 'to-slate-50',
    borderColor: 'border-stone-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'inner-strength-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "You have survived every difficult day you have ever faced. That is evidence of strength. This path helps you recognize, connect with, and draw upon the inner strength you already possess.",
        skippable: false,
      },
      {
        id: 'inner-strength-prompt-1',
        type: 'prompt',
        title: 'Evidence of Strength',
        content:
          'Your history contains proof of your resilience.',
        prompt:
          'What difficult situations have you survived or overcome? What does getting through those things say about your strength?',
        skippable: true,
      },
      {
        id: 'inner-strength-prompt-2',
        type: 'prompt',
        title: 'Sources of Strength',
        content:
          'Strength comes from many places.',
        prompt:
          'Where does your strength come from? Is it your values, your loved ones, your faith, your stubbornness? Name your sources.',
        skippable: true,
      },
      {
        id: 'inner-strength-exercise-1',
        type: 'exercise',
        title: 'Connecting to Your Core',
        content:
          'Feel into your inner strength.',
        exerciseInstructions: [
          'Sit tall and feel your spine support you',
          'Recall a moment you felt strong',
          'Notice where that strength lives in your body',
          'Breathe and let that feeling expand',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'inner-strength-prompt-3',
        type: 'prompt',
        title: 'Strength for Today',
        content:
          'Apply your strength to current challenges.',
        prompt:
          'What current situation calls for your inner strength? How might you bring your resilient core to this challenge?',
        skippable: true,
      },
      {
        id: 'inner-strength-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Your strength is not something you need to find - it is already within you, waiting to be recognized.",
        prompt:
          'What do you now recognize about your inner strength? How will you draw on it when needed?',
        skippable: false,
      },
    ],
  },
  {
    id: 'managing-emotional-eating',
    title: 'Managing Emotional Eating',
    tagline: 'Understand your relationship with food',
    category: 'Wellness',
    description:
      'Food and emotions are deeply connected. This path explores emotional eating patterns and helps you develop a healthier relationship with food.',
    icon: 'Apple',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-lime-50',
    borderColor: 'border-green-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'emotional-eating-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Using food to cope with emotions is common and understandable - food provides comfort. But when eating becomes our primary way of managing feelings, it can cause problems. This path explores your relationship with emotional eating.",
        skippable: false,
      },
      {
        id: 'emotional-eating-prompt-1',
        type: 'prompt',
        title: 'Your Patterns',
        content:
          'Awareness of patterns is the first step.',
        prompt:
          'When do you tend to eat emotionally? What emotions or situations trigger it? What foods do you reach for?',
        skippable: true,
      },
      {
        id: 'emotional-eating-prompt-2',
        type: 'prompt',
        title: 'What Food Provides',
        content:
          'Emotional eating serves a purpose, even if not ideal.',
        prompt:
          'What does food give you emotionally? Comfort, distraction, pleasure, numbing? What need is it trying to meet?',
        skippable: true,
      },
      {
        id: 'emotional-eating-exercise-1',
        type: 'exercise',
        title: 'Pause Before Eating',
        content:
          'Practice pausing to check in before eating.',
        exerciseInstructions: [
          'Before eating, pause and take a breath',
          'Ask: "Am I physically hungry?"',
          'If not, ask: "What am I actually feeling?"',
          'Consider: "What do I really need right now?"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'emotional-eating-prompt-3',
        type: 'prompt',
        title: 'Alternative Coping',
        content:
          'Building other ways to cope reduces reliance on food.',
        prompt:
          'What other ways could you cope with difficult emotions? What activities, practices, or supports might help?',
        skippable: true,
      },
      {
        id: 'emotional-eating-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Be gentle with yourself as you explore this. Changing emotional eating patterns takes time and self-compassion.",
        prompt:
          'What insight about your emotional eating feels important? What would you like to try differently?',
        skippable: false,
      },
    ],
  },
  {
    id: 'building-self-acceptance',
    title: 'Building Self-Acceptance',
    tagline: 'Embrace who you truly are',
    category: 'Self-Development',
    description:
      'Self-acceptance is the foundation of wellbeing. This path helps you move toward accepting yourself as you are, imperfections and all.',
    icon: 'HeartHandshake',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-pink-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'self-acceptance-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-acceptance does not mean giving up on growth. It means starting from a place of 'I am okay as I am' rather than 'I will be okay when I change.' This path explores what it means to truly accept yourself.",
        skippable: false,
      },
      {
        id: 'self-acceptance-prompt-1',
        type: 'prompt',
        title: 'Where Acceptance Is Hard',
        content:
          'We all have parts of ourselves we struggle to accept.',
        prompt:
          'What aspects of yourself do you find hardest to accept? Your appearance, personality, past, abilities? Name what you resist.',
        skippable: true,
      },
      {
        id: 'self-acceptance-prompt-2',
        type: 'prompt',
        title: 'Origins of Non-Acceptance',
        content:
          'Our self-rejection often has sources.',
        prompt:
          'Where did your non-acceptance come from? Who or what taught you these parts of yourself were not okay?',
        skippable: true,
      },
      {
        id: 'self-acceptance-exercise-1',
        type: 'exercise',
        title: 'Accepting This Moment',
        content:
          'Practice accepting yourself right now.',
        exerciseInstructions: [
          'Notice how you are in this moment - thoughts, feelings, body',
          'Instead of wanting to be different, say: "This is how I am right now"',
          'Breathe and let yourself simply be',
          'Notice any softening or relief',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'self-acceptance-prompt-3',
        type: 'prompt',
        title: 'What Would Change',
        content:
          'Imagine life with greater self-acceptance.',
        prompt:
          'If you fully accepted yourself, what would be different? How would you feel? What would you do that you do not do now?',
        skippable: true,
      },
      {
        id: 'self-acceptance-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "You are worthy of acceptance exactly as you are, right now. Self-acceptance is a practice, not a destination.",
        prompt:
          'What part of yourself will you practice accepting? How might self-acceptance change your life?',
        skippable: false,
      },
    ],
  },
  {
    id: 'navigating-life-after-loss',
    title: 'Navigating Life After Loss',
    tagline: 'Rebuild meaning after loss',
    category: 'Life Transitions',
    description:
      'After a significant loss, life can feel empty and uncertain. This path helps you find your way forward while honoring what you have lost.',
    icon: 'Sunrise',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-yellow-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'after-loss-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "After a significant loss - a person, a relationship, a dream, an identity - the world can feel strange and empty. This path offers gentle support for finding your way forward while honoring your loss.",
        skippable: false,
      },
      {
        id: 'after-loss-prompt-1',
        type: 'prompt',
        title: 'Acknowledging Your Loss',
        content:
          'Name what you have lost.',
        prompt:
          'What loss are you navigating? Describe what you have lost and what it meant to you.',
        skippable: true,
      },
      {
        id: 'after-loss-prompt-2',
        type: 'prompt',
        title: 'Life Now',
        content:
          'Loss changes the texture of daily life.',
        prompt:
          'How has your daily life changed since this loss? What feels different? What is hardest?',
        skippable: true,
      },
      {
        id: 'after-loss-exercise-1',
        type: 'exercise',
        title: 'Holding Loss and Life',
        content:
          'Practice holding grief while also being present.',
        exerciseInstructions: [
          'Acknowledge your loss is real and painful',
          'Notice that you are still here, still breathing',
          'Hold both: the grief AND the continuation of life',
          'Let them coexist without conflict',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'after-loss-prompt-3',
        type: 'prompt',
        title: 'What Remains',
        content:
          'Even in loss, some things remain.',
        prompt:
          'What remains from what you lost? Memories, lessons, love, parts of yourself that were shaped by it?',
        skippable: true,
      },
      {
        id: 'after-loss-prompt-4',
        type: 'prompt',
        title: 'Moving Forward',
        content:
          'Moving forward does not mean forgetting.',
        prompt:
          'What does moving forward look like for you? How can you honor your loss while also embracing life?',
        skippable: true,
      },
      {
        id: 'after-loss-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Loss changes us forever, but it does not have to break us. You can carry your loss with you as you build a meaningful life.",
        prompt:
          'What do you want to remember as you navigate life after loss? What small step forward might you take?',
        skippable: false,
      },
    ],
  },
  {
    id: 'developing-mindful-eating',
    title: 'Developing Mindful Eating',
    tagline: 'Transform your relationship with food',
    category: 'Wellness',
    description:
      'Mindful eating brings awareness and presence to how we eat. This path helps you develop a more conscious, enjoyable relationship with food.',
    icon: 'Utensils',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-teal-50',
    borderColor: 'border-emerald-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'mindful-eating-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "How often do you truly taste your food? Mindful eating is about bringing full attention to the experience of eating - the flavors, textures, and sensations. This path introduces practices for more conscious eating.",
        skippable: false,
      },
      {
        id: 'mindful-eating-prompt-1',
        type: 'prompt',
        title: 'Current Eating Habits',
        content:
          'Notice how you typically eat.',
        prompt:
          'How do you usually eat? Fast or slow? Distracted or present? Standing or sitting? Describe your typical eating experience.',
        skippable: true,
      },
      {
        id: 'mindful-eating-prompt-2',
        type: 'prompt',
        title: 'Barriers to Presence',
        content:
          'Various things pull us away from mindful eating.',
        prompt:
          'What prevents you from eating mindfully? Is it busyness, habit, emotional eating, or something else?',
        skippable: true,
      },
      {
        id: 'mindful-eating-exercise-1',
        type: 'exercise',
        title: 'Mindful Bite',
        content:
          'Practice eating one bite with full attention.',
        exerciseInstructions: [
          'Take one bite of food',
          'Notice the texture, temperature, and flavor',
          'Chew slowly, experiencing each sensation',
          'Swallow mindfully, noticing the aftertaste',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'mindful-eating-prompt-3',
        type: 'prompt',
        title: 'Benefits of Mindful Eating',
        content:
          'Consider what mindful eating might offer you.',
        prompt:
          'How might eating more mindfully benefit you? Better digestion, more enjoyment, better relationship with food?',
        skippable: true,
      },
      {
        id: 'mindful-eating-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Mindful eating transforms a daily necessity into an opportunity for presence and pleasure.",
        prompt:
          'What mindful eating practice would you like to try? How will you remind yourself to eat with more awareness?',
        skippable: false,
      },
    ],
  },
  {
    id: 'cultivating-patience-with-self',
    title: 'Cultivating Patience with Yourself',
    tagline: 'Give yourself time to grow',
    category: 'Self-Development',
    description:
      'We are often our own harshest critics, expecting instant change. This path helps you develop more patience with your own growth and healing.',
    icon: 'Hourglass',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-orange-50',
    borderColor: 'border-amber-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'patience-self-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We often expect ourselves to change instantly, to heal quickly, to be better immediately. But meaningful growth takes time. This path is about cultivating patience with your own journey.",
        skippable: false,
      },
      {
        id: 'patience-self-prompt-1',
        type: 'prompt',
        title: 'Where You Rush Yourself',
        content:
          'Notice where you lack patience with yourself.',
        prompt:
          'In what areas do you pressure yourself to be further along? Where do you feel impatient with your progress?',
        skippable: true,
      },
      {
        id: 'patience-self-prompt-2',
        type: 'prompt',
        title: 'The Cost of Impatience',
        content:
          'Self-impatience has consequences.',
        prompt:
          'How does being impatient with yourself affect you? What does it cost in terms of wellbeing and progress?',
        skippable: true,
      },
      {
        id: 'patience-self-exercise-1',
        type: 'exercise',
        title: 'Patient Self-Talk',
        content:
          'Practice speaking to yourself with patience.',
        exerciseInstructions: [
          'Think of an area where you feel behind',
          'Speak to yourself as you would a child learning',
          'Say: "Growth takes time. I am doing my best"',
          'Feel the kindness in patient self-talk',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'patience-self-prompt-3',
        type: 'prompt',
        title: 'Progress Already Made',
        content:
          'You have already come far.',
        prompt:
          'What progress have you made that you sometimes overlook? How far have you come from where you started?',
        skippable: true,
      },
      {
        id: 'patience-self-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "You are a work in progress, and that is exactly as it should be. Give yourself the gift of patience.",
        prompt:
          'How will you practice more patience with yourself? What reminder might help?',
        skippable: false,
      },
    ],
  },
  {
    id: 'releasing-control',
    title: 'Releasing Control',
    tagline: 'Find peace in letting go',
    category: 'Emotional Regulation',
    description:
      'The need to control everything creates stress and anxiety. This path helps you identify what you can control and find peace in releasing the rest.',
    icon: 'Wind',
    gradientFrom: 'from-sky-50',
    gradientTo: 'to-cyan-50',
    borderColor: 'border-sky-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'control-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "The desire to control outcomes, situations, and even other people is natural - it helps us feel safe. But clinging to control over things we cannot actually control creates suffering. This path explores finding peace in letting go.",
        skippable: false,
      },
      {
        id: 'control-prompt-1',
        type: 'prompt',
        title: 'What You Try to Control',
        content:
          'Notice where control shows up in your life.',
        prompt:
          'What do you try to control that may be beyond your actual control? Other people, outcomes, the future, how others perceive you?',
        skippable: true,
      },
      {
        id: 'control-prompt-2',
        type: 'prompt',
        title: 'The Cost of Control',
        content:
          'Trying to control the uncontrollable has costs.',
        prompt:
          'How does trying to control things affect you? What does it cost in terms of stress, relationships, or peace of mind?',
        skippable: true,
      },
      {
        id: 'control-exercise-1',
        type: 'exercise',
        title: 'Releasing Practice',
        content:
          'Practice symbolically releasing control.',
        exerciseInstructions: [
          'Bring to mind something you are trying to control',
          'Imagine holding it tightly in your fist',
          'Slowly open your hand and let it go',
          'Say: "I release what I cannot control"',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'control-prompt-3',
        type: 'prompt',
        title: 'What You Can Control',
        content:
          'Focus on what is actually within your power.',
        prompt:
          'What CAN you actually control? Your actions, your responses, your effort? How might focusing here bring more peace?',
        skippable: true,
      },
      {
        id: 'control-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Control is an illusion for most of life. Peace comes from doing your best with what you can control and releasing the rest.",
        prompt:
          'What will you practice releasing control over? How will you redirect energy to what you can actually influence?',
        skippable: false,
      },
    ],
  },
  {
    id: 'embracing-uncertainty',
    title: 'Embracing Uncertainty',
    tagline: 'Find comfort in not knowing',
    category: 'Emotional Regulation',
    description:
      'Life is inherently uncertain. This path helps you develop comfort with not knowing and find freedom in uncertainty.',
    icon: 'HelpCircle',
    gradientFrom: 'from-violet-50',
    gradientTo: 'to-purple-50',
    borderColor: 'border-violet-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'embrace-uncertainty-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "We crave certainty, but life rarely provides it. Not knowing what will happen can feel unbearable. Yet uncertainty also holds possibility. This path explores finding peace - even freedom - in not knowing.",
        skippable: false,
      },
      {
        id: 'embrace-uncertainty-prompt-1',
        type: 'prompt',
        title: 'Your Relationship with Uncertainty',
        content:
          'Notice how you relate to not knowing.',
        prompt:
          'How do you typically respond to uncertainty? Does it cause anxiety, excitement, paralysis, or something else?',
        skippable: true,
      },
      {
        id: 'embrace-uncertainty-prompt-2',
        type: 'prompt',
        title: 'Current Uncertainties',
        content:
          'Acknowledge what is uncertain in your life right now.',
        prompt:
          'What uncertainties are you facing right now? What do you wish you knew but cannot? How does this affect you?',
        skippable: true,
      },
      {
        id: 'embrace-uncertainty-exercise-1',
        type: 'exercise',
        title: 'Sitting with Not Knowing',
        content:
          'Practice being present with uncertainty.',
        exerciseInstructions: [
          'Bring to mind an uncertainty in your life',
          'Notice the discomfort of not knowing',
          'Instead of solving, simply breathe with it',
          'Say: "I do not know, and that is okay"',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'embrace-uncertainty-prompt-3',
        type: 'prompt',
        title: 'Gifts of Uncertainty',
        content:
          'Uncertainty holds possibilities.',
        prompt:
          'What possibilities exist within your current uncertainties? What good things could happen that you cannot predict?',
        skippable: true,
      },
      {
        id: 'embrace-uncertainty-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Uncertainty is not the enemy - it is the space where possibility lives. You can be okay without knowing what comes next.",
        prompt:
          'How might your relationship with uncertainty shift? What will help you find peace in not knowing?',
        skippable: false,
      },
    ],
  },
  {
    id: 'discovering-personal-values',
    title: 'Discovering Personal Values',
    tagline: 'Clarify what truly matters',
    category: 'Growth & Purpose',
    description:
      'Values guide our decisions and give life meaning. This path helps you clarify your core values and align your life with what matters most.',
    icon: 'Compass',
    gradientFrom: 'from-teal-50',
    gradientTo: 'to-emerald-50',
    borderColor: 'border-teal-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'values-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Values are the principles that matter most to us - like honesty, creativity, family, or freedom. When we live in alignment with our values, life feels meaningful. This path helps you discover and clarify yours.",
        skippable: false,
      },
      {
        id: 'values-prompt-1',
        type: 'prompt',
        title: 'What Matters Most',
        content:
          'Begin identifying your core values.',
        prompt:
          'What matters most to you in life? What principles or qualities do you hold dear? List whatever comes to mind.',
        skippable: true,
      },
      {
        id: 'values-prompt-2',
        type: 'prompt',
        title: 'Values in Action',
        content:
          'Look at where your values show up.',
        prompt:
          'Think of a time you felt proud of yourself. What value were you honoring? Now think of a time you felt regret - what value was violated?',
        skippable: true,
      },
      {
        id: 'values-exercise-1',
        type: 'exercise',
        title: 'Values Clarification',
        content:
          'Narrow down your core values.',
        exerciseInstructions: [
          'List your top 10 values',
          'If you had to choose only 5, which would they be?',
          'Now narrow to your top 3 non-negotiables',
          'These are your core values',
        ],
        exerciseDuration: 180,
        skippable: true,
      },
      {
        id: 'values-prompt-3',
        type: 'prompt',
        title: 'Living Your Values',
        content:
          'Consider how well you are living your values.',
        prompt:
          'How aligned is your current life with your core values? Where are you honoring them? Where are you falling short?',
        skippable: true,
      },
      {
        id: 'values-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Your values are your compass. When decisions are hard, your values can guide the way.",
        prompt:
          'What are your core values? How will you live more aligned with them?',
        skippable: false,
      },
    ],
  },
  {
    id: 'overcoming-self-doubt',
    title: 'Overcoming Self-Doubt',
    tagline: 'Build belief in yourself',
    category: 'Self-Development',
    description:
      'Self-doubt can paralyze us, preventing action and growth. This path helps you understand your doubts and build greater self-belief.',
    icon: 'Lightbulb',
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-amber-50',
    borderColor: 'border-yellow-200',
    estimatedMinutes: 25,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'self-doubt-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Self-doubt whispers that you are not good enough, smart enough, or capable enough. Almost everyone experiences it, yet it can hold us back from our potential. This path explores your self-doubt and builds confidence.",
        skippable: false,
      },
      {
        id: 'self-doubt-prompt-1',
        type: 'prompt',
        title: 'Where Doubt Lives',
        content:
          'Notice where self-doubt shows up.',
        prompt:
          'In what areas of life does self-doubt affect you most? What do you doubt about yourself?',
        skippable: true,
      },
      {
        id: 'self-doubt-prompt-2',
        type: 'prompt',
        title: 'Origins of Doubt',
        content:
          'Self-doubt usually has sources.',
        prompt:
          'Where might your self-doubt come from? Past failures, critical voices, comparisons? What feeds your doubt?',
        skippable: true,
      },
      {
        id: 'self-doubt-exercise-1',
        type: 'exercise',
        title: 'Evidence Against Doubt',
        content:
          'Counter doubt with evidence.',
        exerciseInstructions: [
          'Identify a self-doubt you hold',
          'Ask: "What evidence contradicts this doubt?"',
          'List times you succeeded despite the doubt',
          'Notice: the doubt is not the whole truth',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'self-doubt-prompt-3',
        type: 'prompt',
        title: 'Acting Despite Doubt',
        content:
          'Confidence often comes from action, not before it.',
        prompt:
          'What would you do if you did not doubt yourself? How might you take action despite the doubt?',
        skippable: true,
      },
      {
        id: 'self-doubt-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Self-doubt is normal, but it does not have to run your life. You can doubt and still act.",
        prompt:
          'What action will you take despite your self-doubt? What truth will you remember when doubt whispers?',
        skippable: false,
      },
    ],
  },
  {
    id: 'creating-morning-rituals',
    title: 'Creating Morning Rituals',
    tagline: 'Start your days with intention',
    category: 'Wellness',
    description:
      'How you start your morning sets the tone for your day. This path helps you design a morning ritual that supports your wellbeing.',
    icon: 'Sunrise',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-rose-50',
    borderColor: 'border-orange-200',
    estimatedMinutes: 20,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'morning-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Mornings are powerful. The way you spend your first waking moments can influence your entire day. This path helps you create a morning ritual that nourishes and centers you.",
        skippable: false,
      },
      {
        id: 'morning-prompt-1',
        type: 'prompt',
        title: 'Current Mornings',
        content:
          'Notice how your mornings currently go.',
        prompt:
          'What do your mornings typically look like? How do you feel during them? What works and what does not?',
        skippable: true,
      },
      {
        id: 'morning-prompt-2',
        type: 'prompt',
        title: 'Ideal Morning',
        content:
          'Imagine your ideal morning.',
        prompt:
          'If you could design your perfect morning, what would it include? How would you feel? What would you do?',
        skippable: true,
      },
      {
        id: 'morning-exercise-1',
        type: 'exercise',
        title: 'Morning Intention',
        content:
          'Practice setting a morning intention.',
        exerciseInstructions: [
          'Think about tomorrow morning',
          'Choose one word for how you want to feel',
          'Choose one thing you will do mindfully',
          'Commit to this simple intention',
        ],
        exerciseDuration: 60,
        skippable: true,
      },
      {
        id: 'morning-prompt-3',
        type: 'prompt',
        title: 'Small Additions',
        content:
          'Small changes can transform mornings.',
        prompt:
          'What one or two small things could you add to your morning to make it better? Keep it realistic and doable.',
        skippable: true,
      },
      {
        id: 'morning-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "A meaningful morning does not require hours - even five minutes of intention can change your day.",
        prompt:
          'What will your morning ritual include? When will you start?',
        skippable: false,
      },
    ],
  },
  {
    id: 'healing-relationship-wounds',
    title: 'Healing Relationship Wounds',
    tagline: 'Process past relationship pain',
    category: 'Relationships',
    description:
      'Past relationships can leave wounds that affect how we connect today. This path helps you process relationship pain and move toward healing.',
    icon: 'Bandage',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-red-50',
    borderColor: 'border-rose-200',
    estimatedMinutes: 30,
    disclaimer: DEFAULT_DISCLAIMER,
    steps: [
      {
        id: 'relationship-wounds-intro',
        type: 'intro',
        title: 'Welcome',
        content:
          "Relationships - romantic, family, or friendship - can hurt us deeply. Those wounds do not always heal on their own. This path offers space to acknowledge, process, and begin healing relationship pain.",
        skippable: false,
      },
      {
        id: 'relationship-wounds-prompt-1',
        type: 'prompt',
        title: 'The Wound',
        content:
          'Acknowledge the relationship pain you carry.',
        prompt:
          'What relationship wound are you carrying? Describe the relationship and what happened that hurt you.',
        skippable: true,
      },
      {
        id: 'relationship-wounds-prompt-2',
        type: 'prompt',
        title: 'Lasting Impact',
        content:
          'Relationship wounds affect us in ongoing ways.',
        prompt:
          'How has this wound affected you? How does it show up in your current relationships or self-perception?',
        skippable: true,
      },
      {
        id: 'relationship-wounds-exercise-1',
        type: 'exercise',
        title: 'Tending the Wound',
        content:
          'Offer care to your relationship wound.',
        exerciseInstructions: [
          'Place your hand on your heart',
          'Acknowledge: "I was hurt, and that pain is real"',
          'Say: "I did not deserve to be hurt"',
          'Offer yourself compassion as you would a friend',
        ],
        exerciseDuration: 90,
        skippable: true,
      },
      {
        id: 'relationship-wounds-prompt-3',
        type: 'prompt',
        title: 'What Healing Needs',
        content:
          'Consider what would help you heal.',
        prompt:
          'What do you need to heal from this wound? Is it time, understanding, closure, self-compassion, or something else?',
        skippable: true,
      },
      {
        id: 'relationship-wounds-prompt-4',
        type: 'prompt',
        title: 'Moving Forward',
        content:
          'Healing allows new possibilities.',
        prompt:
          'How might healing this wound change your future relationships? What becomes possible when you are no longer carrying this pain?',
        skippable: true,
      },
      {
        id: 'relationship-wounds-summary',
        type: 'summary',
        title: 'Your Reflection',
        content:
          "Relationship wounds can heal, though scars may remain. Your past does not have to define your future connections.",
        prompt:
          'What step toward healing will you take? What do you want to remember from this reflection?',
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
