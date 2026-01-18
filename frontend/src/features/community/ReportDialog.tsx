import { useState } from "react";
import { Flag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ReportReason } from "@shared/types/community";

interface ReportDialogProps {
  responseId: string;
  onReport: (responseId: string, reason: ReportReason, details?: string) => Promise<void>;
}

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: "inappropriate",
    label: "Inappropriate Content",
    description: "Contains offensive, harmful, or explicit material",
  },
  {
    value: "spam",
    label: "Spam",
    description: "Promotional content, advertisements, or repetitive posts",
  },
  {
    value: "harassment",
    label: "Harassment",
    description: "Bullying, threats, or targeted attacks",
  },
  {
    value: "other",
    label: "Other",
    description: "Something else that violates community guidelines",
  },
];

export function ReportDialog({ responseId, onReport }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason for your report");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onReport(responseId, reason, details.trim() || undefined);
      setOpen(false);
      // Reset form
      setReason("");
      setDetails("");
    } catch (err: any) {
      setError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full px-3"
        >
          <Flag className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Report Content
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe community. Please select a reason for your report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup
            value={reason}
            onValueChange={(value) => setReason(value as ReportReason)}
          >
            {REPORT_REASONS.map((r) => (
              <div key={r.value} className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value={r.value} id={r.value} className="mt-1" />
                <Label htmlFor={r.value} className="font-normal cursor-pointer">
                  <div className="font-medium">{r.label}</div>
                  <div className="text-sm text-gray-500">{r.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide any additional context that might help us review this report..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
