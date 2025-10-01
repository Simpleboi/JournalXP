export const sundayResponses = [
  {
    triggers: ["sad", "down", "depressed", "low"],
    responses: [
      "I hear that you're feeling down right now. That takes courage to share. Can you tell me more about what's been weighing on your mind?",
      "It sounds like you're going through a difficult time. Remember that it's okay to feel sad - these emotions are valid. What do you think might help you feel a little lighter today?",
      "Thank you for trusting me with how you're feeling. Sometimes when we're feeling low, it helps to focus on small, manageable steps. What's one tiny thing that usually brings you comfort?",
    ],
    mood: "supportive" as const,
  },
  {
    triggers: ["anxious", "worried", "stress", "panic", "nervous"],
    responses: [
      "I can sense the anxiety in your words. Let's take a moment together. Can you try taking three deep breaths with me? In for 4, hold for 4, out for 6. What's making you feel most anxious right now?",
      "Anxiety can feel overwhelming, but you're not alone in this. Let's break down what you're worried about. Sometimes naming our fears can help reduce their power over us.",
      "I notice you're feeling anxious. That's a very human response to uncertainty. What would it feel like to give yourself permission to feel worried without judgment?",
    ],
    mood: "gentle" as const,
  },
  {
    triggers: ["happy", "good", "great", "excited", "joy"],
    responses: [
      "I love hearing the joy in your message! It's wonderful that you're feeling good. What's been contributing to this positive feeling?",
      "Your happiness is contagious! I'm so glad you're having a good day. What would you like to do to celebrate or maintain this feeling?",
      "It's beautiful to witness your joy. These moments of happiness are precious - how can we help you remember this feeling when times get tough?",
    ],
    mood: "encouraging" as const,
  },
  {
    triggers: ["confused", "lost", "don't know", "uncertain"],
    responses: [
      "Feeling uncertain is part of being human. It's okay not to have all the answers right now. What's one small thing you do feel sure about?",
      "Confusion can actually be a sign that you're growing and questioning things - that's healthy. What's the most confusing part of what you're experiencing?",
      "Sometimes when we feel lost, it helps to focus on our values and what matters most to us. What are some things that feel important to you right now?",
    ],
    mood: "reflective" as const,
  },
];

export const defaultResponses = [
  "That's really interesting. Can you tell me more about that?",
  "I appreciate you sharing that with me. How does that make you feel?",
  "It sounds like you've been thinking about this a lot. What stands out most to you?",
  "Thank you for being so open. What would you like to explore about this?",
  "I'm here to listen. What feels most important for you to talk about right now?",
];
