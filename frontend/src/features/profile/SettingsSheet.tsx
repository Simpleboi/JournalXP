import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { ProfileLocation } from "./ProfileLocation";
import { ProfileJournal } from "./ProfileJournal";

interface SettingsSheetProps {
  trigger?: React.ReactNode;
}

export const SettingsSheet = ({ trigger }: SettingsSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-gray-100"
          >
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Settings</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Customize your app preferences and accessibility options
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-6 pb-8">
            {/* Accessibility Settings */}
            <AccessibilityPanel />

            {/* Location Settings */}
            <ProfileLocation />

            {/* Journal Preferences */}
            <ProfileJournal />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
