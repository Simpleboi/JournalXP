import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  PomodoroPreset,
  TimerPhase,
  AmbientSound,
  DEFAULT_PRESETS,
  INSPIRATIONAL_PHRASES,
} from "@/models/Pomo";
import {
  getAllPresets,
  saveCustomPreset,
  deleteCustomPreset,
  getPomodoroSettings,
  savePomodoroSettings,
  savePomodoroSession,
} from "@/services/PomoService";
import { PomoFullscreen } from "@/features/pomo/PomoFullScreen";
import { PomoTimerDisplay } from "@/features/pomo/PomoTimerDisplay";
import { PomoPresetSelector } from "@/features/pomo/PomoPresetSelector";
import { PomoCustomBuilder } from "@/features/pomo/PomoCustomBuilder";
import { PomoAmbientSounds } from "@/features/pomo/PomoAmbientSounds";
import { PomoSettings } from "@/features/pomo/PomoSettings";

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

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <PomoFullscreen
        currentPhase={currentPhase}
        selectedPreset={selectedPreset}
        setIsFullscreen={setIsFullscreen}
        timeRemaining={timeRemaining}
        progress={progress}
        inspirationalPhrase={inspirationalPhrase}
        isRunning={isRunning}
        isPaused={isPaused}
        currentCycle={currentCycle}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
      />
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
              <PomoSettings
                open={showSettings}
                onOpenChange={setShowSettings}
                autoStartBreaks={settings.autoStartBreaks}
                autoStartFocus={settings.autoStartFocus}
                notificationsEnabled={settings.notificationsEnabled}
                onAutoStartBreaksChange={(checked) => {
                  const updated = savePomodoroSettings(userId, {
                    autoStartBreaks: checked,
                  });
                  setSettings(updated);
                }}
                onAutoStartFocusChange={(checked) => {
                  const updated = savePomodoroSettings(userId, {
                    autoStartFocus: checked,
                  });
                  setSettings(updated);
                }}
                onNotificationsEnabledChange={(checked) => {
                  const updated = savePomodoroSettings(userId, {
                    notificationsEnabled: checked,
                  });
                  setSettings(updated);
                }}
              />
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
          <PomoTimerDisplay
            currentPhase={currentPhase}
            selectedPreset={selectedPreset}
            timeRemaining={timeRemaining}
            progress={progress}
            currentCycle={currentCycle}
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
          />
        </motion.div>

        {/* Presets & Custom Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PomoPresetSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
            presets={presets}
            customPresets={customPresets}
            selectedPreset={selectedPreset}
            onPresetSelect={handlePresetChange}
            onDeletePreset={(preset) => {
              setPresetToDelete(preset);
              setDeleteDialogOpen(true);
            }}
            customTabContent={
              <PomoCustomBuilder
                customName={customName}
                customFocus={customFocus}
                customShortBreak={customShortBreak}
                customLongBreak={customLongBreak}
                customCycles={customCycles}
                customSound={customSound}
                customColor={customColor}
                customAutoStart={customAutoStart}
                onNameChange={setCustomName}
                onFocusChange={setCustomFocus}
                onShortBreakChange={setCustomShortBreak}
                onLongBreakChange={setCustomLongBreak}
                onCyclesChange={setCustomCycles}
                onSoundChange={setCustomSound}
                onColorChange={setCustomColor}
                onAutoStartChange={setCustomAutoStart}
                onSave={handleSaveCustomPreset}
              />
            }
          />
        </motion.div>

        {/* Sound Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <PomoAmbientSounds
            soundEnabled={soundEnabled}
            currentSound={currentSound}
            volume={volume}
            onSoundEnabledChange={setSoundEnabled}
            onSoundChange={setCurrentSound}
            onVolumeChange={setVolume}
          />
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
