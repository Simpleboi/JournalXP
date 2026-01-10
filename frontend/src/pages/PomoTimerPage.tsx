import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize2,
  Volume2,
  VolumeX,
  ChevronLeft,
  Coffee,
  Brain,
  Sparkles,
  Clock,
  Plus,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PomodoroPreset,
  TimerPhase,
  AmbientSound,
  DEFAULT_PRESETS,
  AMBIENT_SOUNDS,
  THEME_COLORS,
  INSPIRATIONAL_PHRASES,
} from "@/models/Pomo";
import {
  getAllPresets,
  saveCustomPreset,
  deleteCustomPreset,
  getPomodoroSettings,
  savePomodoroSettings,
  formatTime,
  calculateTotalSessionDuration,
  formatDuration,
  savePomodoroSession,
} from "@/services/PomoService";

export default function PomodoroTimer() {
  const userId = "demo-user";

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>("focus");
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>(DEFAULT_PRESETS[0]);
  const [presets, setPresets] = useState<PomodoroPreset[]>(DEFAULT_PRESETS);
  const [customPresets, setCustomPresets] = useState<PomodoroPreset[]>([]);

  // Settings
  const [settings, setSettings] = useState(getPomodoroSettings(userId));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSound, setCurrentSound] = useState<AmbientSound>("none");
  const [volume, setVolume] = useState(50);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("presets");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<PomodoroPreset | null>(null);
  const [inspirationalPhrase, setInspirationalPhrase] = useState(
    INSPIRATIONAL_PHRASES[Math.floor(Math.random() * INSPIRATIONAL_PHRASES.length)]
  );

  // Custom preset builder state
  const [customName, setCustomName] = useState("");
  const [customFocus, setCustomFocus] = useState(25);
  const [customShortBreak, setCustomShortBreak] = useState(5);
  const [customLongBreak, setCustomLongBreak] = useState(15);
  const [customCycles, setCustomCycles] = useState(4);
  const [customSound, setCustomSound] = useState<AmbientSound>("none");
  const [customColor, setCustomColor] = useState("#6366f1");
  const [customAutoStart, setCustomAutoStart] = useState(false);

  // Session tracking
  const sessionStartRef = useRef<string | null>(null);
  const focusMinutesRef = useRef(0);
  const completedCyclesRef = useRef(0);

  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Generate ambient sounds using Web Audio API
  const generateAmbientSound = (type: AmbientSound) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 4; // 4 seconds of audio
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);

    switch (type) {
      case "brownNoise": {
        // Brown noise (Brownian noise)
        let lastOutL = 0.0, lastOutR = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          leftChannel[i] = (lastOutL + 0.02 * whiteL) / 1.02;
          rightChannel[i] = (lastOutR + 0.02 * whiteR) / 1.02;
          lastOutL = leftChannel[i];
          lastOutR = rightChannel[i];
          leftChannel[i] *= 3.5;
          rightChannel[i] *= 3.5;
        }
        break;
      }

      case "whiteNoise": {
        // White noise
        for (let i = 0; i < bufferSize; i++) {
          leftChannel[i] = Math.random() * 2 - 1;
          rightChannel[i] = Math.random() * 2 - 1;
        }
        break;
      }

      case "rain": {
        // Simulate rain with filtered noise and random droplets
        let lastOutL = 0.0, lastOutR = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          // Low-pass filtered noise for rain sound
          lastOutL = lastOutL * 0.95 + whiteL * 0.05;
          lastOutR = lastOutR * 0.95 + whiteR * 0.05;
          // Add random droplet sounds
          if (Math.random() > 0.998) {
            lastOutL += (Math.random() - 0.5) * 0.3;
            lastOutR += (Math.random() - 0.5) * 0.3;
          }
          leftChannel[i] = lastOutL * 2;
          rightChannel[i] = lastOutR * 2;
        }
        break;
      }

      case "ocean": {
        // Simulate ocean waves with low-frequency oscillation
        for (let i = 0; i < bufferSize; i++) {
          const t = i / audioContext.sampleRate;
          // Multiple sine waves for wave motion
          const wave1 = Math.sin(2 * Math.PI * 0.1 * t) * 0.5;
          const wave2 = Math.sin(2 * Math.PI * 0.15 * t) * 0.3;
          const wave3 = Math.sin(2 * Math.PI * 0.08 * t) * 0.4;
          // Add noise for foam/texture
          const noise = (Math.random() * 2 - 1) * 0.1;
          leftChannel[i] = (wave1 + wave2 + wave3 + noise) * 0.8;
          rightChannel[i] = (wave1 * 0.9 + wave2 * 1.1 + wave3 + noise) * 0.8;
        }
        break;
      }

      case "forest": {
        // Simulate forest with filtered noise and bird-like chirps
        let baseL = 0.0, baseR = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const t = i / audioContext.sampleRate;
          // Gentle wind through trees (filtered noise)
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          baseL = baseL * 0.98 + whiteL * 0.02;
          baseR = baseR * 0.98 + whiteR * 0.02;

          // Random bird chirps
          let chirp = 0;
          if (Math.random() > 0.9995) {
            chirp = Math.sin(2 * Math.PI * (2000 + Math.random() * 1000) * t) * 0.1;
          }

          leftChannel[i] = (baseL * 0.3 + chirp) * 1.5;
          rightChannel[i] = (baseR * 0.3 + chirp * 0.9) * 1.5;
        }
        break;
      }

      case "cafe": {
        // Simulate cafe with multiple noise layers
        let murmurL = 0.0, murmurR = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          // People talking (mid-frequency murmur)
          murmurL = murmurL * 0.85 + whiteL * 0.15;
          murmurR = murmurR * 0.85 + whiteR * 0.15;

          // Random clinks and movements
          let clink = 0;
          if (Math.random() > 0.997) {
            clink = (Math.random() - 0.5) * 0.2;
          }

          leftChannel[i] = (murmurL * 0.4 + clink) * 1.2;
          rightChannel[i] = (murmurR * 0.4 + clink * 0.8) * 1.2;
        }
        break;
      }

      case "fireplace": {
        // Simulate fireplace with crackling
        let crackleL = 0.0, crackleR = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          // Base fire rumble
          crackleL = crackleL * 0.95 + whiteL * 0.05;
          crackleR = crackleR * 0.95 + whiteR * 0.05;

          // Random pops and crackles
          if (Math.random() > 0.99) {
            crackleL += (Math.random() - 0.5) * 0.5;
            crackleR += (Math.random() - 0.5) * 0.5;
          }

          leftChannel[i] = crackleL * 2.5;
          rightChannel[i] = crackleR * 2.5;
        }
        break;
      }
    }

    return { audioContext, buffer };
  };

  // Load presets
  useEffect(() => {
    const allPresets = getAllPresets(userId);
    const defaults = allPresets.filter(p => p.isDefault);
    const customs = allPresets.filter(p => !p.isDefault);
    setPresets(defaults);
    setCustomPresets(customs);
  }, []);

  // Handle ambient sound playback
  useEffect(() => {
    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (noiseNodeRef.current) {
      noiseNodeRef.current.stop();
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // If no sound selected or sound is disabled, do nothing
    if (currentSound === "none" || !soundEnabled) {
      return;
    }

    // Generate and play the ambient sound
    const { audioContext, buffer } = generateAmbientSound(currentSound);

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    source.buffer = buffer;
    source.loop = true;
    gainNode.gain.value = volume / 100;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);

    audioContextRef.current = audioContext;
    noiseNodeRef.current = source;
    gainNodeRef.current = gainNode;

    return () => {
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [currentSound, soundEnabled]);

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handlePhaseComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeRemaining]);

  const handlePhaseComplete = useCallback(() => {
    // Play notification sound
    if (settings.notificationsEnabled) {
      playNotificationSound();
    }

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(
        currentPhase === "focus" ? "Focus session complete!" : "Break is over!",
        {
          body: currentPhase === "focus" 
            ? "Time for a break. You earned it!" 
            : "Ready to focus again?",
          icon: "/favicon.ico",
        }
      );
    }

    if (currentPhase === "focus") {
      focusMinutesRef.current += selectedPreset.focusDuration;
      completedCyclesRef.current += 1;

      if (currentCycle >= selectedPreset.cyclesBeforeLongBreak) {
        // Long break
        setCurrentPhase("longBreak");
        setTimeRemaining(selectedPreset.longBreakDuration * 60);
        setCurrentCycle(1);
      } else {
        // Short break
        setCurrentPhase("shortBreak");
        setTimeRemaining(selectedPreset.shortBreakDuration * 60);
        setCurrentCycle((prev) => prev + 1);
      }

      if (settings.autoStartBreaks) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    } else {
      // Break complete, back to focus
      setCurrentPhase("focus");
      setTimeRemaining(selectedPreset.focusDuration * 60);

      if (settings.autoStartFocus) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }

    // New inspirational phrase
    setInspirationalPhrase(
      INSPIRATIONAL_PHRASES[Math.floor(Math.random() * INSPIRATIONAL_PHRASES.length)]
    );
  }, [currentPhase, currentCycle, selectedPreset, settings]);

  const playNotificationSound = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.3;

    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  };

  const handleStart = () => {
    if (!sessionStartRef.current) {
      sessionStartRef.current = new Date().toISOString();
    }
    setIsRunning(true);
    setIsPaused(false);

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase("focus");
    setTimeRemaining(selectedPreset.focusDuration * 60);
    setCurrentCycle(1);

    // Save session if there was progress
    if (sessionStartRef.current && focusMinutesRef.current > 0) {
      savePomodoroSession(userId, {
        userId,
        presetId: selectedPreset.id,
        presetName: selectedPreset.name,
        startedAt: sessionStartRef.current,
        endedAt: new Date().toISOString(),
        completedCycles: completedCyclesRef.current,
        totalFocusMinutes: focusMinutesRef.current,
        totalBreakMinutes: 0,
        wasCompleted: false,
      });
    }

    sessionStartRef.current = null;
    focusMinutesRef.current = 0;
    completedCyclesRef.current = 0;
  };

  const handlePresetChange = (presetId: string) => {
    const preset = [...presets, ...customPresets].find((p) => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset);
      setTimeRemaining(preset.focusDuration * 60);
      setCurrentPhase("focus");
      setCurrentCycle(1);
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  const handleSaveCustomPreset = () => {
    if (!customName.trim()) return;

    const newPreset = saveCustomPreset(userId, {
      name: customName,
      focusDuration: customFocus,
      shortBreakDuration: customShortBreak,
      longBreakDuration: customLongBreak,
      cyclesBeforeLongBreak: customCycles,
      soundPreference: customSound,
      themeColor: customColor,
      autoStartBreaks: customAutoStart,
      autoStartFocus: customAutoStart,
    });

    setCustomPresets([...customPresets, newPreset]);
    setSelectedPreset(newPreset);
    setTimeRemaining(newPreset.focusDuration * 60);
    setShowCustomBuilder(false);
    setActiveTab("my-timers");

    // Reset form
    setCustomName("");
    setCustomFocus(25);
    setCustomShortBreak(5);
    setCustomLongBreak(15);
    setCustomCycles(4);
    setCustomSound("none");
    setCustomColor("#6366f1");
    setCustomAutoStart(false);
  };

  const handleDeletePreset = (preset: PomodoroPreset) => {
    setPresetToDelete(preset);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePreset = () => {
    if (!presetToDelete) return;

    const success = deleteCustomPreset(userId, presetToDelete.id);

    if (success) {
      // Remove from state
      setCustomPresets(customPresets.filter(p => p.id !== presetToDelete.id));

      // If the deleted preset was selected, reset to default
      if (selectedPreset.id === presetToDelete.id) {
        setSelectedPreset(DEFAULT_PRESETS[0]);
        setTimeRemaining(DEFAULT_PRESETS[0].focusDuration * 60);
        setCurrentPhase("focus");
        setCurrentCycle(1);
        setIsRunning(false);
        setIsPaused(false);
      }
    }

    setDeleteDialogOpen(false);
    setPresetToDelete(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Calculate progress percentage
  const totalSeconds =
    currentPhase === "focus"
      ? selectedPreset.focusDuration * 60
      : currentPhase === "shortBreak"
      ? selectedPreset.shortBreakDuration * 60
      : selectedPreset.longBreakDuration * 60;
  const progress = ((totalSeconds - timeRemaining) / totalSeconds) * 100;

  // Phase colors
  const getPhaseColors = () => {
    const customColor = (selectedPreset as any).themeColor;

    if (customColor) {
      // Use custom color for all phases
      return {
        bg: "from-indigo-500 to-purple-600",
        ring: customColor,
        text: "text-gray-800",
        badge: "bg-gray-100 text-gray-700",
        customColor: customColor,
      };
    }

    // Default phase colors
    const phaseColors = {
      focus: {
        bg: "from-indigo-500 to-purple-600",
        ring: "stroke-indigo-500",
        text: "text-indigo-600",
        badge: "bg-indigo-100 text-indigo-700",
        customColor: undefined,
      },
      shortBreak: {
        bg: "from-emerald-500 to-teal-600",
        ring: "stroke-emerald-500",
        text: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
        customColor: undefined,
      },
      longBreak: {
        bg: "from-amber-500 to-orange-600",
        ring: "stroke-amber-500",
        text: "text-amber-600",
        badge: "bg-amber-100 text-amber-700",
        customColor: undefined,
      },
    };

    return phaseColors[currentPhase];
  };

  const currentColors = getPhaseColors();

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={currentColors.customColor ? "fixed inset-0 z-50 flex flex-col items-center justify-center" : `fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${currentColors.bg}`}
        style={
          currentColors.customColor
            ? { background: `linear-gradient(to bottom right, ${currentColors.customColor}, ${currentColors.customColor}cc)` }
            : undefined
        }
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10"
        >
          <Maximize2 className="h-6 w-6" />
        </Button>

        {/* Giant Timer */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={currentColors.customColor || "white"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl md:text-8xl font-bold text-white">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-xl text-white/80 mt-2 capitalize">
              {currentPhase === "shortBreak"
                ? "Short Break"
                : currentPhase === "longBreak"
                ? "Long Break"
                : "Focus"}
            </span>
          </div>
        </div>

        {/* Inspirational phrase */}
        <motion.p
          key={inspirationalPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/70 text-lg mt-8 text-center px-4 max-w-md"
        >
          "{inspirationalPhrase}"
        </motion.p>

        {/* Minimal controls */}
        <div className="flex items-center gap-4 mt-8">
          {!isRunning || isPaused ? (
            <Button
              size="lg"
              onClick={isPaused ? handleResume : handleStart}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              style={
                currentColors.customColor
                  ? { backgroundColor: `${currentColors.customColor}40`, backdropFilter: "blur(12px)" }
                  : undefined
              }
            >
              <Play className="h-6 w-6 mr-2" />
              {isPaused ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handlePause}
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              style={
                currentColors.customColor
                  ? { backgroundColor: `${currentColors.customColor}40`, backdropFilter: "blur(12px)" }
                  : undefined
              }
            >
              <Pause className="h-6 w-6 mr-2" />
              Pause
            </Button>
          )}
          <Button
            size="lg"
            variant="ghost"
            onClick={handleReset}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Cycle indicator */}
        <div className="flex items-center gap-2 mt-6">
          {Array.from({ length: selectedPreset.cyclesBeforeLongBreak }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentCycle ? "bg-white" : "bg-white/30"
              }`}
              style={
                currentColors.customColor && i < currentCycle
                  ? { backgroundColor: currentColors.customColor }
                  : undefined
              }
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Pomodoro Timer
                </h1>
                <p className="text-sm text-gray-600">
                  Focus, break, repeat
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-gray-600 hover:text-indigo-600"
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-indigo-600">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Timer Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoBreaks">Auto-start breaks</Label>
                      <Switch
                        id="autoBreaks"
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) => {
                          const updated = savePomodoroSettings(userId, {
                            autoStartBreaks: checked,
                          });
                          setSettings(updated);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoFocus">Auto-start focus</Label>
                      <Switch
                        id="autoFocus"
                        checked={settings.autoStartFocus}
                        onCheckedChange={(checked) => {
                          const updated = savePomodoroSettings(userId, {
                            autoStartFocus: checked,
                          });
                          setSettings(updated);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Notifications</Label>
                      <Switch
                        id="notifications"
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => {
                          const updated = savePomodoroSettings(userId, {
                            notificationsEnabled: checked,
                          });
                          setSettings(updated);
                        }}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Timer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="shadow-xl overflow-hidden">
            <CardHeader
              className={currentColors.customColor ? "text-white" : `bg-gradient-to-r ${currentColors.bg} text-white`}
              style={
                currentColors.customColor
                  ? { background: `linear-gradient(to right, ${currentColors.customColor}, ${currentColors.customColor}dd)` }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentPhase === "focus" ? (
                    <Brain className="h-6 w-6" />
                  ) : (
                    <Coffee className="h-6 w-6" />
                  )}
                  <div>
                    <CardTitle className="text-white">
                      {currentPhase === "focus"
                        ? "Focus Time"
                        : currentPhase === "shortBreak"
                        ? "Short Break"
                        : "Long Break"}
                    </CardTitle>
                    <p className="text-white/80 text-sm">
                      Cycle {currentCycle} of {selectedPreset.cyclesBeforeLongBreak}
                    </p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  {selectedPreset.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {/* Circular Timer */}
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={currentColors.customColor || undefined}
                      className={!currentColors.customColor ? currentColors.ring : undefined}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 90}
                      strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl md:text-6xl font-bold ${currentColors.text}`}>
                      {formatTime(timeRemaining)}
                    </span>
                    <span className="text-gray-500 mt-2">
                      {Math.floor(timeRemaining / 60)} min remaining
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mt-8">
                  {!isRunning || isPaused ? (
                    <Button
                      size="lg"
                      onClick={isPaused ? handleResume : handleStart}
                      className={currentColors.customColor ? "hover:opacity-90" : `bg-gradient-to-r ${currentColors.bg} hover:opacity-90`}
                      style={
                        currentColors.customColor
                          ? { backgroundColor: currentColors.customColor, color: "white" }
                          : undefined
                      }
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {isPaused ? "Resume" : "Start"}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handlePause}
                      variant="outline"
                      className={!currentColors.customColor ? currentColors.text : ""}
                      style={
                        currentColors.customColor
                          ? { borderColor: currentColors.customColor, color: currentColors.customColor }
                          : undefined
                      }
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={handleReset}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                {/* Cycle dots */}
                <div className="flex items-center gap-2 mt-6">
                  {Array.from({ length: selectedPreset.cyclesBeforeLongBreak }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < currentCycle && !currentColors.customColor
                          ? currentPhase === "focus"
                            ? "bg-indigo-500"
                            : currentPhase === "shortBreak"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                          : i < currentCycle
                          ? ""
                          : "bg-gray-200"
                      }`}
                      style={
                        currentColors.customColor && i < currentCycle
                          ? { backgroundColor: currentColors.customColor }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Presets & Custom Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="my-timers">My Timers</TabsTrigger>
              <TabsTrigger value="custom">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="presets">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {presets.map((preset) => (
                  <motion.div
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedPreset.id === preset.id
                          ? "ring-2 ring-indigo-500 bg-indigo-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => handlePresetChange(preset.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          {selectedPreset.id === preset.id && (
                            <Check className="h-4 w-4 text-indigo-600 mr-1" />
                          )}
                          <span className="font-semibold text-gray-800">
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {preset.focusDuration}/{preset.shortBreakDuration}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDuration(calculateTotalSessionDuration(preset))} total
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-timers">
              {customPresets.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Clock className="h-12 w-12 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">No Custom Timers Yet</h3>
                      <p className="text-sm text-gray-500">
                        Create your first custom timer in the "Create New" tab
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {customPresets.map((preset) => (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group"
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedPreset.id === preset.id
                            ? "ring-2 ring-offset-2 shadow-md"
                            : "hover:shadow-md"
                        }`}
                        style={{
                          borderColor: selectedPreset.id === preset.id
                            ? (preset as any).themeColor
                            : undefined,
                          backgroundColor: selectedPreset.id === preset.id
                            ? `${(preset as any).themeColor}10`
                            : undefined,
                        }}
                        onClick={() => handlePresetChange(preset.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center mb-2">
                            {selectedPreset.id === preset.id && (
                              <Check className="h-4 w-4 mr-1" style={{ color: (preset as any).themeColor }} />
                            )}
                            <span className="font-semibold text-gray-800">
                              {preset.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {preset.focusDuration}/{preset.shortBreakDuration}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDuration(calculateTotalSessionDuration(preset))} total
                          </p>
                          {(preset as any).themeColor && (
                            <div
                              className="w-6 h-1 mx-auto mt-2 rounded-full"
                              style={{ backgroundColor: (preset as any).themeColor }}
                            />
                          )}
                        </CardContent>
                      </Card>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-1 right-1 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePreset(preset);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Custom Timer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customName">Timer Name</Label>
                      <Input
                        id="customName"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="My Custom Timer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customFocus">Focus Duration (min)</Label>
                      <Input
                        id="customFocus"
                        type="number"
                        value={customFocus}
                        onChange={(e) => setCustomFocus(parseInt(e.target.value) || 25)}
                        min={1}
                        max={120}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customShortBreak">Short Break (min)</Label>
                      <Input
                        id="customShortBreak"
                        type="number"
                        value={customShortBreak}
                        onChange={(e) => setCustomShortBreak(parseInt(e.target.value) || 5)}
                        min={1}
                        max={30}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customLongBreak">Long Break (min)</Label>
                      <Input
                        id="customLongBreak"
                        type="number"
                        value={customLongBreak}
                        onChange={(e) => setCustomLongBreak(parseInt(e.target.value) || 15)}
                        min={1}
                        max={60}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customCycles">Cycles Before Long Break</Label>
                      <Input
                        id="customCycles"
                        type="number"
                        value={customCycles}
                        onChange={(e) => setCustomCycles(parseInt(e.target.value) || 4)}
                        min={1}
                        max={10}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Ambient Sound</Label>
                      <Select value={customSound} onValueChange={(v: AmbientSound) => setCustomSound(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AMBIENT_SOUNDS.map((sound) => (
                            <SelectItem key={sound.value} value={sound.value}>
                              {sound.icon} {sound.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Theme Color</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {THEME_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setCustomColor(color.value)}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            customColor === color.value ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="customAutoStart">Auto-start sessions</Label>
                    <Switch
                      id="customAutoStart"
                      checked={customAutoStart}
                      onCheckedChange={setCustomAutoStart}
                    />
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Session Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Duration:</span>
                        <span className="ml-2 font-medium">
                          {formatDuration(
                            customFocus * customCycles +
                              customShortBreak * (customCycles - 1) +
                              customLongBreak
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Focus Time:</span>
                        <span className="ml-2 font-medium">
                          {formatDuration(customFocus * customCycles)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveCustomPreset}
                    disabled={!customName.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create & Use Timer
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Sound Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  Ambient Sounds
                </CardTitle>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {AMBIENT_SOUNDS.map((sound) => (
                  <Button
                    key={sound.value}
                    variant={currentSound === sound.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentSound(sound.value);
                      if (sound.value !== "none") {
                        setSoundEnabled(true);
                      }
                    }}
                    className={currentSound === sound.value ? "bg-indigo-600" : ""}
                    disabled={!soundEnabled && sound.value !== "none"}
                  >
                    {sound.icon} {sound.label}
                  </Button>
                ))}
              </div>
              {currentSound !== "none" && soundEnabled && (
                <div className="mt-4">
                  <Label>Volume: {volume}%</Label>
                  <Slider
                    value={[volume]}
                    onValueChange={(v) => setVolume(v[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Custom Timer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{presetToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPresetToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeletePreset}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
