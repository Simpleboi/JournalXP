import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Send, MessageSquare } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export const FeedbackForm = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      type: feedbackType,
      feedback: message,
      email,
    };

    try {
      const response = await fetch("https://formspree.io/f/xzzgkdnz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedbackType("");
        setMessage("");
        setEmail("");
      } else {
        console.error("Formspree error:", await response.text());
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center bg-white rounded-xl shadow-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow"
        >
          <Send className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-indigo-700">Thank You!</h3>
        <p className="text-gray-600 max-w-md">
          Your feedback has been submitted successfully. We truly appreciate
          your thoughts and will use them to improve JournalXP.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto"
      action="https://formspree.io/f/xzzgkdnz"
      method="POST"
    >
      <h2 className="text-xl font-semibold text-indigo-700 mb-2">
        Share Your Feedback
      </h2>

      <div className="space-y-2">
        <label
          htmlFor="feedbackType"
          className="block text-sm font-medium text-gray-700"
        >
          Feedback Type <span className="text-red-500">*</span>
        </label>
        <Select value={feedbackType} onValueChange={setFeedbackType} required>
          <SelectTrigger id="feedbackType" className="w-full bg-indigo-50">
            <SelectValue placeholder="Select feedback type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="suggestion">Suggestion</SelectItem>
            <SelectItem value="bug">Bug Report</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="praise">Praise</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="type" value={feedbackType} />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Your Feedback <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          placeholder="Please share your thoughts, ideas, or concerns..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] bg-indigo-50"
          required
          name="feedback"
        />
        <p className="text-xs text-gray-500">
          Your feedback is anonymous by default, if you'd like to make yourself
          known, please include your name.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address <span className="text-gray-500">(optional)</span>
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-indigo-50"
        />
        <p className="text-xs text-gray-500">
          If you'd like us to follow up, please include your email.
        </p>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Submit Feedback
        </Button>
      </div>
    </form>
  );
};
