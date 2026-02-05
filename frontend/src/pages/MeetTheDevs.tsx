import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Code, Heart, Coffee, Users, Sparkles, ArrowLeft, Globe, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Nate from "../assets/images/logo.jpg";
import Gareth from "../assets/images/Gareth.jpeg";
import Haley from "../assets/images/Haley.jpeg";

// Ambient colors for the team page
const teamAmbience = {
  primary: 'rgba(99, 102, 241, 0.20)',     // Indigo
  secondary: 'rgba(168, 85, 247, 0.18)',   // Purple
  accent: 'rgba(236, 72, 153, 0.15)',      // Pink
  warm: 'rgba(251, 146, 60, 0.12)',        // Orange
};

interface DeveloperProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  links: {
    github?: string;
    linkedin?: string;
    website?: string;
    insta?: string;
    email?: string;
  };
  skills: string[];
}

const Developer = ({
  name = "Developer Name",
  role = "Role Title",
  bio = "Short bio about the developer.",
  imageUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  links = {},
  skills = ["React", "TypeScript", "UI/UX"],
}: DeveloperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="w-full"
    >
      <div className="overflow-hidden bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Photo & Info */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <motion.div
                className="aspect-square overflow-hidden rounded-2xl border-4 border-white/30 shadow-xl mx-auto max-w-[180px] backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-purple-100 text-sm mt-1">{role}</p>
                <div className="flex justify-center mt-4 space-x-2 flex-wrap gap-2">
                  {links.github && (
                    <motion.a
                      href={links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-colors"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </motion.a>
                  )}
                  {links.linkedin && (
                    <motion.a
                      href={links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </motion.a>
                  )}
                  {links.website && (
                    <motion.a
                      href={links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-colors"
                      title="Portfolio"
                    >
                      <Globe className="h-4 w-4" />
                    </motion.a>
                  )}
                  {links.insta && (
                    <motion.a
                      href={links.insta}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </motion.a>
                  )}
                  {links.email && (
                    <motion.a
                      href={`mailto:${links.email}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-colors"
                      title="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Bio & Skills */}
          <div className="w-full md:w-2/3 p-6 sm:p-8">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100">
                  <Users className="h-4 w-4 text-indigo-600" />
                </span>
                About
              </h4>
              <p className="text-gray-600 leading-relaxed">{bio}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </span>
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// The Developers Nav
export const MeetTheDevsNav = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg"
          >
            <Code className="h-5 w-5 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meet Our Team
          </h1>
        </div>
        <Button
          variant="outline"
          asChild
          className="bg-white/50 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl transition-all"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
      </div>
    </header>
  );
};

// The Join Us Section
export const JoinUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/70 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg p-8 sm:p-10 text-center mb-12 relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Join Our Mission
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We're a small passion project built on the belief that mental wellness
          should be engaging and accessible to everyone. While JournalXP isn't a
          paid opportunity, it's a space where anyone who shares our mission is
          welcome to contribute. Whether you're a developer, designer, writer,
          or just passionate about mental health, your help can make a real
          impact.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all px-6"
            >
              <Link to="/help-opportunities">
                View Help Opportunities
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl transition-all"
            >
              Contact Us
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 rounded-xl transition-all"
              asChild
            >
              <a href="https://github.com/Simpleboi/JournalXP" target="_blank" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// The Footer
export const TeamFooter = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-white/50 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-700 font-medium">JournalXP - Your Mental Health Companion</p>
        <p className="mt-2 text-gray-500 flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-pink-500 fill-pink-500" /> by our
          dedicated team
        </p>
        <p className="mt-3 text-xs text-gray-400">
          © {new Date().getFullYear()} JournalXP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// Value Card Component
const ValueCard = ({
  icon: Icon,
  title,
  description,
  color,
  delay
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) => {
  const colorClasses: Record<string, { bg: string; icon: string }> = {
    indigo: { bg: 'from-indigo-50 to-blue-50', icon: 'from-indigo-500 to-blue-600' },
    purple: { bg: 'from-purple-50 to-violet-50', icon: 'from-purple-500 to-violet-600' },
    pink: { bg: 'from-pink-50 to-rose-50', icon: 'from-pink-500 to-rose-600' },
  };

  const classes = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${classes.bg} backdrop-blur-md border-2 border-white/60 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300`}
    >
      <motion.div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${classes.icon} flex items-center justify-center mb-5 shadow-lg`}
        whileHover={{ scale: 1.05, rotate: 5 }}
      >
        <Icon className="h-7 w-7 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// The Developers Section
const MeetTheDevelopers = () => {
  const developers: DeveloperProps[] = [
    {
      name: "Nathaniel Paz",
      role: "Lead Developer & Creator",
      bio: "Nathaniel, or Nate, founded JournalXP after his own mental health journey revealed how powerful journaling and reflection can be for personal growth. As a computer science student and passionate web developer, he combined his technical skills with a genuine desire to help others take control of their mental well-being. With a focus on simplicity, mindfulness, and positive reinforcement, Nate created JournalXP to make self-care feel engaging, rewarding, and accessible to everyone.",
      imageUrl: Nate,
      links: {
        github: "https://github.com/Natejsx",
        linkedin: "https://www.linkedin.com/in/nathaniel-paz-182470386/?trk=opento_sprofile_topcard",
        website: "https://natejsx.dev/",
        insta: "https://www.instagram.com/n8.jsx/",
        email: "natejsx@gmail.com",
      },
      skills: [
        "React.js",
        "TypeScript",
        "UI/UX Design",
        "Web Development",
        "TailwindCSS"
      ],
    },
    {
      name: "Haley Baugh",
      role: "Psychology Student & Mental Health advocate",
      bio: "With a background in psychology and user experience research, Haley ensures that JournalXP's features are grounded in mental health best practices. She conducts user interviews and stays current with research to make our app truly beneficial for users' wellbeing.",
      imageUrl:
        Haley,
      links: {
        insta: "https://www.instagram.com/haley_130",
      },
      skills: [
        "Cognitive & Behavioral Insight",
        "User Mental-Wellness Guidance",
        "Emotional Safety Review",
        "Psychological Research Literacy",
      ],
    },
    {
      name: "Gareth Martinez",
      role: "Brand Designer & Marketing Strategist",
      bio: "Gareth Martinez is a marketing major with minors in digital media and fine art studios who supports JournalXP by strengthening its brand presence and community engagement. With a strong creative mindset and an ability to think outside the box, Gareth helps bring JournalXP’s mission to life through visually welcoming marketing content that captures attention and encourages interaction. Outside of JournalXP, Gareth serves as Vice President of two UHCL organizations: the Board Game Association and the Digital Art & Illustration Organization. He enjoys cats, fashion, and all forms of creative expression.",
      imageUrl:
        Gareth,
      links: {
        insta: "https://www.instagram.com/grizzteeth",
        email: "grizzteeth06@outlook.com",
        website: "https://1drv.ms/p/c/8c5a8c8063d9f592/IQADIbzqZuoSSZ2SiqqqGeuHAcZtYSieCMHNDg3oSiYNjWk?e=qeXYJ5"
      },
      skills: [
        "Marketing Strategy",
        "Digital Media Creation",
        "Community Engagement",
        "Event Promotion",
        "Accessibility",
      ],
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: teamAmbience.primary }}
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
          style={{ background: teamAmbience.secondary }}
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
          style={{ background: teamAmbience.accent }}
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
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: teamAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      {/* Header */}
      <MeetTheDevsNav />

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
            The Minds Behind{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the passionate team dedicated to improving your mental
            wellbeing through technology, design, and evidence-based practices.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-16 max-w-5xl mx-auto">
          {developers.map((developer, index) => (
            <Developer key={index} {...developer} />
          ))}
        </div>

        {/* Join Us Section */}
        <div className="max-w-4xl mx-auto">
          <JoinUs />
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          <ValueCard
            icon={Heart}
            title="User-Centered"
            description="Everything we build starts with you in mind. We regularly gather feedback and conduct research to ensure JournalXP truly serves your mental health needs."
            color="indigo"
            delay={0.3}
          />
          <ValueCard
            icon={Code}
            title="Evidence-Based"
            description="Our features are grounded in psychological research and best practices. We collaborate with mental health professionals to ensure our approach is both effective and ethical."
            color="purple"
            delay={0.4}
          />
          <ValueCard
            icon={Coffee}
            title="Sustainable Growth"
            description="We're committed to growing responsibly. Rather than chasing quick profits, we focus on building a platform that can sustainably support your mental health journey for years to come."
            color="pink"
            delay={0.5}
          />
        </div>
      </main>

      {/* Footer */}
      <TeamFooter />
    </div>
  );
};

export default MeetTheDevelopers;
