import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function ExperimentalFeatureNotice() {
  return (
    <div className="container mx-auto px-4 mt-4">
      <Alert className="border-amber-200 bg-amber-50/50 text-amber-900">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900 font-semibold">
          Experimental Feature
        </AlertTitle>
        <AlertDescription className="text-amber-800">
          This feature is experimental and may contain bugs or unfinished functionality. Your feedback is incredibly valuable, if you run into any issues, please report them through the <Link to="/about" className="underline font-semibold">Feedback form</Link> in the Community tab under the About Us section. 
        </AlertDescription>
      </Alert>
    </div>
  );
}
