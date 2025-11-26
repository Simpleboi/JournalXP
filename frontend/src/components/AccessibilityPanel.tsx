import { useAccessibility } from "@/context/AccessibilityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  Type,
  Contrast,
  Mic,
  Volume2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
} from "lucide-react";

export function AccessibilityPanel() {
  const {
    settings,
    toggleAccessibilityMode,
    toggleDyslexiaFont,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleVoiceNavigation,
    toggleScreenReaderMode,
    resetSettings,
  } = useAccessibility();

  const fontSizeDisplay = {
    small: "Small (14px)",
    medium: "Medium (16px)",
    large: "Large (18px)",
    "x-large": "Extra Large (20px)",
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-indigo-700 flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Accessibility Settings
            </CardTitle>
            <CardDescription className="text-indigo-600">
              Customize your reading and writing experience
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="gap-2"
            aria-label="Reset all accessibility settings to default"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Master Accessibility Toggle */}
        {/* TODO: implement this later in 2.3 or 2.4 */}
        {/* <div className="space-y-2 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-indigo-600" />
              <div>
                <label
                  htmlFor="accessibility-mode"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Enable Accessibility Features
                </label>
                <p className="text-xs text-gray-500">
                  Turn on enhanced form validation, focus indicators, and other accessibility aids
                </p>
              </div>
            </div>
            <Switch
              id="accessibility-mode"
              checked={settings.accessibilityMode}
              onCheckedChange={toggleAccessibilityMode}
              aria-label="Toggle accessibility mode"
            />
          </div>
          {settings.accessibilityMode && (
            <div className="ml-8 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-xs text-indigo-800">
                <strong>Enabled:</strong> Form validation borders, enhanced focus indicators,
                improved touch targets, and accessible table styles are now active.
              </p>
            </div>
          )}
        </div> */}

        {/* Dyslexia-Friendly Font */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-gray-600" />
              <div>
                <label
                  htmlFor="dyslexia-font"
                  className="text-sm font-medium cursor-pointer"
                >
                  Dyslexia-Friendly Font
                </label>
                <p className="text-xs text-gray-500">
                  Use OpenDyslexic font for easier reading
                </p>
              </div>
            </div>
            <Switch
              id="dyslexia-font"
              checked={settings.dyslexiaFont}
              onCheckedChange={toggleDyslexiaFont}
              aria-label="Toggle dyslexia-friendly font"
            />
          </div>
          {settings.dyslexiaFont && (
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>

        {/* Font Size Control */}
        {/* <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ZoomIn className="h-5 w-5 text-gray-600" />
            <div>
              <label className="text-sm font-medium">Text Size</label>
              <p className="text-xs text-gray-500">
                Adjust the size of text throughout the app
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decreaseFontSize}
              disabled={settings.fontSize === "small"}
              aria-label="Decrease font size"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="px-4 py-2 min-w-[180px] justify-center">
              {fontSizeDisplay[settings.fontSize]}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={increaseFontSize}
              disabled={settings.fontSize === "x-large"}
              aria-label="Increase font size"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div> */}

        {/* High Contrast Mode */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Contrast className="h-5 w-5 text-gray-600" />
              <div>
                <label
                  htmlFor="high-contrast"
                  className="text-sm font-medium cursor-pointer"
                >
                  High Contrast Mode
                </label>
                <p className="text-xs text-gray-500">
                  Increase contrast for better visibility
                </p>
              </div>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={toggleHighContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>
          {settings.highContrast && (
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div> */}

        {/* Voice Navigation */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="h-5 w-5 text-gray-600" />
              <div>
                <label
                  htmlFor="voice-nav"
                  className="text-sm font-medium cursor-pointer"
                >
                  Voice Navigation
                </label>
                <p className="text-xs text-gray-500">
                  Navigate using voice commands
                </p>
              </div>
            </div>
            <Switch
              id="voice-nav"
              checked={settings.voiceNavigation}
              onCheckedChange={toggleVoiceNavigation}
              aria-label="Toggle voice navigation"
            />
          </div>
          {settings.voiceNavigation && (
            <div className="ml-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-medium mb-2">
                Voice Commands Available:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>"Go to journal" - Open journal page</li>
                <li>"Go to archive" - Open reflection archive</li>
                <li>"Save entry" - Save current journal entry</li>
                <li>"Cancel" - Cancel current action</li>
              </ul>
            </div>
          )}
        </div> */}

        {/* Screen Reader Optimization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-gray-600" />
              <div>
                <label
                  htmlFor="screen-reader"
                  className="text-sm font-medium cursor-pointer"
                >
                  Screen Reader Optimized
                </label>
                <p className="text-xs text-gray-500">
                  Enhanced experience for screen reader users
                </p>
              </div>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReaderOptimized}
              onCheckedChange={toggleScreenReaderMode}
              aria-label="Toggle screen reader optimized mode"
            />
          </div>
          {settings.screenReaderOptimized && (
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>

        {/* Information Banner */}
        {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>Tip:</strong> These settings are saved automatically and will persist
            across sessions. Use keyboard shortcuts for quick access:
          </p>
          <ul className="mt-2 text-xs text-gray-600 space-y-1 ml-4">
            <li>• <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">+</kbd> - Increase text size</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">-</kbd> - Decrease text size</li>
            <li>• <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">C</kbd> - Toggle high contrast</li>
          </ul>
        </div> */}
      </CardContent>
    </Card>
  );
}
