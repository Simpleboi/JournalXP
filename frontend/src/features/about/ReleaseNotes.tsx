import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Sparkles,
  TrendingUp,
  Bug,
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { releaseNotes } from "@/data/releaseNotes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ReleaseNotes = () => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set([releaseNotes[0]?.version]) // Expand latest version by default
  );

  const toggleVersion = (version: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="mt-8 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-indigo-600" />
          <CardTitle className="text-indigo-900">📦 Release History</CardTitle>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          All previous releases and their changelog notes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {releaseNotes.map((release, index) => {
            const isExpanded = expandedVersions.has(release.version);
            const isLatest = index === 0;

            return (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="bg-white rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header - Always Visible */}
                  <button
                    onClick={() => toggleVersion(release.version)}
                    className="w-full p-4 flex items-start justify-between hover:bg-indigo-50/50 transition-colors rounded-t-lg"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900">
                          v{release.version}
                        </h4>
                        {isLatest && (
                          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-indigo-600 mb-1">
                        {release.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(release.date)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
                          {/* Highlights */}
                          <div className="pt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="h-5 w-5 text-yellow-500" />
                              <h5 className="font-semibold text-gray-900">
                                Highlights
                              </h5>
                            </div>
                            <ul className="space-y-2">
                              {release.highlights.map((highlight, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-gray-700"
                                >
                                  <span className="text-yellow-500 mt-0.5">
                                    ⭐
                                  </span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Features */}
                          {release.features && release.features.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="h-5 w-5 text-green-500" />
                                <h5 className="font-semibold text-gray-900">
                                  New Features
                                </h5>
                              </div>
                              <ul className="space-y-2">
                                {release.features.map((feature, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-gray-700"
                                  >
                                    <span className="text-green-500 mt-0.5">
                                      ✨
                                    </span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Improvements */}
                          {release.improvements &&
                            release.improvements.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <TrendingUp className="h-5 w-5 text-blue-500" />
                                  <h5 className="font-semibold text-gray-900">
                                    Improvements
                                  </h5>
                                </div>
                                <ul className="space-y-2">
                                  {release.improvements.map(
                                    (improvement, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                      >
                                        <span className="text-blue-500 mt-0.5">
                                          📈
                                        </span>
                                        <span>{improvement}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          {/* Bug Fixes */}
                          {release.bugFixes && release.bugFixes.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Bug className="h-5 w-5 text-red-500" />
                                <h5 className="font-semibold text-gray-900">
                                  Bug Fixes
                                </h5>
                              </div>
                              <ul className="space-y-2">
                                {release.bugFixes.map((fix, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-gray-700"
                                  >
                                    <span className="text-red-500 mt-0.5">
                                      🐛
                                    </span>
                                    <span>{fix}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Breaking Changes */}
                          {release.breaking && release.breaking.length > 0 && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                <h5 className="font-semibold text-orange-900">
                                  Breaking Changes
                                </h5>
                              </div>
                              <ul className="space-y-2">
                                {release.breaking.map((breaking, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-orange-800"
                                  >
                                    <span className="text-orange-600 mt-0.5">
                                      ⚠️
                                    </span>
                                    <span>{breaking}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center pt-4 border-t border-indigo-100">
          <p className="text-sm text-gray-600">
            Want to see what's coming next?{" "}
            <a
              href="https://github.com/Simpleboi/JournalXP/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Check out our roadmap above
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
