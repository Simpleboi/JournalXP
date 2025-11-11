import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Sarah M.",
    level: 42,
    streak: 87,
    quote: "JournalXP literally saved my life. I was spiraling into depression and this app gave me a reason to wake up every day. The streak system kept me accountable, and Sunday helped me process feelings I couldn't put into words.",
    rating: 5,
    avatar: "🦋",
  },
  {
    name: "Marcus T.",
    level: 28,
    streak: 56,
    quote: "As a college student dealing with anxiety, JournalXP became my safe space. The gamification made self-care actually fun instead of feeling like another chore. My therapist even noticed the improvement!",
    rating: 5,
    avatar: "🌟",
  },
  {
    name: "Emily R.",
    level: 65,
    streak: 142,
    quote: "I've tried every journaling app out there. JournalXP is different—it feels like it was built by someone who actually understands mental health struggles. The insights helped me spot patterns I never saw before.",
    rating: 5,
    avatar: "🌸",
  },
  {
    name: "David L.",
    level: 19,
    streak: 34,
    quote: "The virtual pet and XP system might sound childish, but they work. I'm a 45-year-old man who finally found a way to stick with journaling. This app made me care about my mental health.",
    rating: 5,
    avatar: "🎯",
  },
  {
    name: "Priya K.",
    level: 51,
    streak: 98,
    quote: "After losing my mom, I couldn't find words to express my grief. Sunday's AI was surprisingly comforting, and the community made me feel less alone. JournalXP gave me tools to heal at my own pace.",
    rating: 5,
    avatar: "💜",
  },
];

export const SocialProof = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Real Stories, Real Impact
        </h2>
        <p className="text-xl text-gray-600">
          Join thousands who transformed their mental health journey
        </p>
      </div>

      {/* Featured Testimonial Carousel */}
      <div className="mb-16 relative">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0 hidden md:block">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-4xl">
                      {testimonials[currentIndex].avatar}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Quote className="h-8 w-8 text-purple-400 mb-4" />
                    <p className="text-xl md:text-2xl text-gray-800 mb-6 italic">
                      "{testimonials[currentIndex].quote}"
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="font-bold text-gray-900">{testimonials[currentIndex].name}</p>
                        <p className="text-sm text-gray-600">
                          Level {testimonials[currentIndex].level} • {testimonials[currentIndex].streak}-day streak
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? "bg-purple-600 w-8" : "bg-purple-300"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-blue-900 mb-2">4,203</div>
            <p className="text-sm text-blue-700">Active Users</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-green-900 mb-2">87%</div>
            <p className="text-sm text-green-700">Improved Mental Health</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-purple-900 mb-2">12,847</div>
            <p className="text-sm text-purple-700">Journal Entries</p>
          </CardContent>
        </Card>

        <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-4xl font-bold text-yellow-900 mb-2">4.9/5</div>
            <p className="text-sm text-yellow-700">Average Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Wall of Love - Grid of short testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "This app changed everything 🙏 Finally something that makes mental health fun"
            </p>
            <p className="text-xs text-gray-500">— Alex, Level 33</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "Best decision I ever made. My therapist is impressed with my progress!"
            </p>
            <p className="text-xs text-gray-500">— Jordan, Level 47</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "The AI companion (Sunday) feels more human than some real people. Incredible."
            </p>
            <p className="text-xs text-gray-500">— Sam, Level 29</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "Free, no ads, actually cares about users. Unheard of in 2024. Thank you!"
            </p>
            <p className="text-xs text-gray-500">— Taylor, Level 55</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "I've maintained my streak for 6 months. Never thought I could be this consistent."
            </p>
            <p className="text-xs text-gray-500">— Riley, Level 68</p>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700 italic mb-2">
              "The insights feature predicted my burnout before I even realized it. Mind-blowing."
            </p>
            <p className="text-xs text-gray-500">— Casey, Level 41</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
