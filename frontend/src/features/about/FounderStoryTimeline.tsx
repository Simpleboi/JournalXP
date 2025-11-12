import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Code, Rocket, TrendingDown, Users } from "lucide-react";

const timelineEvents = [
  {
    year: "2024",
    title: "The Beginning",
    description: "I started working on this project after facing some of the darkest moments of my life. At one point, I nearly lost my own battle with mental health. Tragically, a good friend of mine, Jacobe Cook, did lose his life, and his passing became the driving force that pushed me to finish this project.",
    icon: TrendingDown,
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gray-50",
  },
  {
    year: "2024",
    title: "A Light in the Dark",
    description: "Mental health and emotional well-being are deeply important, yet so many of us feel alone in our struggles. For a long time, I felt stuck in a heavy depression, unsure of how to move forward. Journaling became a small but meaningful step toward healing, a way to reflect, release, and rediscover myself.",
    icon: Heart,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-50",
  },
  {
    year: "2024",
    title: "Healing Through Journaling",
    description: "I know I'm not the only one walking that path. That's why I created JournalXP, a space where mental wellness becomes something you can nurture, track, and even feel proud of, like leveling up in a game.",
    icon: Lightbulb,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
  },
  {
    year: "2025",
    title: "The Vision Behind JournalXP",
    description: "Here at JournalXP, the mission is to make mental health care more engaging, approachable, and empowering. Through game-like features, mental-health tools, and intentional design, I want to help you reflect on your journey and grow, one entry at a time.",
    icon: Code,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
  },
  {
    year: "2025",
    title: "Growing With the Community",
    description: "JournalXP is built with the community in mind. Your feedback is incredibly important to its growth. If you have a comment, concern, or ideas for improvement, please take a moment to fill out the Feedback Form located under this tab.",
    icon: Rocket,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
  },
  {
    year: "Today",
    title: "Helping Others Heal",
    description: "Building this project has helped me heal, and my hope is that it can do the same for others. Because your mental health matters, and you deserve to grow with every entry.",
    icon: Users,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
  },
];

export const FounderStoryTimeline = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          The Journey Behind JournalXP
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Hi, I'm{" "}
          <a
            href="https://natejsx.dev/"
            target="_blank"
            className="text-indigo-600 hover:text-indigo-700 underline font-semibold"
          >
            Nate
          </a>
          , the creator of JournalXP. This is the story of how pain became purpose.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 via-purple-300 to-green-300"></div>

        {/* Timeline events */}
        <div className="space-y-12">
          {timelineEvents.map((event, index) => {
            const Icon = event.icon;
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Content */}
                <div className={`flex-1 ${isLeft ? "md:pr-12 pl-16" : "md:pl-12 pl-16"} md:pl-0`}>
                  <Card className={`${event.bgColor} border-2`}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${event.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600">{event.year}</span>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${event.color} border-4 border-white shadow-lg z-10`}></div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pull Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 max-w-3xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardContent className="p-8">
            <blockquote className="text-2xl md:text-3xl font-bold text-center text-gray-900 italic">
              "Your mental health matters, and you deserve to grow with every entry."
            </blockquote>
            <p className="text-center text-gray-600 mt-4">— Nathaniel Paz, Founder</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
