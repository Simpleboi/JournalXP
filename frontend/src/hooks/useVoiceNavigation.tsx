import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/context/AccessibilityContext";

interface VoiceCommand {
  phrases: string[];
  action: () => void;
  description: string;
}

interface UseVoiceNavigationOptions {
  onSave?: () => void;
  onCancel?: () => void;
  additionalCommands?: VoiceCommand[];
}

export function useVoiceNavigation({
  onSave,
  onCancel,
  additionalCommands = [],
}: UseVoiceNavigationOptions = {}) {
  const { settings } = useAccessibility();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");

  useEffect(() => {
    if (!settings.voiceNavigation) {
      stopListening();
      return;
    }

    // Check for browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Voice navigation not supported in this browser");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    // Define navigation commands
    const commands: VoiceCommand[] = [
      {
        phrases: ["go to journal", "open journal", "show journal"],
        action: () => navigate("/journal"),
        description: "Navigate to journal page",
      },
      {
        phrases: ["go to archive", "open archive", "show archive"],
        action: () => navigate("/journal#archive"),
        description: "Navigate to reflection archive",
      },
      {
        phrases: ["go home", "go to dashboard", "show dashboard"],
        action: () => navigate("/"),
        description: "Navigate to home dashboard",
      },
      {
        phrases: ["go to habits", "open habits", "show habits"],
        action: () => navigate("/habits"),
        description: "Navigate to habit tracker",
      },
      {
        phrases: ["go to tasks", "open tasks", "show tasks"],
        action: () => navigate("/tasks"),
        description: "Navigate to daily tasks",
      },
      {
        phrases: ["go to profile", "open profile", "show profile"],
        action: () => navigate("/profile"),
        description: "Navigate to profile page",
      },
      {
        phrases: ["save", "save entry", "save journal"],
        action: () => onSave?.(),
        description: "Save current entry",
      },
      {
        phrases: ["cancel", "go back", "nevermind"],
        action: () => onCancel?.(),
        description: "Cancel current action",
      },
      ...additionalCommands,
    ];

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase().trim();
      setTranscript(transcript);

      // Only process final results
      if (event.results[current].isFinal) {
        // Check if transcript matches any command
        for (const command of commands) {
          if (command.phrases.some((phrase) => transcript.includes(phrase))) {
            setLastCommand(transcript);
            command.action();

            // Provide audio feedback
            if ("speechSynthesis" in window) {
              const utterance = new SpeechSynthesisUtterance("Command executed");
              utterance.rate = 1.5;
              utterance.volume = 0.5;
              window.speechSynthesis.speak(utterance);
            }

            break;
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Voice recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert("Microphone access is required for voice navigation. Please allow microphone access in your browser settings.");
      }
    };

    recognition.onend = () => {
      // Restart if voice navigation is still enabled
      if (settings.voiceNavigation && isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error("Error restarting recognition:", error);
        }
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [settings.voiceNavigation, navigate, onSave, onCancel, isListening, additionalCommands]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Auto-start when voice navigation is enabled
  useEffect(() => {
    if (settings.voiceNavigation) {
      startListening();
    } else {
      stopListening();
    }
  }, [settings.voiceNavigation]);

  return {
    isListening,
    lastCommand,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  };
}
