import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Phone, MessageSquare, Globe } from "lucide-react";

export const CrisisResources = () => {
  return (
    <Card className="border-4 border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-red-900 mb-3">
              If You're In Crisis, Get Help Now
            </h2>
            <p className="text-red-800 mb-4">
              JournalXP is a wellness tool, not a replacement for professional mental health care.
              If you're experiencing a crisis, please reach out immediately:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 988 Lifeline */}
              <a
                href="tel:988"
                className="bg-white p-4 rounded-lg border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-red-600 group-hover:animate-pulse" />
                  <span className="font-bold text-red-900">988 Lifeline</span>
                </div>
                <p className="text-sm text-gray-700">
                  Suicide & Crisis Lifeline
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Call or text 988 (US)
                </p>
              </a>

              {/* Crisis Text Line */}
              <a
                href="sms:741741"
                className="bg-white p-4 rounded-lg border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-red-600 group-hover:animate-pulse" />
                  <span className="font-bold text-red-900">Crisis Text Line</span>
                </div>
                <p className="text-sm text-gray-700">
                  24/7 text support
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Text HOME to 741741
                </p>
              </a>

              {/* SAMHSA */}
              <a
                href="tel:1-800-662-4357"
                className="bg-white p-4 rounded-lg border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-red-600 group-hover:animate-pulse" />
                  <span className="font-bold text-red-900">SAMHSA Helpline</span>
                </div>
                <p className="text-sm text-gray-700">
                  Mental health & substance abuse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  1-800-662-HELP (4357)
                </p>
              </a>

              {/* International */}
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-lg border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-red-600 group-hover:animate-pulse" />
                  <span className="font-bold text-red-900">International</span>
                </div>
                <p className="text-sm text-gray-700">
                  Find helplines worldwide
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  findahelpline.com
                </p>
              </a>
            </div>

            <p className="text-sm text-red-700 mt-4 italic">
              You are not alone. Help is available 24/7, and recovery is possible.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
