import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SetUsernameProps {
  onSuccess: () => void;
}

const SetUsername: React.FC<SetUsernameProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSetUsername = async () => {
    if (!user) return;
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { username: username.trim() });
      setSuccess(true);
      setError("");

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Set Your Username</h3>
      <Input
        placeholder="Enter a username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={handleSetUsername} className="mt-2">
        Save Username
      </Button>
      {success && (
        <p className="text-green-600 text-sm mt-2">Saved successfully!</p>
      )}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default SetUsername;
