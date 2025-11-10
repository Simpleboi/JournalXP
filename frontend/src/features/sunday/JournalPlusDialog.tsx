import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface JournalPlusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JournalPlusDialog({ open, onOpenChange }: JournalPlusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Upgrade to JournalXP Plus
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You've reached the limit of 25 free conversations with Sunday.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            To continue chatting with Sunday and unlock unlimited conversations, upgrade to JournalXP Plus.
          </p>

          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">JournalXP Plus includes:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Unlimited Sunday AI conversations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Advanced insights and analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Premium themes and customization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Priority support
              </li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground italic">
              JournalXP Plus subscription feature coming soon!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
