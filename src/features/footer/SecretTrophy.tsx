// ModalWithCard.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ModalWithCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ModalWithCard({ open, setOpen }: ModalWithCardProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Congrats!! You found the Secret Achievement!🎉🥳
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-700 text-sm">
              I figured this was a fun achievement to unlock because no one
              reads the terms and conditions lol. I didn't even think to make
              a T.A.C. at all until I came up with this idea.
            </p>
            <br />
            <p className="text-gray-700 text-sm">Here's 200 points for finding this easer egg! To those who actually want a PDF copy of the terms and conditions, click the "Download Now" button underneath this text. Have a blessed day!</p>
          </CardContent>
        </Card>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button>Download Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
