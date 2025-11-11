import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, DollarSign, Github, Share2, MessageSquare, Code } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const SupportSection = () => {
  const monthlyGoal = 500;
  const currentFunding = 347;
  const progressPercentage = (currentFunding / monthlyGoal) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Support This Mission
        </h2>
        <p className="text-xl text-gray-600">
          Help keep JournalXP free and accessible for everyone
        </p>
      </div>

      {/* Financial Transparency */}
      <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">100% Transparent Funding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-900 mb-1">$47/mo</div>
              <p className="text-sm text-indigo-700">Server Costs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-900 mb-1">$0</div>
              <p className="text-sm text-indigo-700">Revenue (100% donation-funded)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-900 mb-1">800+ hrs</div>
              <p className="text-sm text-indigo-700">Time Invested</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-indigo-100">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-900">Monthly Funding Goal</span>
              <span className="font-bold text-indigo-600">
                ${currentFunding} / ${monthlyGoal}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {progressPercentage.toFixed(0)}% funded • Helps cover servers & AI costs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Donation Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
          <CardHeader>
            <Badge className="w-fit mb-2 bg-purple-100 text-purple-700">Coffee Supporter</Badge>
            <CardTitle className="text-2xl">$5/month</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-purple-600 mt-0.5" />
                <span>Support JournalXP's mission</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-purple-600 mt-0.5" />
                <span>Supporter badge in app</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-purple-600 mt-0.5" />
                <span>Our eternal gratitude</span>
              </li>
            </ul>
            <a
              href="https://www.paypal.com/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Support $5/mo
            </a>
          </CardContent>
        </Card>

        <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-all hover:shadow-lg relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-yellow-400 text-yellow-900">Most Popular</Badge>
          </div>
          <CardHeader>
            <Badge className="w-fit mb-2 bg-indigo-100 text-indigo-700">Wellness Advocate</Badge>
            <CardTitle className="text-2xl">$15/month</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-indigo-600 mt-0.5" />
                <span>All Coffee tier perks</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-indigo-600 mt-0.5" />
                <span>Early access to new features</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-indigo-600 mt-0.5" />
                <span>Vote on roadmap priorities</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-indigo-600 mt-0.5" />
                <span>Special supporter avatar</span>
              </li>
            </ul>
            <a
              href="https://www.paypal.com/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              Support $15/mo
            </a>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200 hover:border-pink-400 transition-all hover:shadow-lg">
          <CardHeader>
            <Badge className="w-fit mb-2 bg-pink-100 text-pink-700">Mental Health Champion</Badge>
            <CardTitle className="text-2xl">$50/month</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-pink-600 mt-0.5" />
                <span>All previous perks</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-pink-600 mt-0.5" />
                <span>Listed as official sponsor</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-pink-600 mt-0.5" />
                <span>Direct line to founder</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-pink-600 mt-0.5" />
                <span>Custom feature requests</span>
              </li>
            </ul>
            <a
              href="https://www.paypal.com/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-all"
            >
              Support $50/mo
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Alternative Ways to Help */}
      <Card>
        <CardHeader>
          <CardTitle>Can't Donate? Here's How to Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Share2 className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Share on Social Media</h4>
                <p className="text-sm text-gray-600">Help spread the word to those who need it</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Submit Feedback</h4>
                <p className="text-sm text-gray-600">Your ideas make JournalXP better</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Github className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Contribute Code</h4>
                <p className="text-sm text-gray-600">
                  <a
                    href="https://github.com/Simpleboi/JournalXP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 underline"
                  >
                    We're open source
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Heart className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Leave a Review</h4>
                <p className="text-sm text-gray-600">Testimonials help others discover us</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Code className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Report Bugs</h4>
                <p className="text-sm text-gray-600">Help us improve the experience</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Heart className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Tell a Friend</h4>
                <p className="text-sm text-gray-600">Especially someone who might need this</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Donations Fund */}
      <Card className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Where Your Money Goes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Server Hosting ($30/mo)</h4>
                <p className="text-sm text-gray-600">Firebase hosting for frontend, database, and functions</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">AI Costs ($17/mo)</h4>
                <p className="text-sm text-gray-600">OpenAI API for Sunday's GPT-4o conversations</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900">Future: Mobile App Development</h4>
                <p className="text-sm text-gray-600">React Native development, Apple/Google app store fees</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-green-900 font-semibold">
                💚 100% of donations go to keeping JournalXP free and accessible.
              </p>
              <p className="text-sm text-green-700 mt-1">
                Zero profit motive. This is a labor of love, not a business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
