import { Loader} from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";

export interface SpinnerProps {
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ className }) => {
  return (
    <div className="">
      <Loader className={cn("h-10 w-10 animate-spin text-primary", className)} />
    </div>
  );
};
