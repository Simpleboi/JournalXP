import { EmotionalState } from "@/models/Meditation";
import { Quote } from "@/models/Meditation";
import {
  MindfulnessChallenge,
  MoodState,
  VisualizationExercise,
} from "@/types/Meditation";
import { Feather, Home, Package, Mountain } from "lucide-react";

export const EMOTIONAL_STATES: EmotionalState[] = [
  {
    id: "anger",
    title: "Anger",
    emoji: "😡",
    description: "Learn how to cool your thoughts and find clarity when angry.",
    color: "from-red-100 to-orange-100",
    introMessage: "It's okay to feel this way. Anger is a natural emotion that often arises when we sense something isn't right or a boundary has been crossed. You don't need to push it away, just pause here and let's work through it together. This feeling will pass, and you're safe to explore it.",
    techniques: [
      "4-7-8 Breathing: Breathe in slowly through your nose for 4 counts, hold your breath for 7 counts, then exhale completely through your mouth for 8 counts. This activates your calm response.",
      "Cooling Breath: Curl your tongue and inhale slowly through it (or through pursed lips), then exhale through your nose. Imagine cooling down from the inside out.",
      "Count and Release: With each exhale, count backwards from 10 to 1. As you count, imagine releasing the heat of anger with each number.",
      "Progressive Muscle Tension Release: Clench your fists tightly for 5 seconds, then release. Move up through your arms, shoulders, and jaw, tensing and releasing each area."
    ],
    grounding: [
      "5-4-3-2-1 Technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This brings you back to the present.",
      "Press your feet firmly into the ground and notice the solid connection beneath you. Feel the stability of the earth supporting your body.",
      "Hold something cold like an ice cube or run cold water over your wrists. The temperature shift can help interrupt the anger response and bring clarity.",
      "Place your hand on a wall or solid surface and describe its texture out loud: smooth, rough, cool, warm. This redirects your focus outward."
    ],
    bodyAwareness: [
      "Notice where anger lives in your body. Is it heat in your chest? Tension in your jaw? Simply observe without judgment.",
      "Roll your shoulders back slowly three times. Release the tension you're holding in your upper body.",
      "Gently massage your jaw with your fingertips. Many people clench when angry, give yourself permission to soften.",
      "Take a short walk, even if just around the room. Movement helps process the energy of anger and can clear your mind."
    ],
    journalPrompts: [
      "What triggered this anger? Looking beneath the surface, what need of mine wasn't being met?",
      "If this anger could speak, what would it say it needs? What is it trying to protect or defend?",
      "How can I express this feeling in a way that honors both myself and others?",
      "What would I tell a close friend who was feeling exactly what I'm feeling right now?",
      "Once this anger passes, what action (if any) would feel aligned and constructive?"
    ],
    meditation: "This is a 5-minute guided meditation designed to help you release anger and find inner calm. Begin by sitting comfortably and taking three deep breaths. As you breathe, imagine the anger as a color, perhaps red or orange. See it swirling in your chest or stomach. With each exhale, visualize this color softening, cooling, and slowly leaving your body. It floats away like smoke dissolving into the air. As the color fades, imagine it being replaced by a cool, soothing blue or green light that fills your chest with peace. Your breath becomes your anchor, steady, reliable, always there for you. Notice how, with each breath, you feel a little lighter, a little calmer, a little more in control. Anger is just a visitor passing through. You are the sky, and anger is merely weather. Let it move through you and drift away.",
    externalResources: [
      {
        title: "National Alliance on Mental Illness (NAMI) - Managing Anger",
        link: "https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness/Taking-Care-of-Your-Body/Managing-Anger"
      },
      {
        title: "Psychology Today - Understanding Anger",
        link: "https://www.psychologytoday.com/us/basics/anger"
      }
    ]
  },
  {
    id: "sadness",
    title: "Sadness",
    emoji: "😔",
    description: "Gentle support to honor your feelings and find comfort.",
    color: "from-blue-100 to-indigo-100",
    introMessage: "Your sadness is valid, and there's nothing wrong with feeling this way. Sadness is the heart's way of processing loss, disappointment, or change. It's okay to slow down and give yourself permission to feel. You don't have to rush through this, healing moves at its own pace. You're not alone, and this feeling won't last forever.",
    techniques: [
      "Gentle Belly Breathing: Place one hand on your chest and one on your belly. Breathe slowly into your belly, feeling it rise under your hand. Exhale softly, like a gentle sigh.",
      "Heart-Centered Breathing: Place both hands over your heart. Breathe in as if drawing breath into your heart space. Exhale slowly, sending warmth and compassion to yourself.",
      "Soft Humming Breath: As you exhale, hum softly. The vibration can be soothing and grounding, like a lullaby for your nervous system.",
      "Extended Exhale: Inhale for 4 counts, then exhale slowly for 6-8 counts. Longer exhales activate your body's relaxation response."
    ],
    grounding: [
      "Wrap yourself in a soft blanket or sweater. Feel the warmth and weight of the fabric as a gentle, comforting embrace.",
      "Listen to calming sounds: rain, ocean waves, gentle music, or white noise. Let the sounds wash over you like a soothing presence.",
      "Practice gentle self-touch: Place your hand on your heart, stroke your own arm, or give yourself a hug. Physical warmth can ease emotional pain.",
      "Sip a warm beverage slowly, tea, cocoa, or warm water with lemon. Focus on the warmth traveling down your throat and into your stomach."
    ],
    bodyAwareness: [
      "Notice where sadness sits in your body. Does it feel heavy in your chest? Tight in your throat? Acknowledge it gently without trying to fix it.",
      "Let your body soften. Release your shoulders, unclench your jaw, and allow your face to relax. Sometimes sadness needs space to be felt.",
      "Give yourself permission to cry if tears come. Crying releases stress hormones and can actually help you feel better afterward.",
      "Take a slow, gentle stretch, reach your arms overhead or roll your neck side to side. Movement, even small, can help energy flow."
    ],
    journalPrompts: [
      "What am I grieving or missing right now? Is it a person, a time, a feeling, or something I hoped for?",
      "How can I show myself the same kindness I would offer to someone I love who is hurting?",
      "What small comfort would feel nurturing to me today? (A walk, a call to a friend, rest, creative expression?)",
      "If my sadness had a voice, what would it want me to know?",
      "What has helped me through sadness before? What coping tools do I have that I can lean on now?"
    ],
    meditation: "This is a 7-minute self-compassion meditation to help you hold your sadness with kindness. Begin by finding a comfortable seated or lying position. Close your eyes if that feels okay. Take a few deep breaths and imagine you're sitting beside your younger self, or a dear friend who is sad. What would you say to them? You might say, 'I see that you're hurting, and that's okay. You don't have to be strong right now.' Place your hand on your heart and feel the warmth there. Imagine a soft, golden light surrounding you, this is the light of compassion, and it's always available to you. With each breath, let this light grow a little brighter, reminding you that sadness is temporary, but your capacity for healing is infinite. You are worthy of comfort, rest, and gentle care. Let yourself be held by this moment. There's no need to rush. Just breathe, and be kind to yourself.",
    externalResources: [
      {
        title: "Mental Health America - Coping with Sadness and Grief",
        link: "https://www.mhanational.org/grief"
      },
      {
        title: "Crisis Text Line - 24/7 Support via Text",
        link: "https://www.crisistextline.org/"
      }
    ]
  },
  {
    id: "anxiety",
    title: "Anxiety",
    emoji: "😰",
    description: "Tools to calm your nervous system and find peace.",
    color: "from-yellow-100 to-amber-100",
    introMessage: "Take this moment to slow down and notice what's real around you. Anxiety often pulls us into the future, imagining worst-case scenarios. But right here, right now, you are safe. Your body is trying to protect you, but sometimes the alarm goes off when there's no real danger. Let's gently turn down the volume together.",
    techniques: [
      "Box Breathing (4-4-4-4): Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Visualize tracing the sides of a square with each phase.",
      "Physiological Sigh: Take two quick inhales through your nose (one short, one shorter), then one long, slow exhale through your mouth. This rapidly calms your nervous system.",
      "Humming Bee Breath: Inhale normally, then exhale while making a soft humming sound. The vibration in your chest and head is naturally calming.",
      "Alternate Nostril Breathing: Close your right nostril and inhale through the left. Close the left, exhale through the right. Repeat, alternating sides to balance your nervous system."
    ],
    grounding: [
      "Feel your back against the chair or your body against the ground. Notice the solid support beneath you and let it hold your weight.",
      "Name your current location out loud, including details: 'I am in [room], in [city], in [state]. It is [time]. I am safe here.'",
      "Focus on slow, deep exhales that are longer than your inhales. This signals to your brain that you are not in immediate danger.",
      "Splash cold water on your face or hold a cool, damp cloth to your forehead. This activates the 'dive response' and slows your heart rate."
    ],
    bodyAwareness: [
      "Notice where anxiety shows up in your body. Is it a racing heart? Tight chest? Butterflies in your stomach? Simply name it without judgment.",
      "Do gentle neck and shoulder rolls to release the physical tension anxiety creates. Many people hold anxiety in their upper body.",
      "Try 'butterfly taps': Cross your arms over your chest and gently tap your shoulders alternately, like a butterfly's wings. This bilateral stimulation is calming.",
      "Shake it out: Literally shake your hands, arms, and legs for 30 seconds. This helps discharge the nervous energy anxiety creates."
    ],
    journalPrompts: [
      "What specific worry is taking up the most space in my mind right now? Can I name it clearly?",
      "What evidence do I have that this worry might not come true? What other outcomes are possible?",
      "If I felt completely safe and at peace right now, what would I do? What would change?",
      "What has helped me cope with anxiety before? What tools or people can I reach out to?",
      "What is within my control right now, and what do I need to release or surrender?"
    ],
    meditation: "This is a 6-minute anxiety-relief meditation focused on safety and present-moment awareness. Find a comfortable position and gently close your eyes. Begin by taking three slow, deep breaths. As you breathe, bring your attention to the soles of your feet touching the ground. Feel the solid earth beneath you. Now, scan your environment with your other senses. What can you hear? Traffic, birds, silence? What can you feel? The air on your skin, the texture of your clothing? Anxiety wants to pull you into the future, but right now, in this moment, you are safe. Repeat silently to yourself: 'Right now, I am okay. Right now, I am safe.' With each exhale, imagine releasing a small piece of worry. It floats away like a balloon drifting up into the sky. You don't have to solve everything today. You don't have to have all the answers. All you need to do is breathe, and trust that you will handle whatever comes, one moment at a time. You are stronger than you think, and you are not alone.",
    externalResources: [
      {
        title: "Anxiety and Depression Association of America (ADAA)",
        link: "https://adaa.org/"
      },
      {
        title: "SAMHSA National Helpline - Free, Confidential Support",
        link: "https://www.samhsa.gov/find-help/national-helpline"
      }
    ]
  },
  {
    id: "overwhelm",
    title: "Overwhelm",
    emoji: "😩",
    description: "Step back, breathe, and find clarity in the chaos.",
    color: "from-purple-100 to-pink-100",
    introMessage: "You don't have to do everything at once. One breath, one moment, one step. Feeling overwhelmed is your system's way of saying, 'This is too much right now,' and that's okay. You're not failing, you're human. Let's create some space together so you can see more clearly what actually needs your attention.",
    techniques: [
      "Three-Part Breath: Breathe deeply into your belly, then your ribcage, then your chest, filling yourself completely. Exhale slowly in reverse order. This expands your capacity and brings calm.",
      "5-Minute Brain Dump Breathing: Set a timer for 5 minutes. Breathe slowly while writing down every single thought, task, or worry swirling in your mind. Getting it out of your head and onto paper creates instant relief.",
      "Breath of Fire (Gentle Version): Take quick, rhythmic breaths through your nose for 30 seconds, then breathe normally. This energizes and clears mental fog.",
      "Sigh of Relief: Take a deep breath in, then exhale with an audible sigh, 'Ahhhh.' Let your whole body release. Repeat 3 times."
    ],
    grounding: [
      "Write down every single thing in your mind onto a piece of paper, then fold it up or put it aside. You've captured it, now you can come back to it when you're ready.",
      "Set a timer for 2 minutes and do nothing but breathe. Close your eyes, let go of the to-do list, and just be.",
      "Choose one tiny, manageable action and do it mindfully. Make your bed, wash one dish, drink a glass of water. Small wins create momentum.",
      "Visualize putting each worry or task into an imaginary box. Close the lid. You can open it later, but for now, it's contained and separate from you."
    ],
    bodyAwareness: [
      "Do a quick body scan from head to toe. Where are you holding tension? Breathe into that area and soften it with each exhale.",
      "Drop your shoulders away from your ears. We tend to hunch when overwhelmed. Gently roll them back and down.",
      "Stand up and stretch your arms wide, then up overhead. Take up space. This signals to your brain that you have room to breathe.",
      "Press your palms together firmly in front of your chest for 10 seconds, then release. This grounding gesture helps you feel more centered."
    ],
    journalPrompts: [
      "What are the top 3 things that truly need my attention today? Just three. Everything else can wait.",
      "What can I delegate to someone else, delay until later, or delete from my list entirely?",
      "If I could only do one thing today, what would make me feel most at peace by tonight?",
      "What would change if I gave myself permission to do less? What am I really afraid will happen?",
      "How can I break this overwhelming task into smaller, bite-sized steps? What's the very first small action I can take?"
    ],
    meditation: "This is a 5-minute meditation for mental clarity and finding what truly matters. Begin by sitting comfortably and taking three grounding breaths. Imagine you're standing in a cluttered room filled with objects, each one representing a task, worry, or demand on your time. It feels chaotic and crowded. Now, imagine you have a gentle, golden light in your hand, this light represents clarity. As you shine it around the room, most of the objects begin to fade and disappear. They weren't as important as they seemed. Only a few remain, glowing softly. These are the things that actually matter right now. Everything else is just noise. Take a deep breath and focus on those few glowing objects. You don't need to do it all. You only need to focus on what's real, what's important, and what aligns with your peace. Trust yourself. You know what matters most. Breathe, and let the rest go.",
    externalResources: [
      {
        title: "MindTools - Dealing with Overwhelm",
        link: "https://www.mindtools.com/pages/article/managing-overwhelm.htm"
      },
      {
        title: "Headspace - Stress and Anxiety Resources",
        link: "https://www.headspace.com/stress"
      }
    ]
  },
  {
    id: "calm-boost",
    title: "Calm Boost",
    emoji: "😊",
    description: "Maintain and deepen your sense of peace and well-being.",
    color: "from-green-100 to-teal-100",
    introMessage: "In this moment, you are exactly where you need to be. You've cultivated this sense of calm, and it's a beautiful thing. Let's deepen and protect this peaceful feeling so you can carry it with you throughout your day. Peace isn't just the absence of stress, it's a presence you can nurture and grow.",
    techniques: [
      "Gratitude Breathing: As you inhale, silently name something you're grateful for. As you exhale, send that appreciation outward, like sharing your peace with the world.",
      "Smiling Breath: Gently smile as you breathe. Notice how even a soft smile shifts your mood and energy. Your body and mind are connected.",
      "Expansive Breathing: Inhale while imagining your lungs filling with light and space. Exhale and feel yourself expanding, taking up more room with your calm presence.",
      "Loving-Kindness Breath: Inhale peace for yourself. Exhale and send peace to someone you love. Repeat, extending that circle of calm outward."
    ],
    grounding: [
      "Notice areas in your body that feel relaxed, comfortable, or at ease. Rest your attention there and savor the sensation.",
      "Send appreciation to yourself for taking this time to breathe, to pause, to care for your well-being. Acknowledge the effort it takes to show up for yourself.",
      "Set a simple intention to carry this calm forward: 'I will return to this feeling throughout my day. I will protect my peace.'",
      "Imagine your calm as a warm, glowing light inside your chest. Picture it radiating outward, creating a buffer zone of peace around you."
    ],
    bodyAwareness: [
      "Do a gentle body scan and notice where you feel soft, open, and relaxed. Breathe into those spaces and let the ease spread.",
      "Smile gently and notice how your face softens. Let this softness travel down through your neck, shoulders, and arms.",
      "Place your hands over your heart and feel its steady rhythm. Thank your body for carrying you, breathing for you, keeping you alive.",
      "Sway gently from side to side or rock in place. This subtle movement can enhance feelings of calm and safety."
    ],
    journalPrompts: [
      "What am I most grateful for in this exact moment? What small joy or comfort is present right now?",
      "How can I extend this feeling of peace to the people around me? How can I be a source of calm today?",
      "What practices, routines, or rituals help me maintain inner calm? How can I prioritize them?",
      "When I feel this peaceful, what becomes clear to me? What insights arise when I'm not in fight-or-flight mode?",
      "What would my life look like if I protected and prioritized my peace as much as I do my productivity?"
    ],
    meditation: "This is an 8-minute meditation to cultivate lasting peace and positive energy. Find a comfortable position and take a few deep breaths. Bring your attention to your heart center, the space in the middle of your chest. Imagine there's a soft, warm light glowing there. This light represents your inner peace, and it's always with you, even when you can't feel it. With each breath, watch this light grow a little brighter, a little warmer. It fills your chest, then your whole body, then extends beyond you, creating a peaceful aura around you. This peace is yours. It's not dependent on external circumstances. It's a wellspring that comes from within. As you breathe, repeat silently: 'I am at peace. I am enough. I am whole.' Let this truth settle into your bones. Carry this light with you as you move through your day. When challenges arise, remember: you can always come back to this place. You can always return to your breath, to your center, to your peace.",
    externalResources: [
      {
        title: "Greater Good Science Center - Practices for Wellbeing",
        link: "https://greatergood.berkeley.edu/topic/mindfulness/definition"
      },
      {
        title: "Calm App - Free Resources for Peace",
        link: "https://www.calm.com/"
      }
    ]
  },
  {
    id: "focus",
    title: "Focus",
    emoji: "🎯",
    description: "Clear mental fog and sharpen your concentration.",
    color: "from-cyan-100 to-blue-100",
    introMessage: "Ask yourself what this moment is calling you to focus on. Mental clarity isn't about doing more, it's about directing your attention with intention. When you're focused, you're fully present with what matters, and everything else fades into the background. Let's clear the mental fog together and help you find your center.",
    techniques: [
      "Alternate Nostril Breathing: Close your right nostril with your thumb, inhale through the left. Close the left with your ring finger, exhale through the right. Repeat, alternating sides. This balances both brain hemispheres.",
      "Breath of Fire (Energizing): Take quick, rhythmic breaths through your nose for 1 minute. This increases oxygen to the brain and sharpens mental clarity.",
      "Sharp Exhale Breaths: Inhale deeply, then exhale in short, forceful bursts (like blowing out candles). This clears stagnant energy and wakes up your mind.",
      "Counted Breathing for Focus: Inhale for 4, hold for 4, exhale for 4. Count silently, focusing only on the numbers. This trains your mind to hold attention."
    ],
    grounding: [
      "Sit up tall with your spine aligned. Feel your posture supporting mental alertness. Slouching scatters energy; sitting tall gathers it.",
      "Focus on a single point or object for 30 seconds without letting your eyes wander. This trains your attention muscle.",
      "Take three energizing breaths with intention: 'I am clear. I am focused. I am capable.' Feel the words activate your mind.",
      "Clench and release your fists three times. This small physical action can help 'wake up' your nervous system and sharpen focus."
    ],
    bodyAwareness: [
      "Notice if you're holding tension in your forehead or between your eyebrows. Soften your face, mental clarity doesn't require physical strain.",
      "Roll your shoulders back and down. Open your chest. This posture helps oxygen flow more freely to your brain.",
      "Tap the top of your head gently with your fingertips for 10 seconds. This stimulates circulation and can enhance alertness.",
      "Take a quick standing stretch: reach your arms overhead, rise onto your toes, and breathe deeply. Movement increases blood flow and mental sharpness."
    ],
    journalPrompts: [
      "What is my main intention or goal for today? If I could only accomplish one meaningful thing, what would it be?",
      "What distractions or mental clutter can I minimize right now? What can I say no to?",
      "How do I want to feel when I complete this task? Accomplished? Proud? At peace? Let that feeling guide me.",
      "What small, focused action can I take in the next 10 minutes that will move me forward?",
      "When I'm at my most focused, what conditions help? Quiet? Music? A clear desk? How can I recreate those conditions now?"
    ],
    meditation: "This is a 5-minute concentration meditation to enhance mental clarity and focus. Sit comfortably with your spine straight and your hands resting on your lap. Take a few deep breaths and bring your full attention to the sensation of air moving in and out of your nostrils. This is your anchor point. Each time your mind wanders, and it will, gently guide it back to your breath without judgment. You're training your mind like a muscle. With each return to the breath, you're strengthening your ability to focus. Imagine your mind is like a calm, clear lake. Thoughts are like ripples on the surface, but beneath them, the water is still and deep. That stillness is always there, waiting for you. As you breathe, feel yourself sinking into that deeper place of clarity. You are capable of deep focus. You are capable of sustained attention. Your mind is powerful, and you can direct it with intention. Trust yourself. When you're ready, open your eyes and carry this clarity forward.",
    externalResources: [
      {
        title: "Harvard Business Review - The Science of Focus",
        link: "https://hbr.org/topic/focus"
      },
      {
        title: "Focus@Will - Music for Concentration",
        link: "https://www.focusatwill.com/"
      }
    ]
  }
];

// Quote Section
export const quotes: Quote[] = [
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh",
  },
  { text: "Breathe in peace, breathe out stress.", author: "Unknown" },
  {
    text: "You are the sky, everything else is just the weather.",
    author: "Pema Chödrön",
  },
  {
    text: "In the midst of movement and chaos, keep stillness inside of you.",
    author: "Deepak Chopra",
  },
  {
    text: "The quieter you become, the more you are able to hear.",
    author: "Rumi",
  },
  {
    text: "Your calm mind is the ultimate weapon against your challenges.",
    author: "Bryant McGill",
  },
  {
    text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts.",
    author: "Arianna Huffington",
  },
  {
    text: "The best way to take care of the future is to take care of the present moment.",
    author: "Thích Nhất Hạnh",
  },
  {
    text: "Inner peace begins the moment you choose not to allow another person or event to control your emotions.",
    author: "Pema Chödrön",
  },
];

// Mood States with Adaptive Experiences
export const MOOD_STATES: MoodState[] = [
  {
    id: "anxious",
    name: "Anxious",
    emoji: "😰",
    gradient: "from-amber-100 via-yellow-50 to-orange-50",
    quote: "This too shall pass. You are safe in this moment.",
    breathingPattern: { inhale: 4, hold: 4, exhale: 6, holdAfter: 2 },
    journalPrompt:
      "What specific worry is taking up space in my mind right now? What evidence do I have that contradicts this worry?",
    ambientColor: "rgba(252, 211, 77, 0.15)",
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😡",
    gradient: "from-rose-100 via-pink-50 to-red-50",
    quote: "Anger is a messenger. What is it trying to tell you?",
    breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    journalPrompt:
      "What triggered this anger? What underlying need is not being met?",
    ambientColor: "rgba(251, 113, 133, 0.15)",
  },
  {
    id: "tired",
    name: "Tired",
    emoji: "😴",
    gradient: "from-slate-100 via-blue-50 to-indigo-50",
    quote:
      "Rest is not a luxury, it's a necessity. Honor your need for restoration.",
    breathingPattern: { inhale: 3, hold: 2, exhale: 5, holdAfter: 2 },
    journalPrompt:
      "What is draining my energy? What would true rest look like for me?",
    ambientColor: "rgba(148, 163, 184, 0.15)",
  },
  {
    id: "unmotivated",
    name: "Unmotivated",
    emoji: "😐",
    gradient: "from-gray-100 via-neutral-50 to-stone-50",
    quote:
      "Small steps forward are still progress. You don't have to feel motivated to begin.",
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    journalPrompt:
      "What is one tiny action I can take right now? What would make today feel meaningful?",
    ambientColor: "rgba(156, 163, 175, 0.15)",
  },
  {
    id: "peaceful",
    name: "Peaceful",
    emoji: "😌",
    gradient: "from-emerald-100 via-green-50 to-teal-50",
    quote: "In this moment, you are exactly where you need to be.",
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    journalPrompt:
      "What am I grateful for in this peaceful moment? How can I carry this feeling forward?",
    ambientColor: "rgba(110, 231, 183, 0.15)",
  },
  {
    id: "overwhelmed",
    name: "Overwhelmed",
    emoji: "😩",
    gradient: "from-violet-100 via-purple-50 to-lavender-50",
    quote:
      "You don't have to do everything at once. One breath, one moment, one step.",
    breathingPattern: { inhale: 3, hold: 3, exhale: 6, holdAfter: 3 },
    journalPrompt:
      "What are the top 3 things that actually need my attention? What can wait?",
    ambientColor: "rgba(196, 181, 253, 0.15)",
  },
];

// Visualization Exercises
export const VISUALIZATIONS: VisualizationExercise[] = [
  {
    id: "garden",
    title: "The Garden of Intention",
    description: "Journey through a transformative garden where you cultivate the life you wish to grow. Plant seeds of hope, nurture dreams, and witness the beauty of patient becoming.",
    duration: "12 minutes",
    icon: Feather,
    color: "from-green-400 to-emerald-500",
    script: [
      "Close your eyes and take three slow, deep breaths. With each exhale, let go of the noise and demands of your day. Feel your body settling into this moment, this sacred pause.",
      "Imagine yourself standing before an ancient wooden gate, weathered and beautiful. Beyond it, you sense something extraordinary waiting, a garden that exists beyond time, a place where your deepest intentions can take root.",
      "As you push open the gate, it swings effortlessly on well-worn hinges. You step through, and immediately, you feel it, a subtle shift in the air. The temperature is perfect against your skin. The light is golden and soft, filtering through leaves overhead.",
      "A winding stone path stretches before you, each stone smooth and warm beneath your feet. On either side, wildflowers sway gently in a breeze that seems to whisper your name. Notice the colors: deep purples, bright yellows, soft pinks. Each bloom is fully alive, fully itself.",
      "As you walk deeper into the garden, you become aware of the sounds. Birds singing their evening songs. The distant trickle of water. The rustle of leaves. And beneath it all, a profound, embracing silence, the kind that makes space for everything you've been carrying.",
      "You come to a clearing bathed in warm, honeyed light. In the center is a patch of rich, dark soil, earth that has been waiting for you. It smells of rain and possibility. This is your soil, your sacred ground.",
      "Look down at your hands. Cupped in your palms are seeds, each one glowing faintly with an inner light. These are not ordinary seeds. Each one represents something you long to grow in your life, a dream, an intention, a quality you wish to embody, a hope you've been afraid to speak aloud.",
      "Take a moment to really see these seeds. There might be seeds of courage, of joy, of healing. Perhaps seeds of creativity, connection, or inner peace. Some may be small and delicate; others surprisingly heavy. Each one is precious. Each one is yours.",
      "Kneel down in the soft earth. Feel the soil between your fingers, cool, alive, receptive. It is ready to receive whatever you wish to plant. Choose one seed, the one that calls to you most strongly in this moment.",
      "As you hold this seed, silently name what it represents. 'This is my courage.' 'This is my healing.' 'This is my joy.' Feel the weight of it, the promise it holds. Then, with tenderness and intention, press it into the earth.",
      "Cover it gently with soil, patting it down with care. As you do, know this: you are not forcing anything to happen. You are simply creating the conditions for growth. You are saying 'yes' to something beautiful.",
      "Now, plant the other seeds, one by one. Take your time. There is no rush. Each seed deserves its own moment, its own blessing. With each one, you are making a choice, a choice to nurture something instead of neglecting it, to believe instead of doubting.",
      "When all the seeds are planted, sit back and rest your hands on the earth. Feel your connection to this ground, to this process. You are part of the cycle now, the planting, the waiting, the growing, the becoming.",
      "As you sit in the stillness, a gentle rain begins to fall. Not a storm, but a soft, nourishing rain. It falls on your skin, on the earth, on the seeds you've planted. It smells fresh and clean, and you know, deep in your bones, that this rain is exactly what is needed.",
      "You watch as tiny green shoots begin to emerge from the soil, not all at once, but here and there, in their own time. Some grow quickly, reaching eagerly toward the sun. Others are slower, more cautious. All are perfect exactly as they are. This garden does not rush. It trusts the process.",
      "As you stand to leave, you notice something: this garden is not separate from you. It is within you. The seeds you planted are already growing in the soil of your heart, watered by your willingness to try, to hope, to show up for yourself.",
      "Take one last look around. The gate is always open. This garden is always here, waiting for you to return, to tend, to nurture what matters most. And you can come back anytime, whenever you need to remember that growth is not something you force, but something you allow.",
      "Now, slowly, gently, bring your awareness back to your breath. Feel the chair or floor beneath you. Wiggle your fingers and toes. And when you're ready, open your eyes, carrying with you the knowing that you are planting, even now, the life you wish to grow.",
    ],
  },
  {
    id: "safe-place",
    title: "Your Inner Sanctuary",
    description: "Build a haven of absolute safety within yourself, a place where you are held, protected, and completely at peace. This sacred space exists beyond fear, beyond judgment, beyond harm.",
    duration: "15 minutes",
    icon: Home,
    color: "from-blue-400 to-cyan-500",
    script: [
      "Take a deep breath and allow your entire body to soften. Let your shoulders drop away from your ears. Unclench your jaw. Release any tension you've been holding. You are safe to let go here.",
      "Close your eyes and imagine that you're standing at the edge of a vast, open landscape. Before you is a path, your path, and it leads to a place that has been waiting for you your entire life. A place built by your heart, for your heart.",
      "This place can be anything you need it to be. A cabin in the woods where snow falls softly outside. A warm room with a fireplace and overstuffed chairs. A sun-drenched beach where gentle waves kiss the shore. A meadow alive with wildflowers. Or something entirely your own, a space that defies description but feels unmistakably like home.",
      "As you walk toward this sanctuary, notice what you see, hear, and feel. Is there a scent in the air? Woodsmoke? Ocean salt? Fresh rain? Lavender? Notice the quality of light, golden, soft, warm. Notice the temperature, perfectly comfortable against your skin.",
      "You arrive at the threshold of this place. Perhaps there's a door, or an archway, or simply an opening in the trees. Whatever it is, it welcomes you. It has been waiting for you. And you know, without question, that you are meant to be here.",
      "Step inside. As you cross the threshold, you feel an immediate shift, a deep exhale, as if your whole being is saying, 'Finally, I can rest.' This is your space. No one else can enter unless you invite them. No harm can reach you here. Nothing is demanded of you here.",
      "Take a moment to look around. What do you see? Soft blankets? Books? Windows overlooking a beautiful view? Perhaps there's a comfortable place to sit or lie down. Perhaps there's music playing softly, or the crackle of a fire, or the sound of rain on the roof. Let this place reveal itself to you.",
      "Now, find the most comfortable spot in your sanctuary and settle into it. Feel how perfectly it supports you. Notice how your body begins to release layers of tension you didn't even know you were holding. Here, you can be exactly as you are, no pretending, no performing, no hiding.",
      "As you rest here, imagine that the walls of this sanctuary are woven from threads of protection, compassion, and unconditional love. They are strong but gentle. They keep out what harms, and they hold in what heals. You are completely, utterly safe.",
      "Breathe in the peace of this place. Let it fill your lungs, your bloodstream, every cell of your body. You are not just visiting this sanctuary, you are absorbing it, becoming it. This safety is not outside of you; it is within you. It has always been within you.",
      "If there are worries outside these walls, deadlines, conflicts, fears, acknowledge them gently, and then let them be. They cannot enter here. This is your time to simply be held, to be seen, to be loved exactly as you are. You do not need to earn this. You do not need to prove anything. You are enough, simply because you exist.",
      "Imagine now that a warm, glowing light begins to fill the room. It might be golden, or soft white, or any color that feels healing to you. This light wraps around you like the most comforting embrace you've ever known. It whispers, 'You are safe. You are loved. You are home.'",
      "Rest here for as long as you need. There is no rush. Time moves differently in this sanctuary, slowly, gently, in rhythm with your breath. You could stay here for an eternity, and still, the world outside would wait for you patiently.",
      "As you prepare to leave, take one more deep breath of this peace. Know that this sanctuary is not something you have to search for or travel to. It exists within you, always. In moments of fear, overwhelm, or loneliness, you can close your eyes and return here in an instant. This safety is your birthright.",
      "Before you go, place your hand on your heart. Feel the warmth there. Say to yourself, silently or aloud, 'I carry my sanctuary with me. I am my own safe place. Wherever I go, I am home.' Believe it, because it is true.",
      "Slowly, gently, begin to bring your awareness back to the present. Feel the surface beneath you. Hear the sounds around you. Wiggle your fingers and toes. And when you're ready, open your eyes, knowing that the peace you felt is still with you, woven into your very being.",
    ],
  },
  {
    id: "release-weight",
    title: "The Unburdening",
    description: "A profound journey of release and liberation. Let go of the invisible weights you've been carrying, the old stories, the regrets, the what-ifs, the should-haves. Discover what it feels like to be truly light.",
    duration: "14 minutes",
    icon: Package,
    color: "from-purple-400 to-pink-500",
    script: [
      "Sit comfortably and bring your awareness to your body. Notice where you're holding tension, perhaps in your shoulders, your jaw, your chest. Just notice, without trying to change anything yet. Acknowledge that you've been carrying more than you realize.",
      "Now, close your eyes and imagine that you're standing in a vast, open field at dawn. The sky is painted in soft pinks and golds. The air is cool and clean. In front of you is a path that leads up a gentle hill, and at the top, you can see a horizon that seems to glow with possibility.",
      "As you look down, you notice something you hadn't seen before: you're wearing a backpack. It's old, worn, heavy. You've been carrying it for so long that you forgot it was even there. This backpack holds everything you've been carrying that isn't truly yours to carry.",
      "Take a moment to feel the weight of it. Really feel it pulling on your shoulders, straining your back. This is the weight of old hurts, of words spoken in anger that still echo in your mind. The weight of expectations, from others, from yourself. The weight of regret for roads not taken, of guilt for mistakes made, of fear for what might go wrong tomorrow.",
      "You didn't choose to carry all of this. Some of it was handed to you. Some of it you picked up without realizing. Some of it you've been clinging to because letting go felt too scary, too final, too much like giving up. But here's the truth: you can put it down. Not because you're weak, but because you're strong enough to know you don't need it anymore.",
      "Reach back and slowly, gently, lower the backpack to the ground. Just set it down in the grass. Notice how your body immediately responds, your spine straightening, your shoulders rolling back, your lungs expanding with a fuller breath. Already, you feel different.",
      "Kneel down beside the backpack and open it. One by one, you're going to remove what's inside and leave it here, in this field, where it can no longer weigh you down. The first thing you pull out is a stone. It's labeled 'Regret for the Past.' Hold it in your hands. Feel its weight. This stone represents all the times you've replayed old mistakes, all the 'if onlys' and 'I should haves.' You've carried this long enough.",
      "Say aloud or in your mind: 'I release this. The past is already written, and I cannot change it. What I can do is learn, forgive myself, and move forward.' Place the stone on the ground. Watch as it begins to sink into the earth, absorbed and transformed. It no longer belongs to you.",
      "The next item you pull out is a heavy chain, labeled 'Other People's Expectations.' This is the weight of trying to be who everyone else wanted you to be, the perfect child, the reliable friend, the selfless partner, the high achiever. You've bent yourself into shapes that were never yours. Hold this chain, and then let it go. Say: 'I release the need to be everything to everyone. I am enough as I am.' Drop the chain. It dissolves into dust and blows away on the wind.",
      "Next, you find a crumpled piece of paper labeled 'Fear of the Future.' This is every anxious thought about what might happen tomorrow, next week, next year. Every worst-case scenario you've rehearsed in your mind. It's exhausting, carrying all these imagined disasters. Hold it up to the light and say: 'I cannot control the future, and I release the illusion that I can. I will meet each moment as it comes, with the strength I have in that moment.' Let the paper catch fire, not a destructive fire, but a cleansing one. It burns away completely, leaving no trace.",
      "One by one, you continue to empty the backpack. Out comes 'The Need to Be Perfect.' Out comes 'Guilt for Setting Boundaries.' Out comes 'Resentment Toward Those Who Hurt Me.' Out comes 'Shame for Not Being Further Along.' Each item, you name, you acknowledge, you thank for trying to protect you, and then you release it. You place it down, and it is taken by the earth, by the wind, by the light. It is no longer yours to carry.",
      "Finally, the backpack is empty. Completely empty. You look inside, and all you see is space, open, limitless space. You stand up, and for the first time in what feels like forever, you feel... light. Not empty in a hollow way, but light in a free way. Like you could float. Like you could fly.",
      "Take a deep breath and notice how much more deeply you can breathe now. Notice how your body feels, looser, softer, more open. This is what it feels like to let go. This is what it feels like to choose yourself, your peace, your freedom.",
      "You leave the old backpack there in the field. It's served its purpose. You don't need it anymore. As you walk up the hill toward that glowing horizon, you feel yourself becoming lighter with every step. The sun rises fully now, warm and golden on your face. You are unburdened. You are free. You are new.",
      "Know that whenever you feel the weight returning, and it might, because old patterns are stubborn, you can come back to this field. You can set down what is not yours to carry. You can choose, again and again, to be light.",
      "Slowly bring your awareness back to the room. Feel the ground beneath you. Wiggle your fingers and toes. Place your hand on your heart and say, 'I am lighter now. I choose freedom.' And when you're ready, open your eyes, unburdened, unbound, beautifully, powerfully light.",
    ],
  },
  {
    id: "mountain",
    title: "Mountain of Unwavering Strength",
    description: "Become the mountain, ancient, immovable, and eternal. Embody the profound strength that comes not from resistance, but from deep rootedness. Weather all storms while remaining unshaken at your core.",
    duration: "16 minutes",
    icon: Mountain,
    color: "from-gray-400 to-slate-500",
    script: [
      "Sit in a comfortable position with your spine naturally aligned, not rigid, but dignified. Feel the weight of your body settling into the earth beneath you. Take three slow, grounding breaths, and with each exhale, let yourself become heavier, more rooted, more here.",
      "Now, close your eyes and begin to imagine that you are transforming. Your body is no longer flesh and bone, it is stone. Ancient, enduring stone. You are becoming a mountain.",
      "Feel your base, your sitting bones, your legs, your connection to the ground, becoming the broad, solid foundation of the mountain. This foundation extends deep, deep into the earth, miles down, anchored to the very bedrock of the planet. You are not just sitting on the earth; you are part of it. Inseparable from it.",
      "Your torso becomes the body of the mountain, rising strong and steady from the foundation. Your shoulders and head become the peak, reaching upward toward the sky, but always grounded in the earth below. You are vast. You are immense. You have been here for millions of years, and you will be here for millions more.",
      "As this mountain, you exist in all seasons, in all weathers, in all conditions. Imagine now that it is early morning. The sun is just beginning to rise, painting your slopes in soft gold and rose. The air is cool and still. Birds are beginning to sing. Dew clings to the grasses and wildflowers that dot your sides. You stand silent, witnessing the birth of a new day.",
      "The day grows warmer. The sun climbs higher, bathing you in brilliant light. Hikers walk your trails, marveling at your beauty. Streams trickle down your sides, fed by snowmelt from your peak. You are alive with activity, with life, yet you remain still. Unchanging. You do not reach for the warmth, nor do you recoil from it. You simply allow it to be.",
      "Now, clouds begin to gather. The sky darkens. The wind picks up, howling across your ridges and valleys. Rain begins to fall, first a drizzle, then a downpour. Thunder cracks and echoes. Lightning illuminates the sky. The storm is fierce, powerful, relentless. It batters your slopes, drenches your forests, sends rivers of water cascading down your sides.",
      "But you, the mountain, do not resist. You do not fight the storm. You do not crumble or flee. You simply stand. The storm rages around you, over you, through you, but it cannot move you. You have weathered storms like this a thousand times, a million times. You know that storms do not last. They are temporary visitors, and you are eternal.",
      "This is the truth the mountain teaches: Strength is not about resisting what comes. It is about remaining rooted, steady, and present, no matter what arises. Thoughts, emotions, challenges, they are like weather. They come and they go. But you, at your core, remain.",
      "The storm passes. The clouds part. The sun returns, and with it, a rainbow arcs across the sky, its colors vivid against your stone. Everything is washed clean, fresh, renewed. And you, the mountain, stand as you always have, unmoved, undiminished, serene.",
      "Night falls now. The sky deepens to indigo, then black. Stars emerge, one by one, until the heavens are ablaze with light. The moon rises, full and luminous, casting silver across your snow-covered peak. The world is quiet. Still. Sacred. You rest in this stillness, not sleeping, but simply being. Witnessing. Holding space for all that exists beneath your vast, silent gaze.",
      "Seasons change. Autumn arrives, painting your forests in reds and golds. Winter comes, blanketing you in snow and ice. The wind howls, harsh and bitter. Your peak disappears into clouds. Yet beneath the snow, beneath the ice, you remain. Solid. Warm in your depths. Alive. The cold cannot touch your core.",
      "Spring returns. Snow melts. Wildflowers bloom across your meadows, purple lupines, yellow sunflowers, delicate white columbines. Life bursts forth from every crack and crevice. Birds nest in your trees. Deer graze on your slopes. You are a refuge, a sanctuary, a home for countless beings. And still, you remain as you are, strong, grounded, unchanging in essence, even as the world around you transforms endlessly.",
      "Now, bring your awareness back to your body. But do not abandon the mountain. Carry it with you. You are not merely sitting, you are the mountain. Your breath is the wind moving through the valleys. Your heartbeat is the slow, steady rhythm of the earth itself. Your thoughts and feelings are clouds, weather, seasons, they pass, but they do not define you.",
      "Know this deeply: No matter what storms come in your life, grief, fear, anger, uncertainty, you have within you the strength of the mountain. You cannot be shaken at your core. You cannot be eroded by temporary conditions. You are rooted in something far deeper than circumstance. You are ancient. You are enduring. You are unshakable.",
      "Take one more deep breath as the mountain. Feel your immensity, your stability, your quiet power. And then, slowly, gently, begin to return to the room. Wiggle your fingers and toes. Feel the surface beneath you. When you're ready, open your eyes, but carry the mountain within you. Stand like the mountain. Breathe like the mountain. Live like the mountain. Rooted, present, and unshaken by the storms.",
    ],
  },
];

// Daily Mindfulness Challenges
export const mindfulnessChallenges: MindfulnessChallenge[] = [
  {
    id: "stillness-60",
    title: "60 Seconds of Stillness",
    description: "Sit completely still for one minute, observing your breath",
    xp: 10,
    completed: false,
  },
  {
    id: "three-things",
    title: "Name 3 Things",
    description:
      "Notice and name 3 things you can see, hear, and feel right now",
    xp: 15,
    completed: false,
  },
  {
    id: "conscious-breath",
    title: "One Conscious Breath",
    description:
      "Take one completely conscious breath, noticing every sensation",
    xp: 5,
    completed: false,
  },
  {
    id: "gratitude-moment",
    title: "Gratitude Pause",
    description:
      "Pause and identify 3 things you're grateful for in this moment",
    xp: 15,
    completed: false,
  },
  {
    id: "body-scan",
    title: "Quick Body Scan",
    description: "Scan your body from head to toe, releasing tension",
    xp: 20,
    completed: false,
  },
  {
    id: "mindful-sip",
    title: "Mindful Sip",
    description: "Drink water or tea with complete awareness of each sensation",
    xp: 10,
    completed: false,
  },
  {
    id: "loving-kindness",
    title: "Send Kindness",
    description: "Send a kind thought to yourself and someone else",
    xp: 15,
    completed: false,
  },
];
