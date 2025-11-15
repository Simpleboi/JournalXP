import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Brain, Target, BarChart3, PawPrint, Users, CheckSquare, Sparkles } from "lucide-react";
import { RankShowcase } from "./RankShowcase";

const features = [
  {
    id: "journaling",
    icon: Book,
    title: "Smart Journaling",
    stat: "30 XP per entry",
    description: "Your digital journal that helps you process thoughts, track emotions, and reflect on your day. Choose from three different journaling modes designed for different mental health needs.",
    whatItIs: "A private, secure space to write down your thoughts, feelings, and experiences. Unlike paper journals, this digital journal tracks your mood, counts your words, and helps you discover patterns in your mental health over time.",
    howToUse: [
      "Click 'Journal' from the main dashboard or navigation menu",
      "Choose your journaling mode: Free Writing (blank canvas), Guided (writing prompts), or Gratitude (thankfulness practice)",
      "Select your current mood from the mood selector at the bottom",
      "Start typing your thoughts, there's no right or wrong way to journal",
      "Click 'Save Entry' when finished, you'll earn 30 XP for completing an entry",
      "View your past entries in the 'Reflections' tab with calendar view"
    ],
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
  },
  // {
  //   id: "sunday",
  //   icon: Brain,
  //   title: "AI Wellness Companion",
  //   stat: "24/7 Support",
  //   description: "Meet Sunday, your personal AI wellness companion powered by advanced GPT-4o technology. Sunday provides empathetic, thoughtful responses to help you work through challenges, celebrate wins, and maintain perspective.",
  //   whatItIs: "Sunday is like having a compassionate friend who's always available to talk. It's an AI chatbot specifically trained in mental wellness support that remembers your entire journey with JournalXP and provides personalized guidance based on your journal entries, mood patterns, and habits.",
  //   howToUse: [
  //     "Click 'Sunday' from the main dashboard - it's the brain icon card",
  //     "Type any message in the chat box at the bottom - share how you're feeling, ask for advice, or discuss a challenge",
  //     "Sunday will respond thoughtfully, often referencing your journal history and patterns",
  //     "Have a natural conversation - you can ask follow-up questions or change topics anytime",
  //     "Sunday is NOT a replacement for professional therapy, but a supportive tool for daily check-ins",
  //     "If you're in crisis, Sunday will provide emergency resources and encourage you to seek professional help"
  //   ],
  //   color: "from-blue-500 to-blue-700",
  //   bgColor: "bg-blue-50",
  // },
  {
    id: "habits",
    icon: Target,
    title: "Habit Tracking",
    stat: "Custom Goals",
    description: "Build lasting positive habits with our gamified tracking system. Set custom goals, maintain streaks, earn XP rewards, and watch as consistency transforms your mental wellness journey.",
    whatItIs: "A tool that helps you build and maintain healthy habits by tracking your progress over time. Each habit can be set to daily, weekly, or monthly frequency, and you earn experience points (XP) every time you complete one. The system uses streak tracking (consecutive days of completion) to motivate consistency.",
    howToUse: [
      "Click 'Habit Tracker' from the dashboard",
      "Click 'Create New Habit' button to add your first habit",
      "Enter a title (e.g., '10 minutes of meditation', 'Drink 8 glasses of water')",
      "Choose frequency: Daily (every day), Weekly (once per week), or Monthly (once per month)",
      "Select a category: Mindfulness, Physical, Social, Productivity, or Custom",
      "Set how many times you want to complete this habit to reach your goal",
      "Each day, click the checkmark button to mark the habit as complete - you'll earn XP instantly",
      "Watch your streak counter grow as you complete habits consistently"
    ],
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
  },
  {
    id: "tasks",
    icon: CheckSquare,
    title: "Daily Tasks",
    stat: "20 XP per task",
    description: "Stay organized and productive with task management designed for mental wellness. Create, prioritize, and complete daily tasks while earning XP rewards and building momentum.",
    whatItIs: "A to-do list system that helps you manage daily responsibilities while gamifying productivity. Unlike regular task apps, this system is designed to support mental health by preventing overwhelm - you can set priority levels, due dates, and earn XP for completing tasks, which motivates you to tackle even small wins.",
    howToUse: [
      "Click 'Daily Tasks' from the main dashboard",
      "Click 'Add Task' or the '+' button to create a new task",
      "Enter a task title (e.g., 'Call therapist', 'Buy groceries', 'Send work email')",
      "Optionally add a description for more details about the task",
      "Set priority level: High (urgent/important), Medium (normal), or Low (when you have time)",
      "Optionally set a due date and time to get reminders",
      "Click 'Create Task' to add it to your list",
      "Mark tasks as complete by clicking the checkbox - you'll earn 20 XP instantly",
      "View task statistics in the dashboard to track your completion rate and productivity patterns"
    ],
    color: "from-teal-500 to-teal-700",
    bgColor: "bg-teal-50",
  },
  {
    id: "meditation",
    icon: Sparkles,
    title: "Meditation Room",
    stat: "Guided Practice",
    description: "Find calm and clarity with guided meditation exercises, breathing techniques, and mindfulness practices. Your personal sanctuary for stress relief and emotional regulation.",
    whatItIs: "A collection of meditation and mindfulness tools designed to help you manage anxiety, process difficult emotions, and find inner peace. It includes guided breathing exercises with visual timers, daily affirmations you can save, and emotion-specific meditation guides (for anger, sadness, anxiety, stress, loneliness, and overwhelm) with journaling prompts.",
    howToUse: [
      "Click 'Meditation' or 'Meditation Room' from the dashboard",
      "Choose from three main sections: Breathing Exercises, Daily Inspiration, or Emotional Support",
      "For Breathing: Select a duration (1, 3, 5, or 10 minutes), follow the visual breathing guide (inhale/hold/exhale)",
      "For Daily Inspiration: Read the displayed quote, click 'New Quote' to refresh, or 'Save Quote' to keep favorites",
      "For Emotional Support: Click on the emotion you're feeling (Anger, Sadness, Anxiety, etc.)",
      "A modal will open with breathing techniques, grounding exercises, and body awareness tips for that emotion",
      "Scroll down to see journal prompts - use the carousel arrows to browse different prompts",
      "Write your reflection in the text area and click 'Save to Journal' to earn 30 XP",
      "Your saved entry will be marked as 'guided' type and tagged with the emotion you selected"
    ],
    color: "from-violet-500 to-violet-700",
    bgColor: "bg-violet-50",
  },
  // {
  //   id: "analytics",
  //   icon: BarChart3,
  //   title: "Insights & Analytics",
  //   stat: "AI-Powered",
  //   description: "Unlock deep understanding of your mental health patterns with AI-powered analytics. Discover mood trends, identify triggers, detect potential burnout, and see correlations between different aspects of your wellness journey.",
  //   whatItIs: "An intelligent dashboard that analyzes all your JournalXP data (journal entries, moods, habits, tasks) to find meaningful patterns and provide actionable insights. Think of it as having a data scientist looking at your mental health journey and pointing out important trends you might miss.",
  //   howToUse: [
  //     "Click 'Insights' or 'Analytics' from the main dashboard",
  //     "View your overall Wellness Score (0-100) broken down into 4 dimensions: Mental, Physical, Social, and Productivity",
  //     "Scroll through AI-generated recommendations ranked by priority (High, Medium, Low)",
  //     "Check the 'Mood Trends' chart to see how your emotions have changed over time",
  //     "Review 'Behavioral Patterns' to understand what habits or activities correlate with better moods",
  //     "Pay attention to 'Risk Factors' section which warns about potential burnout or negative patterns",
  //     "Use insights to make informed decisions about what habits to focus on or what to discuss with Sunday"
  //   ],
  //   color: "from-indigo-500 to-indigo-700",
  //   bgColor: "bg-indigo-50",
  // },
  // {
  //   id: "pet",
  //   icon: PawPrint,
  //   title: "Virtual Pet",
  //   stat: "Quest System",
  //   description: "Adopt and care for a virtual companion that grows alongside your wellness journey. Your pet's happiness and health reflect your own self-care habits, making mental health maintenance fun and engaging.",
  //   whatItIs: "A gamification feature where you have a virtual pet (choose from Cat, Dog, Turtle, Bird, or Rabbit) that you care for by completing your real-life wellness activities. The pet has stats like Health, Happiness, Trust Bond, and Energy that increase when you journal, complete habits, or finish tasks. It's designed to make self-care feel less like a chore and more like caring for something you love.",
  //   howToUse: [
  //     "Click 'Virtual Pet' from the dashboard to visit your pet",
  //     "If you're new, you'll first choose your pet type and give it a name",
  //     "View your pet's stats in the corner: Health, Happiness, Trust Bond, Energy, and Streak",
  //     "Care for your pet by clicking action buttons: Feed (increases health), Play (increases happiness), Clean (maintains hygiene)",
  //     "Your pet automatically gets healthier when YOU do wellness activities (journaling, habits, tasks)",
  //     "Complete quests shown on the right side to earn rewards like accessories, toys, and points",
  //     "If you neglect your wellness AND your pet, it may become sad or unhealthy - but you can always revive it",
  //     "Shop for items in the Pet Shop to customize your companion"
  //   ],
  //   color: "from-pink-500 to-pink-700",
  //   bgColor: "bg-pink-50",
  // },
  // {
  //   id: "community",
  //   icon: Users,
  //   title: "Anonymous Community",
  //   stat: "Safe Space",
  //   description: "Connect with others on similar wellness journeys in a completely anonymous, judgment-free environment. Share reflections, offer support, and receive encouragement without revealing your identity.",
  //   whatItIs: "A social feature where you can post short reflections (like Twitter, but for mental health) completely anonymously - no usernames, no profile pictures, nothing tied to your identity. All posts are moderated by AI to filter harmful content, and you can filter posts by mood to find supportive messages when you need them.",
  //   howToUse: [
  //     "Click 'Community' from the main dashboard",
  //     "Browse posts from others in the feed - they're all anonymous",
  //     "Filter by mood at the top: Grateful, Hopeful, Peaceful, Inspired, or Loved",
  //     "Click the heart/support button on posts that resonate with you to show support",
  //     "To post your own reflection, click 'Share a Reflection' button",
  //     "Write your message (280 characters max) and select the mood it represents",
  //     "Your post will be published anonymously - no one can see who wrote it, including you later",
  //     "Reply to posts to start supportive conversations in the comment threads",
  //     "Remember: This is NOT a crisis support line - if you're in emergency, seek professional help"
  //   ],
  //   color: "from-orange-500 to-orange-700",
  //   bgColor: "bg-orange-50",
  // },
];

export const FeatureShowcase = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <div id="get-started" className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to Thrive
        </h2>
        <p className="text-xl text-gray-600">
          Powerful mental health tools, gamified for engagement
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedFeature.id === feature.id;

          return (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-lg transform scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.stat}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Feature Detail */}
      <Card className={`${selectedFeature.bgColor} border-2`}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center flex-shrink-0`}>
              {React.createElement(selectedFeature.icon, {
                className: "h-10 w-10 text-white",
              })}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-bold text-gray-900">{selectedFeature.title}</h3>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700">
                  {selectedFeature.stat}
                </span>
              </div>
              <p className="text-lg text-gray-700 mb-6">{selectedFeature.description}</p>

              {/* What it is section */}
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  What it is
                </h4>
                <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg">
                  {selectedFeature.whatItIs}
                </p>
              </div>

              {/* How to use section */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  How to use it (Step-by-step)
                </h4>
                <div className="space-y-3">
                  {selectedFeature.howToUse.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white/50 p-3 rounded-lg">
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${selectedFeature.color} text-white font-bold flex items-center justify-center text-sm`}>
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      {/* <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Ready to start your wellness journey?</p>
        <a
          href="/signup"
          className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started Free →
        </a>
      </div> */}

      {/* Rank Progression Showcase */}
      <div className="mt-20">
        <RankShowcase />
      </div>
    </div>
  );
};
