import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, MessageCircle } from "lucide-react";

interface JournalPlusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JournalPlusDialog({ open, onOpenChange }: JournalPlusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white/95 backdrop-blur-md border-2 border-purple-100/50 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg shadow-purple-200/50">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Daily Limit Reached
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2 text-gray-600">
            You've reached your daily limit of 25 conversations with Sunday.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-900">Resets at noon</p>
                <p className="text-sm text-purple-600">Come back tomorrow to continue chatting</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            This limit helps ensure Sunday can be available for everyone.
          </p>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-md"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
