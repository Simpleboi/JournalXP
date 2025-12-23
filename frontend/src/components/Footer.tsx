import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Instagram,
  Mail,
  ArrowUp,
  Heart,
  Shield,
  Zap,
  BookOpen,
  Users,
  MessageSquare,
  FileText,
  Code,
  ExternalLink,
  Phone,
  Activity,
  Sparkles,
  Package,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import logo from "@/assets/images/logo.jpg";

export const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");
  const currentYear = new Date().getFullYear();
  const appVersion = "v2.3.0";
  const lastUpdated = "December 22nd, 2025";

  // Show back to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    setNewsletterStatus("success");
    setEmail("");
    setTimeout(() => setNewsletterStatus("idle"), 3000);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white mt-20 relative">
      <div className="absolute -top-[1px] left-0 right-0 pointer-events-none lg:hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z"
            fill="rgb(249, 250, 251)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/assets/images/logo[7].png" alt="JournalXP Logo" className="w-12 h-12 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold">JournalXP</h3>
                <Badge variant="outline" className="mt-1 text-xs bg-white/10 text-white border-white/20">
                  {appVersion}
                </Badge>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              Your Mental Health, Leveled Up
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              A game-like mental health companion that helps you journal, build habits, and grow through self-reflection.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">
                <Shield className="h-3 w-3 mr-1" />
                100% Free
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <Zap className="h-3 w-3 mr-1" />
                No Ads
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                <Code className="h-3 w-3 mr-1" />
                Open Source
              </Badge>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about#features"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Features</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about#roadmap"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Roadmap</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about#roadmap"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Release Notes</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Changelog</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Status</span>
                  <Activity className="h-3 w-3 text-green-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* TODO: implement this later when the blog comes out */}
                {/* <Link
                  to="/blog"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Blog</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link> */}
              </li>
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>FAQs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link
                  to="/about#features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                {/* TODO: implement this later */}
                {/* <a
                  href="https://github.com/Simpleboi/JournalXP/blob/main/CLAUDE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>API Docs</span>
                  <ExternalLink className="h-3 w-3" />
                </a> */}
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>About Us</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              {/* TODO: implement this later when the meet the devs part comes out */}
              {/* <li>
                <Link
                  to="/meet-the-devs"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Team</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li> */}
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>License (MIT)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              {/* TODO: implement this later when I'm able to accept donations */}
              {/* <li>
                <Link
                  to="/donate"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  <span>Support Us</span>
                  <Heart className="h-3 w-3 text-red-400" />
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Legal & Community Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Legal & Community
            </h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/tac"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy#data-security"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Data Security
                </Link>
              </li>
            </ul>

            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/journalxp.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Simpleboi/JournalXP/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Crisis Resources Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-white/10">
          {/* Newsletter Signup */}
          {/* Implement this later when you have a newsletter set up */}
          {/* <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Stay Updated
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Get notified about new features, updates, and mental health tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Subscribe
              </Button>
            </form>
            {newsletterStatus === "success" && (
              <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Thanks for subscribing!
              </p>
            )}
          </div> */}

          {/* Crisis Resources */}
          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Need Help Now?
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              If you're in crisis, please reach out for immediate support:
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:988"
                className="flex items-center gap-2 text-red-300 hover:text-red-200 font-semibold"
              >
                <Phone className="h-4 w-4" />
                988 Suicide & Crisis Lifeline
              </a>
              <a
                href="sms:741741"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-200"
              >
                <MessageSquare className="h-4 w-4" />
                Text HOME to 741741 (Crisis Text Line)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">
              <p className="mb-1">
                Made with <Heart className="h-3 w-3 inline text-red-400 fill-current" /> by{" "}
                <a
                  href="https://natejsx.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Nathaniel Paz
                </a>
              </p>
              <p className="text-xs">
                © {currentYear} JournalXP. All rights reserved. | Last updated: {lastUpdated}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-green-400" />
                All systems operational
              </span>
              <span>•</span>
              <a
                href="https://firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                Powered by Firebase
              </a>
            </div>
          </div>

          {/* Transparency Notice */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              JournalXP uses Firebase for authentication and database implementation. We prioritize your privacy and never sell your data.{" "}
              <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
};
