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
  {
    id: 'managing-stress',
    title: 'Managing Stress',
    tagline: 'Find calm in the chaos',
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
          "Stress isn't always bad - it can motivate us and help us respond to challenges. But when stress becomes constant or overwhelming, it affects our health, relationships, and wellbeing. This path is about understanding your relationship with stress and finding what works for you.",
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
          'What are the main sources of stress in your life right now? Try to list them without judgment - big or small, they all count.',
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
          'We all have ways of coping with stress - some helpful, some less so. There\'s no judgment here.',
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
    description:
      'Sleep affects everything - mood, energy, health, and how we handle life. This path explores your relationship with rest and what might help you sleep better.',
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
          "Rest is not a luxury - it's a necessity. Yet many of us struggle with sleep, whether it's falling asleep, staying asleep, or simply allowing ourselves to rest. This path is a gentle exploration of your sleep patterns and what might help you find more restful nights.",
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
          'Many things can interfere with sleep - thoughts, habits, environment, or life circumstances.',
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
          "Boundaries aren't walls - they're guidelines that help us maintain our wellbeing while staying connected to others. Many of us weren't taught how to set boundaries, and it can feel uncomfortable at first. This path is about understanding what you need and finding ways to honor those needs.",
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
          'What are your non-negotiables - the things you need to function and feel okay? These might be about time, space, respect, or self-care.',
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
          "Perfectionism isn't about having high standards - it's about believing that your worth depends on being perfect. It can lead to procrastination, anxiety, and never feeling good enough. This path is about finding freedom from impossible standards while still caring about what you do.",
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
          'Practice the feeling of "good enough" - it might feel unfamiliar.',
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
          "Loneliness doesn't always mean being alone - you can feel lonely in a crowd or in a relationship. It's about feeling disconnected, unseen, or like you don't belong. This is more common than people admit, and it's nothing to be ashamed of. This path is a space to explore your experience with loneliness.",
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
          'Sometimes there are reasons - internal or external - that make connection difficult.',
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
          "Motivation isn't constant - it ebbs and flows. When it's low, even simple tasks feel impossible. This isn't a character flaw; it's a signal worth paying attention to. This path explores what might be affecting your motivation and what could help you reconnect with your drive.",
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
          'Low motivation often has underlying causes - exhaustion, stress, lack of meaning, or feeling stuck.',
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
          "We like to feel in control, to know what's coming. But life is fundamentally uncertain, and fighting this reality causes suffering. This path isn't about eliminating uncertainty - that's impossible - but about building your capacity to be okay even when you don't know what's next.",
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
          "Rejection activates the same brain regions as physical pain - it literally hurts. Whether it's romantic rejection, social exclusion, job loss, or any other form of being turned away, the pain is real. This path is a space to process that pain and remember your worth.",
        skippable: false,
      },
      {
        id: 'rejection-prompt-1',
        type: 'prompt',
        title: 'What Happened',
        content:
          'Sometimes we need to tell the story of what happened, even if it\'s painful.',
        prompt:
          'Describe the rejection you\'re processing. What happened? You don\'t have to share every detail - just what feels important to name.',
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
    description:
      'Confidence isn\'t about being perfect or fearless - it\'s about trusting yourself to handle whatever comes. This path explores what confidence means to you.',
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
          "Confidence isn't the absence of doubt - it's moving forward even when doubt is present. It's not about knowing you'll succeed, but trusting that you can handle whatever happens. This path explores your relationship with confidence and how to build more of it.",
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
    description:
      'Holding onto resentment keeps us connected to pain. This path explores what you\'re holding onto and what it might mean to let go - for your own sake.',
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
          'Sometimes resentment serves a purpose - it can feel safer than vulnerability.',
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
          "Joy isn't frivolous - it's essential. Yet many of us have lost touch with what brings us joy, buried under responsibilities and stress. This path is an invitation to remember and reclaim what lights you up, even in small ways.",
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
