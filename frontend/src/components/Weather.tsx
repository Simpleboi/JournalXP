import { motion } from "framer-motion";
import {
  Cloud,
  MapPin,
  Droplets,
  Wind,
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  Thermometer,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

// Detect iOS devices (iPhone, iPad, iPod)
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

export const LiveWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [isMetric, setIsMetric] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Check location preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem("journalxp_location_enabled");
    setLocationEnabled(savedPreference === "true");
  }, []);

  // Weather fetch effect
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check if user has enabled location sharing
        const savedPreference = localStorage.getItem("journalxp_location_enabled");
        const isEnabled = savedPreference === "true";

        // Get user's location only if enabled
        if (isEnabled && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // Using Open-Meteo API
              const tempUnit = isMetric ? "celsius" : "fahrenheit";
              const windUnit = isMetric ? "kmh" : "mph";
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`
              );
              const data = await response.json();

              // Get location name using reverse geocoding
              const geoResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const geoData = await geoResponse.json();

              const weatherCode = data.current.weather_code;
              let condition = "Clear";
              let icon = "sun";

              if (weatherCode >= 0 && weatherCode <= 3) {
                condition =
                  weatherCode === 0
                    ? "Clear"
                    : weatherCode <= 2
                    ? "Partly Cloudy"
                    : "Cloudy";
                icon = weatherCode === 0 ? "sun" : "cloud-sun";
              } else if (weatherCode >= 45 && weatherCode <= 48) {
                condition = "Foggy";
                icon = "cloud";
              } else if (weatherCode >= 51 && weatherCode <= 67) {
                condition = "Rainy";
                icon = "cloud-rain";
              } else if (weatherCode >= 71 && weatherCode <= 77) {
                condition = "Snowy";
                icon = "cloud-snow";
              } else if (weatherCode >= 80 && weatherCode <= 99) {
                condition = weatherCode >= 95 ? "Thunderstorm" : "Rainy";
                icon = "cloud-rain";
              }

              setWeather({
                temp: Math.round(data.current.temperature_2m),
                condition,
                humidity: data.current.relative_humidity_2m,
                windSpeed: Math.round(data.current.wind_speed_10m),
                location: geoData.city || geoData.locality || "Your Location",
                icon,
              });
              setWeatherLoading(false);
            },
            (error) => {
              // If location denied or unavailable, use default weather with helpful message
              const locationMessage = error.code === error.PERMISSION_DENIED
                ? (isIOS() ? "Enable in Settings" : "Location Denied")
                : "Location Disabled";
              setWeather({
                temp: 72,
                condition: "Partly Cloudy",
                humidity: 45,
                windSpeed: 8,
                location: locationMessage,
                icon: "cloud-sun",
              });
              setWeatherLoading(false);
            }
          );
        } else {
          // Location not enabled, show placeholder
          setWeather({
            temp: 72,
            condition: "Partly Cloudy",
            humidity: 45,
            windSpeed: 8,
            location: "Location Disabled",
            icon: "cloud-sun",
          });
          setWeatherLoading(false);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 15 minutes
    const weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, [isMetric, locationEnabled]);

  // Listen for location preference changes from settings
  useEffect(() => {
    const handleLocationPreferenceChange = (event: CustomEvent) => {
      setLocationEnabled(event.detail.enabled);
    };

    window.addEventListener("locationPreferenceChanged", handleLocationPreferenceChange as EventListener);
    return () => {
      window.removeEventListener("locationPreferenceChanged", handleLocationPreferenceChange as EventListener);
    };
  }, []);

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    // For iOS users who have denied location, direct them to settings
    if (isIOS() && weather?.location === "Enable in Settings") {
      // Show alert with instructions since we can't open Settings directly
      alert("To enable location:\n\n1. Open iPhone Settings\n2. Go to Safari > Location\n3. Allow location access\n4. Return here and refresh");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // Success - save preference
        localStorage.setItem("journalxp_location_enabled", "true");
        setLocationEnabled(true);
        window.dispatchEvent(new CustomEvent("locationPreferenceChanged", { detail: { enabled: true } }));
      },
      (error) => {
        // Permission denied - user needs to enable in browser/device settings
        if (isIOS()) {
          console.log("iOS location permission denied - user needs to enable in Settings");
        } else {
          console.log("Location permission denied");
        }
      }
    );
  };

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sun":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "cloud":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "cloud-sun":
        return <CloudSun className="h-8 w-8 text-yellow-400" />;
      case "cloud-rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "cloud-snow":
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-sky-50/80 to-cyan-50/80 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        {weatherLoading ? (
          <div className="flex items-center justify-center h-full py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Cloud className="h-8 w-8 text-sky-400" />
            </motion.div>
            <span className="ml-2 text-gray-500">Loading weather...</span>
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-md">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {weather.location}
                </span>
                {(weather.location === "Location Disabled" ||
                  weather.location === "Location Denied" ||
                  weather.location === "Enable in Settings") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEnableLocation}
                    className="h-6 text-xs px-2 ml-2 border-sky-300 text-sky-600 hover:bg-sky-50"
                  >
                    {weather.location === "Enable in Settings" ? "Settings" : "Enable"}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {getWeatherIcon(weather.icon)}
                </motion.div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-gray-800">
                    {weather.temp}°{isMetric ? "C" : "F"}
                  </div>
                  <p className="text-gray-600 font-medium">
                    {weather.condition}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-gray-400" />
                  <span>
                    {weather.windSpeed} {isMetric ? "km/h" : "mph"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMetric(!isMetric)}
                  className="h-7 w-7 p-0 text-sky-600 hover:text-sky-700 hover:bg-sky-100"
                  title={`Switch to ${isMetric ? "Imperial" : "Metric"}`}
                >
                  <Thermometer className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-100/80 to-cyan-100/80 backdrop-blur-sm border border-sky-200/60 flex items-center justify-center shadow-lg"
              >
                {getWeatherIcon(weather.icon)}
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Cloud className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Weather unavailable</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
