import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Star, Heart, Compass } from "lucide-react";
import { FeedbackForm } from "@/components/Feedback";

export const AboutInfo = () => {
  return (
    <TabsContent value="about" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>Why JournalXP was created</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Hi, I'm{" "}
            <a
              href="https://natejsx.dev/"
              target="_blank"
              className="text-blue-700 underline"
            >
              Nate
            </a>
            , the creator of{" "}
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>
            .
            <br />
            <br />I started working on this project after facing some of the darkest moments of my life. At one point, I nearly lost my own battle with mental health. Tragically, a good friend of
            mine, Jacobe Cook, did lose his life, and his passing became the
            driving force that pushed me to finish this project.
            <br />
            <br />
            Mental health and emotional well-being are deeply important, yet so
            many of us feel alone in our struggles. For a long time, I felt
            stuck in a heavy depression, unsure of how to move forward.
            Journaling became a small but meaningful step toward healing, a way
            to reflect, release, and rediscover myself.
            <br />
            <br />
            I know I'm not the only one walking that path. That's why I
            created{" "}
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>
            , a space where mental wellness becomes something you can nurture,
            track, and even feel proud of, like leveling up in a game.
          </p>
          <p>
            Here at{" "}
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>
            , the mission is to make mental health care more engaging,
            approachable, and empowering. Through game-like features,
            mental-health tools, and intentional design, I want to help you
            reflect on your journey and grow, one entry at a time.
            <br />
            <br />
            <b className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </b>{" "}
            is built with the community in mind. Your feedback is incredibly important to its growth. If you have a comment, concern, or ideas for improvement, please take a moment to fill out the <span className="font-semibold">Feedback Form</span> located under this tab.
            <br />
            <br />
            Building this project has helped me heal, and my hope is that it can do the same for others.
            Because your mental health matters, and you deserve to grow with
            every entry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <Heart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-medium text-indigo-900">Self-Care</h3>
              <p className="text-sm text-indigo-700">
                Prioritize your mental wellbeing daily
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-900">Motivation</h3>
              <p className="text-sm text-purple-700">
                Stay engaged with rewards and progress tracking
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Compass className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-blue-900">Growth</h3>
              <p className="text-sm text-blue-700">
                Build lasting habits for long-term wellbeing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <FeedbackForm />
    </TabsContent>
  );
};
