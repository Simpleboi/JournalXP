import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Code, Heart, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Nate from "../assets/images/logo.jpg";

interface DeveloperProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  links: {
    github?: string;
    linkedin?: string;
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
      className="w-full"
    >
      <Card className="overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
              <div className="aspect-square overflow-hidden rounded-full border-4 border-white/50 shadow-lg mx-auto max-w-[200px]">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-indigo-100">{role}</p>
                <div className="flex justify-center mt-4 space-x-3">
                  {links.github && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      asChild
                    >
                      <a
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>
                          <i className="bx bxl-github h-5 w-5 text-xl flex-auto"></i>
                        </div>
                      </a>
                    </Button>
                  )}
                  {links.linkedin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      asChild
                    >
                      <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {links.insta && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      asChild
                    >
                      <a
                        href={links.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>
                          <i className="bx bxl-instagram text-2xl"></i>
                        </div>
                      </a>
                    </Button>
                  )}
                  {links.email && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      asChild
                    >
                      <a href={`mailto:${links.email}`}>
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  About
                </h4>
                <p className="text-gray-600">{bio}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// The Developers Nav
export const MeetTheDevsNav = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 10 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md"
          >
            <Code className="h-5 w-5 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meet Our Team
          </h1>
        </div>
        <Button variant="outline" asChild className="hover:bg-indigo-50">
          <Link to="/">Back to Dashboard</Link>
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
      className="bg-white rounded-xl shadow-lg p-8 text-center mb-12"
    >
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Join Our Mission
        </h3>
        <p className="text-gray-600 mb-6">
          We're a small passion project built on the belief that mental wellness
          should be engaging and accessible to everyone. While JournalXP isn't a
          paid opportunity, it's a space where anyone who shares our mission is
          welcome to contribute. Whether you're a developer, designer, writer,
          or just passionate about mental health, your help can make a real
          impact.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            View Help Opportunities
          </Button>
          <Button
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Contact Us
          </Button>
          <Button
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            <a href="https://github.com/Simpleboi/JournalXP" target="_blank">GitHub</a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// The Footer
export const TeamFooter = () => {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <p>JournalXP - Your Mental Health Companion</p>
        <p className="mt-2">
          Made with <Heart className="h-3 w-3 inline text-pink-500" /> by our
          dedicated team
        </p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} JournalXP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// The Developers Section
const MeetTheDevelopers = () => {
  const developers: DeveloperProps[] = [
    {
      name: "Nathaniel Paz",
      role: "Lead Developer & Founder",
      bio: "Nathaniel, or Nate, founded JournalXP after his own mental health journey revealed how powerful journaling and reflection can be for personal growth. As a computer science student and passionate web developer, he combined his technical skills with a genuine desire to help others take control of their mental well-being. With a focus on simplicity, mindfulness, and positive reinforcement, Nate created JournalXP to make self-care feel engaging, rewarding, and accessible to everyone.",
      imageUrl: Nate,
      links: {
        github: "https://github.com/Simpleboi",
        linkedin: "https://n8jsx.com/",
        insta: "https://www.instagram.com/n8.jsx/",
        email: "n8thegr8.jsx@gmail.com",
      },
      skills: [
        "React",
        "TypeScript",
        "UI/UX Design",
        "Mental Health",
        "Web Development",
        "TailwindCSS"
      ],
    },
    {
      name: "Haley Baugh",
      role: "Psychology Student & Mental Health advocate",
      bio: "With a background in psychology and user experience research, Haley ensures that JournalXP's features are grounded in mental health best practices. She conducts user interviews and stays current with research to make our app truly beneficial for users' wellbeing.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "michael@journalxp.com",
        insta: "n8thegr8.jsx@gmail.com",
      },
      skills: [
        "Cognitive & Behavioral Insight",
        "User Mental-Wellness Guidance",
        "Emotional Safety Review",
        "Psychological Research Literacy",
      ],
    },
    {
      name: "Some Dude I met at Schhol",
      role: "Brand Designer & Marketing Strategist",
      bio: "Something something",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      links: {
        linkedin: "https://linkedin.com",
        insta: "https:com",
        email: "aisha@journalxp.com",
        github: "n8thegr8.jsx@gmail.com",
      },
      skills: [
        "User Research",
        "Psychology",
        "Content Strategy",
        "Mental Health",
        "Accessibility",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <MeetTheDevsNav />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            The Minds Behind{" "}
            <span className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the passionate team dedicated to improving your mental
            wellbeing through technology, design, and evidence-based practices.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-8 mb-16">
          {developers.map((developer, index) => (
            <Developer key={index} {...developer} />
          ))}
        </div>

        {/* Join Us Section */}
        <JoinUs />

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              User-Centered
            </h3>
            <p className="text-gray-600">
              Everything we build starts with you in mind. We regularly gather
              feedback and conduct research to ensure JournalXP truly serves
              your mental health needs.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Evidence-Based
            </h3>
            <p className="text-gray-600">
              Our features are grounded in psychological research and best
              practices. We collaborate with mental health professionals to
              ensure our approach is both effective and ethical.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Coffee className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sustainable Growth
            </h3>
            <p className="text-gray-600">
              We're committed to growing responsibly. Rather than chasing quick
              profits, we focus on building a platform that can sustainably
              support your mental health journey for years to come. JournalXP is
              free to use, to ensure anyone can improve thier mental well-being.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <TeamFooter />
    </div>
  );
};

export default MeetTheDevelopers;
