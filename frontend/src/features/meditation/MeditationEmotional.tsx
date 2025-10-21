import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={`cursor-pointer bg-gradient-to-br ${state.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">{state.emoji}</div>
            <h4 className="text-xl font-medium text-gray-800 mb-2">
              {state.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
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
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-lg mb-3 text-gray-800">
                Journal Prompts
              </h4>
              <div className="space-y-3">
                {state.journalPrompts.map((prompt, idx) => (
                  <p
                    key={idx}
                    className="text-gray-600 text-sm italic leading-relaxed p-3 bg-gray-50 rounded-lg"
                  >
                    "{prompt}"
                  </p>
                ))}
              </div>
              <Textarea
                placeholder="Write your thoughts here..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="mt-3 min-h-[100px]"
              />
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
