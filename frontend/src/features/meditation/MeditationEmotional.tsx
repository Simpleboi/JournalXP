import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Save, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { saveJournalEntry } from "@/services/JournalService";
import { useToast } from "@/hooks/useToast";

interface emotionalStatesProps {
  setJournalEntry: React.Dispatch<React.SetStateAction<string>>;
  journalEntry: string;
  state: any;
}

export const EmotionalStatesDialog: FC<emotionalStatesProps> = ({
  setJournalEntry,
  journalEntry,
  state,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const { showToast } = useToast();

  const currentPrompt = state.journalPrompts[currentPromptIndex];
  const totalPrompts = state.journalPrompts.length;

  const nextPrompt = () => {
    if (currentPromptIndex < totalPrompts - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const previousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  const handleSaveJournal = async () => {
    if (!journalEntry.trim()) {
      showToast({
        title: "Empty Entry",
        description: "Please write something before saving.",
      });
      return;
    }

    try {
      setIsSaving(true);

      // Include only the current prompt being responded to
      const fullContent = `--- Guided Meditation Journal: ${state.title} ---\n\nPrompt: ${currentPrompt}\n\n--- My Reflection ---\n\n${journalEntry}`;

      await saveJournalEntry({
        type: "guided",
        content: fullContent,
        mood: state.title.toLowerCase(), // e.g., "anger", "sadness", "anxiety"
      });

      showToast({
        title: "Journal Saved!",
        description: `Your ${state.title.toLowerCase()} reflection has been saved and you earned 30 XP!`,
      });

      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
        setJournalEntry(""); // Clear the textarea
        setIsOpen(false); // Close the dialog
      }, 1500);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      showToast({
        title: "Save Failed",
        description: "Could not save your journal entry. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card
          className={`cursor-pointer bg-gradient-to-br ${state.color} border-2 border-white/50 shadow-lg hover:shadow-xl hover:border-gray-200 transition-all duration-300 backdrop-blur-sm`}
        >
          <CardContent className="p-5 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{state.emoji}</div>
            <h4 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
              {state.title}
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {state.description}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{state.emoji}</span>
            {state.title} Support
          </DialogTitle>
        </DialogHeader>

        {/* Intro Message */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <p className="text-gray-700 text-sm leading-relaxed italic">
            {state.introMessage}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Breathing Techniques
              </h4>
              <ul className="space-y-2">
                {state.techniques.map((technique, idx) => (
                  <li
                    key={idx}
                    className="text-gray-600 text-sm leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-blue-500 mt-1">•</span>
                    {technique}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Grounding Techniques
              </h4>
              <ul className="space-y-2">
                {state.grounding.map((technique, idx) => (
                  <li
                    key={idx}
                    className="text-gray-600 text-sm leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    {technique}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Body Awareness
              </h4>
              <ul className="space-y-2">
                {state.bodyAwareness.map((technique, idx) => (
                  <li
                    key={idx}
                    className="text-gray-600 text-sm leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-purple-500 mt-1">•</span>
                    {technique}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Journal Prompts
              </h4>

              {/* Prompt Carousel */}
              <div className="space-y-4">
                {/* Prompt Counter */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Prompt {currentPromptIndex + 1} of {totalPrompts}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPrompts }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPromptIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentPromptIndex
                            ? "bg-indigo-600 w-6"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to prompt ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Current Prompt Display */}
                <div className="relative px-12">
                  <div className="text-gray-700 italic leading-relaxed p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 min-h-[80px] flex items-center">
                    <p className="text-center w-full px-4">"{currentPrompt}"</p>
                  </div>

                  {/* Navigation Buttons - Positioned outside the prompt card */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
                    <Button
                      onClick={previousPrompt}
                      disabled={currentPromptIndex === 0}
                      variant="outline"
                      size="sm"
                      className="pointer-events-auto rounded-full h-10 w-10 p-0 bg-white shadow-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={nextPrompt}
                      disabled={currentPromptIndex === totalPrompts - 1}
                      variant="outline"
                      size="sm"
                      className="pointer-events-auto rounded-full h-10 w-10 p-0 bg-white shadow-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <Textarea
                placeholder="Write your thoughts here..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="mt-4 min-h-[120px]"
              />
              <Button
                onClick={handleSaveJournal}
                disabled={isSaving || justSaved || !journalEntry.trim()}
                className={`mt-3 w-full transition-all ${
                  justSaved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : justSaved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save to Journal
                  </>
                )}
              </Button>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Guided Meditation
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed p-4 bg-blue-50 rounded-lg">
                {state.meditation}
              </p>
              <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Start Meditation
              </Button>
            </div>
          </div>
        </div>

        {/* External Resources Section */}
        {state.externalResources && state.externalResources.length > 0 && (
          <div className="mt-8">
            <h4 className="font-medium text-lg mb-3 text-gray-800">
              Helpful Resources
            </h4>
            <ul className="space-y-2">
              {state.externalResources.map((resource, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-blue-600 hover:underline">
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
