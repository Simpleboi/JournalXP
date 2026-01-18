import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";

// Detect iOS devices (iPhone, iPad, iPod)
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const ProfileLocation = () => {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user has previously enabled location
    const savedPreference = localStorage.getItem("journalxp_location_enabled");
    setLocationEnabled(savedPreference === "true");

    // Check browser permission state
    // Note: iOS Safari doesn't fully support navigator.permissions.query for geolocation
    const checkPermissions = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          setPermissionState(result.state as "prompt" | "granted" | "denied");

          result.addEventListener("change", () => {
            setPermissionState(result.state as "prompt" | "granted" | "denied");
          });
        }
      } catch {
        // iOS Safari throws an error for geolocation permission query
        // Fall back to checking if location was previously enabled successfully
        if (savedPreference === "true") {
          setPermissionState("granted");
        }
        // Otherwise keep as "prompt" - we'll find out the real state when user clicks enable
      }
    };

    checkPermissions();
  }, []);

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      showToast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
      });
      return;
    }

    // Request permission
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success - save preference
        localStorage.setItem("journalxp_location_enabled", "true");
        setLocationEnabled(true);
        setPermissionState("granted");

        showToast({
          title: "Location enabled",
          description: "Your location will now be used for weather updates.",
        });

        // Dispatch custom event to notify Weather component
        window.dispatchEvent(new CustomEvent("locationPreferenceChanged", { detail: { enabled: true } }));
      },
      (error) => {
        // Error - permission denied or other issue
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState("denied");
          if (isIOS()) {
            showToast({
              variant: "destructive",
              title: "Location permission denied",
              description: "Go to iPhone Settings > Safari > Location, then enable for this website.",
            });
          } else {
            showToast({
              variant: "destructive",
              title: "Location permission denied",
              description: "Please enable location permissions in your browser settings to use this feature.",
            });
          }
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          showToast({
            variant: "destructive",
            title: "Location unavailable",
            description: isIOS()
              ? "Make sure Location Services is enabled in iPhone Settings > Privacy & Security > Location Services."
              : "Unable to determine your location. Please check your device's location settings.",
          });
        } else {
          showToast({
            variant: "destructive",
            title: "Location error",
            description: "Unable to retrieve your location. Please try again.",
          });
        }
      }
    );
  };

  const handleDisableLocation = () => {
    localStorage.setItem("journalxp_location_enabled", "false");
    setLocationEnabled(false);

    showToast({
      title: "Location disabled",
      description: "Your location will no longer be used for weather updates.",
    });

    // Dispatch custom event to notify Weather component
    window.dispatchEvent(new CustomEvent("locationPreferenceChanged", { detail: { enabled: false } }));
  };

  const getPermissionStatus = () => {
    switch (permissionState) {
      case "granted":
        return { text: "Granted", color: "text-green-600", icon: <Check className="h-4 w-4" /> };
      case "denied":
        return { text: "Denied", color: "text-red-600", icon: <X className="h-4 w-4" /> };
      case "prompt":
        return { text: "Not requested", color: "text-gray-600", icon: <MapPin className="h-4 w-4" /> };
      default:
        return { text: "Unknown", color: "text-gray-600", icon: <MapPin className="h-4 w-4" /> };
    }
  };

  const status = getPermissionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-sm mb-1">Enable Location Services</h3>
            <p className="text-sm text-gray-600 mb-2">
              Allow JournalXP to access your location for accurate weather updates on your homepage.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Browser Permission:</span>
              <span className={`font-medium flex items-center gap-1 ${status.color}`}>
                {status.icon}
                {status.text}
              </span>
            </div>
          </div>
        </div>

        {permissionState === "denied" && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>Location access blocked.</strong> To use location features, you'll need to:
            </p>
            {isIOS() ? (
              <ol className="text-sm text-red-700 mt-2 ml-4 list-decimal space-y-1">
                <li>Open iPhone <strong>Settings</strong> app</li>
                <li>Go to <strong>Privacy & Security</strong> → <strong>Location Services</strong></li>
                <li>Make sure Location Services is <strong>ON</strong></li>
                <li>Scroll down and tap <strong>Safari Websites</strong></li>
                <li>Select <strong>While Using</strong> or <strong>Ask Next Time</strong></li>
                <li>Return here and tap "Enable Location"</li>
              </ol>
            ) : (
              <ol className="text-sm text-red-700 mt-2 ml-4 list-decimal space-y-1">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Change location permissions to "Allow"</li>
                <li>Refresh this page and try again</li>
              </ol>
            )}
          </div>
        )}

        {permissionState === "granted" && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">
              Location access is enabled. The weather widget will use your current location for accurate weather data.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!locationEnabled || permissionState !== "granted" ? (
            <Button
              onClick={handleEnableLocation}
              disabled={permissionState === "denied" && !isIOS()}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              {permissionState === "denied" && isIOS() ? "Try Again" : "Enable Location"}
            </Button>
          ) : (
            <Button
              onClick={handleDisableLocation}
              variant="outline"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Disable Location
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Your location data is only used for weather updates and is never stored or shared. Location requests are processed in real-time and immediately discarded.
        </p>
      </CardContent>
    </Card>
  );
};
