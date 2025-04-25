import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveJournalEntry } from "@/services/JournalService";

const JournalForm = ({ onNewEntry }: { onNewEntry: () => void }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;

    await saveJournalEntry(user.uid, {
      content,
      mood,
      isFavorite: false,
      tags: [],
    });

    setContent("");
    setMood("neutral");
    onNewEntry();
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="How are you feeling today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Select value={mood} onValueChange={setMood}>
        <SelectTrigger>
          <SelectValue placeholder="Select mood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="happy">Happy</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
          <SelectItem value="sad">Sad</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit}>Save Entry</Button>
    </div>
  );
};

export default JournalForm;
