import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Palette, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/context/ThemeContext";
import { useUserData } from "@/context/UserDataContext";

export const ProfileTheme = () => {
  const { themeId, setTheme, availableThemes } = useTheme();
  const { userData } = useUserData();

  // Free themes that everyone has access to
  const freeThemes = ['default', 'ocean', 'sunset'];

  // Filter themes to only show owned ones
  const ownedThemes = availableThemes.filter(theme => {
    // Free themes are always available
    if (freeThemes.includes(theme.id)) return true;
    // Check if user owns this theme
    return userData?.inventory?.includes(theme.id);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" /> Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Color Theme ({ownedThemes.length} available)</Label>
            <RadioGroup
              value={themeId}
              onValueChange={setTheme}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {ownedThemes.map((theme) => (
                <div key={theme.id}>
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={theme.id}
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:border-primary cursor-pointer transition-all relative ${
                      themeId === theme.id
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-muted"
                    }`}
                    style={{
                      background: theme.colors.gradient,
                    }}
                  >
                    {themeId === theme.id && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    )}
                    <span className="text-white font-medium text-sm">
                      {theme.name}
                    </span>
                    <span className="text-white/80 text-xs mt-1 text-center">
                      {theme.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
