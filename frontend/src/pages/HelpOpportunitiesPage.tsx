import { motion } from "framer-motion";
import {
  ArrowLeft,
  Code2,
  Palette,
  Heart,
  TrendingUp,
  Mail,
  CheckCircle2,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ambience = {
  primary: 'rgba(99, 102, 241, 0.20)',
  secondary: 'rgba(168, 85, 247, 0.18)',
  accent: 'rgba(236, 72, 153, 0.15)',
  warm: 'rgba(251, 146, 60, 0.12)',
};

interface OpportunityCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  requirements: string[];
  gradient: string;
  iconBg: string;
  delay: number;
}

const OpportunityCard = ({
  title,
  icon: Icon,
  description,
  requirements,
  gradient,
  iconBg,
  delay
}: OpportunityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <div className="h-full overflow-hidden bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <div className="p-6">
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center mb-5 shadow-lg`}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Icon className="h-7 w-7 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed mb-5">{description}</p>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">What we're looking for:</h4>
            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const opportunities: Omit<OpportunityCardProps, 'delay'>[] = [
  {
    title: "Full-Stack Developer",
    icon: Code2,
    description: "Join our development team to help build and improve JournalXP's features. You'll work on both the frontend and backend, creating meaningful experiences for our users.",
    requirements: [
      "Experience with React and TypeScript",
      "Familiarity with Firebase (Firestore, Auth, Functions)",
      "Node.js backend development",
      "Passion for mental health and wellness",
    ],
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "from-blue-500 to-indigo-600",
  },
  {
    title: "UI/UX Designer",
    icon: Palette,
    description: "Help us create beautiful, intuitive, and accessible designs that make journaling and self-reflection a delightful experience for everyone.",
    requirements: [
      "Strong portfolio showcasing UI/UX work",
      "Experience with design tools (Figma, Sketch, etc.)",
      "Understanding of accessibility best practices",
      "Interest in mental health app design",
    ],
    gradient: "from-purple-500 to-pink-600",
    iconBg: "from-purple-500 to-pink-600",
  },
  {
    title: "Mental Health Specialist",
    icon: Heart,
    description: "Guide our content creation to ensure JournalXP provides safe, effective, and evidence-based mental wellness resources for our community.",
    requirements: [
      "Background in psychology, counseling, or related field",
      "Experience creating mental health content",
      "Understanding of ethical considerations in wellness apps",
      "Passion for making mental health accessible",
    ],
    gradient: "from-rose-500 to-orange-500",
    iconBg: "from-rose-500 to-orange-500",
  },
  {
    title: "Sponsors & Investors",
    icon: TrendingUp,
    description: "Partner with us to support the growth of JournalXP. Your investment helps us reach more people and expand our mental wellness platform.",
    requirements: [
      "Interest in mental health technology",
      "Alignment with our mission and values",
      "Long-term partnership mindset",
      "Desire to make a positive impact",
    ],
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "from-emerald-500 to-teal-600",
  },
];

const HelpOpportunitiesPage = () => {
  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: ambience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: ambience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: ambience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg"
            >
              <Users className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Help Opportunities
            </h1>
          </div>
          <Button
            variant="outline"
            asChild
            className="bg-white/50 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl transition-all"
          >
            <Link to="/team" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Join Our{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            JournalXP is a passion project dedicated to making mental wellness accessible and engaging.
            We're looking for volunteers who share our vision and want to make a difference.
          </p>
          <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto">
            Note: These are volunteer positions. JournalXP is a non-commercial project focused on helping others.
          </p>
        </motion.div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 max-w-5xl mx-auto">
          {opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.title}
              {...opportunity}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg p-8 sm:p-10 text-center max-w-3xl mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Mail className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Interested?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If any of these opportunities resonate with you, we'd love to hear from you!
              Reach out and tell us a bit about yourself and how you'd like to contribute.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all px-8"
              >
                <a href="mailto:n8thegr8.jsx@gmail.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-white/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 font-medium">JournalXP - Your Mental Health Companion</p>
          <p className="mt-3 text-xs text-gray-400">
            &copy; {new Date().getFullYear()} JournalXP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HelpOpportunitiesPage;
