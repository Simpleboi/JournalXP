import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface PomoSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  notificationsEnabled: boolean;
  onAutoStartBreaksChange: (enabled: boolean) => void;
  onAutoStartFocusChange: (enabled: boolean) => void;
  onNotificationsEnabledChange: (enabled: boolean) => void;
}

export const PomoSettings: FC<PomoSettingsProps> = ({
  open,
  onOpenChange,
  autoStartBreaks,
  autoStartFocus,
  notificationsEnabled,
  onAutoStartBreaksChange,
  onAutoStartFocusChange,
  onNotificationsEnabledChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-indigo-600"
        >
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
              checked={autoStartBreaks}
              onCheckedChange={onAutoStartBreaksChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoFocus">Auto-start focus</Label>
            <Switch
              id="autoFocus"
              checked={autoStartFocus}
              onCheckedChange={onAutoStartFocusChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={onNotificationsEnabledChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
