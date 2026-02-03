import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailX, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type UnsubscribeStatus = "loading" | "success" | "error";

interface UnsubscribeResult {
  success: boolean;
  message: string;
  unsubscribedFrom?: string;
}

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<UnsubscribeStatus>("loading");
  const [result, setResult] = useState<UnsubscribeResult | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setResult({
        success: false,
        message: "Missing unsubscribe token. This link may be invalid.",
      });
      return;
    }

    // Call the unsubscribe API
    const processUnsubscribe = async () => {
      try {
        const apiUrl = import.meta.env.PROD
          ? import.meta.env.VITE_API_PROD
          : import.meta.env.VITE_API_URL;

        const response = await fetch(
          `${apiUrl}/mailing/unsubscribe?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setResult(data);
        } else {
          setStatus("error");
          setResult({
            success: false,
            message: data.details || data.error || "Failed to process unsubscribe request.",
          });
        }
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
        setResult({
          success: false,
          message: "Unable to process your request. Please try again later.",
        });
      }
    };

    processUnsubscribe();
  }, [searchParams]);

  const getUnsubscribeTypeLabel = (type: string | undefined) => {
    switch (type) {
      case "weeklyDigest":
        return "weekly digest emails";
      case "productUpdates":
        return "product update emails";
      case "all":
        return "all JournalXP emails";
      default:
        return "these emails";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              JournalXP
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
            <CardContent className="p-8 text-center">
              {status === "loading" && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-6"
                  >
                    <Loader2 className="w-16 h-16 text-primary" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Processing your request...
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we update your preferences.
                  </p>
                </>
              )}

              {status === "success" && result && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    You've been unsubscribed
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You will no longer receive {getUnsubscribeTypeLabel(result.unsubscribedFrom)} from JournalXP.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Changed your mind? You can re-subscribe anytime in your profile settings.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/">Return to JournalXP</Link>
                    </Button>
                  </div>
                </>
              )}

              {status === "error" && result && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {result.message}
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      If you continue to have trouble, you can manage your email preferences directly from your profile.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/profile">Go to Profile Settings</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Info box */}
          <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <MailX className="w-4 h-4" />
              <span className="text-sm font-medium">Email Preferences</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              You can always manage your email preferences from your{" "}
              <Link to="/profile" className="text-primary hover:underline">
                profile settings
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UnsubscribePage;
