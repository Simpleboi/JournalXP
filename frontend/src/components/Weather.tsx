import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import {
  Cloud,
  MapPin,
  Droplets,
  Wind,
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
} from "lucide-react";
import { useState, useEffect } from "react";

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

  // Weather fetch effect
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // Using Open-Meteo API
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto&temperature_unit=fahrenheit&wind_speed_unit=mph`
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
            () => {
              // If location denied, use default weather
              setWeather({
                temp: 72,
                condition: "Partly Cloudy",
                humidity: 45,
                windSpeed: 8,
                location: "Enable Location",
                icon: "cloud-sun",
              });
              setWeatherLoading(false);
            }
          );
        } else {
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
  }, []);

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
    <Card className="bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-100 shadow-lg overflow-hidden">
      <CardContent className="p-6">
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
              <div className="flex items-center gap-2 text-sky-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{weather.location}</span>
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
                    {weather.temp}°F
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
                  <span>{weather.windSpeed} mph</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center"
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
      </CardContent>
    </Card>
  );
};
