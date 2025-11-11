import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Lightbulb, Code, Rocket, TrendingDown, Users } from "lucide-react";

const timelineEvents = [
  {
    year: "2023",
    title: "The Darkness",
    description: "Facing the darkest moments of my life, struggling with depression and feeling alone in the battle.",
    icon: TrendingDown,
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gray-50",
  },
  {
    year: "2023",
    title: "A Loss That Changed Everything",
    description: "The tragic loss of my friend Jacobe Cook became the driving force to finish this project and help others.",
    icon: Heart,
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-50",
  },
  {
    year: "2023",
    title: "Discovery: Journaling as Healing",
    description: "Finding that journaling was a small but meaningful step toward healing—a way to reflect, release, and rediscover myself.",
    icon: Lightbulb,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
  },
  {
    year: "2024",
    title: "Building JournalXP",
    description: "Channeling pain into purpose, building a space where mental wellness becomes engaging and empowering.",
    icon: Code,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
  },
  {
    year: "2024",
    title: "Launch & Growth",
    description: "Launching to the public and watching the community grow, one user at a time.",
    icon: Rocket,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
  },
  {
    year: "Today",
    title: "Helping 4,000+ Users",
    description: "Building this project has helped me heal, and my hope is that it can do the same for others.",
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
            <p className="text-center text-gray-600 mt-4">— Nathaniel E. Paz, Founder</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
