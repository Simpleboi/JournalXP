import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Newspaper } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { authFetch } from "@/lib/authFetch";

interface EmailPreferences {
  weeklyDigest: boolean;
  productUpdates: boolean;
}

export const ProfileNotifs = () => {
  const { userData, refreshUserData } = useUserData();
  const [emailPrefs, setEmailPrefs] = useState<EmailPreferences>({
    weeklyDigest: true,
    productUpdates: true,
  });
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Sync from userData when it changes
  useEffect(() => {
    if (userData?.preferences?.emailPreferences) {
      setEmailPrefs({
        weeklyDigest: userData.preferences.emailPreferences.weeklyDigest ?? true,
        productUpdates: userData.preferences.emailPreferences.productUpdates ?? true,
      });
    }
  }, [userData?.preferences?.emailPreferences]);

  const updatePreference = async (key: keyof EmailPreferences, value: boolean) => {
    // Optimistic update
    setEmailPrefs((prev) => ({ ...prev, [key]: value }));
    setIsUpdating(key);

    try {
      await authFetch("/mailing/preferences", {
        method: "PATCH",
        body: JSON.stringify({ [key]: value }),
      });

      // Refresh to stay in sync
      await refreshUserData();
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      // Revert on error
      setEmailPrefs((prev) => ({ ...prev, [key]: !value }));
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage which emails you receive from JournalXP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label htmlFor="weekly-digest" className="font-medium">
                  Weekly Activity Digest
                </Label>
                <p className="text-sm text-muted-foreground">
                  A summary of your journaling, streaks, and achievements
                </p>
              </div>
            </div>
            <Switch
              id="weekly-digest"
              checked={emailPrefs.weeklyDigest}
              onCheckedChange={(checked) => updatePreference("weeklyDigest", checked)}
              disabled={isUpdating === "weeklyDigest"}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Newspaper className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label htmlFor="product-updates" className="font-medium">
                  Product Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  New features, improvements, and announcements
                </p>
              </div>
            </div>
            <Switch
              id="product-updates"
              checked={emailPrefs.productUpdates}
              onCheckedChange={(checked) => updatePreference("productUpdates", checked)}
              disabled={isUpdating === "productUpdates"}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          You can also unsubscribe directly from any email we send.
        </p>
      </CardContent>
    </Card>
  );
};
