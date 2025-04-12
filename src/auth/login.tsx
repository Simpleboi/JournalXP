import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface LoginProps {
  className?: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
}

const Login = ({
  className = "",
  buttonVariant = "ghost",
  buttonSize = "default",
  buttonText = "Log in",
}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome Back
          </DialogTitle>
          <DialogDescription>
            Sign in to your JournalXP account to continue your wellness journey.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-indigo-200 focus:border-indigo-400"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-indigo-200 focus:border-indigo-400"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Sign In
            </Button>
          </DialogFooter>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm mb-2">or</p>
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-sm text-gray-700"
          >
            Continue with Google
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={() => {
              setIsOpen(false);
              // If you want to open the Signup modal here, you'd trigger it from a parent or route
            }}
          >
            Sign Up
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
