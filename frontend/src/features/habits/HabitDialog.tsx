// components/HabitDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { FC } from "react";
import { Plus, Infinity } from "lucide-react";
import { Habit } from "@/models/Habit";
import { useTheme } from "@/context/ThemeContext";

export interface HabitDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  editingHabitId: string | null;
  newHabit: Partial<Habit>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  setNewHabit: React.Dispatch<React.SetStateAction<Partial<Habit>>>;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetNewHabitForm: () => void;
  addOrUpdateHabit: () => void;
}

export const HabitDialog: FC<HabitDialogProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  editingHabitId,
  newHabit,
  handleInputChange,
  handleSelectChange,
  setNewHabit,
  handleNumberChange,
  resetNewHabitForm,
  addOrUpdateHabit,
}) => {
  const { theme } = useTheme();

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-5 w-5 mr-2" /> Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-2 border-white/50 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingHabitId ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
          <DialogDescription>
            {editingHabitId
              ? "You can edit the name, description, and category. Frequency, XP reward, and target completions are locked."
              : "Fill out the fields below to create your habit"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Habit Title
            </label>
            <Input
              id="title"
              name="title"
              value={newHabit.title || ""}
              onChange={handleInputChange}
              placeholder="e.g., Meditate 10 minutes"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={newHabit.description || ""}
              onChange={handleInputChange}
              placeholder="Why is this habit important to you?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={newHabit.category as string}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="frequency" className="text-sm font-medium">
                Frequency
                {editingHabitId && (
                  <span className="text-xs text-gray-500 ml-2">(locked)</span>
                )}
              </label>
              <Select
                value={newHabit.frequency as string}
                onValueChange={(value) =>
                  handleSelectChange("frequency", value)
                }
                disabled={!!editingHabitId}
              >
                <SelectTrigger className={editingHabitId ? "opacity-60 cursor-not-allowed" : ""}>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Custom Frequency Input */}
          {newHabit.frequency === "custom" && !editingHabitId && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="customInterval" className="text-sm font-medium">
                  Repeat Every
                </label>
                <Input
                  id="customInterval"
                  type="number"
                  min="1"
                  value={newHabit.customFrequency?.interval || ""}
                  onChange={(e) =>
                    setNewHabit((prev) => ({
                      ...prev,
                      customFrequency: {
                        interval: parseInt(e.target.value) || 1,
                        unit: prev.customFrequency?.unit || "days",
                      },
                    }))
                  }
                  placeholder="e.g., 3"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="customUnit" className="text-sm font-medium">
                  Time Unit
                </label>
                <Select
                  value={newHabit.customFrequency?.unit || "days"}
                  onValueChange={(value: "minutes" | "hours" | "days") =>
                    setNewHabit((prev) => ({
                      ...prev,
                      customFrequency: {
                        interval: prev.customFrequency?.interval || 1,
                        unit: value,
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {/* Optional Specific Time Picker */}
          {!editingHabitId && (
            <div className="grid gap-2">
              <label htmlFor="specificTime" className="text-sm font-medium">
                Specific Time (Optional)
              </label>
              <Input
                id="specificTime"
                type="time"
                value={newHabit.specificTime || ""}
                onChange={(e) =>
                  setNewHabit((prev) => ({
                    ...prev,
                    specificTime: e.target.value,
                  }))
                }
                placeholder="HH:mm"
              />
              <p className="text-xs text-gray-500">
                Set a specific time when this habit should reset (e.g., 9:00 AM daily)
              </p>
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="xpReward" className="text-sm font-medium">
              XP Reward
              {editingHabitId && (
                <span className="text-xs text-gray-500 ml-2">(locked)</span>
              )}
            </label>
            <Select
              value={String(newHabit.xpReward)}
              onValueChange={(value) =>
                setNewHabit((prev) => ({
                  ...prev,
                  xpReward: Number(value),
                }))
              }
              disabled={!!editingHabitId}
            >
              <SelectTrigger className={editingHabitId ? "opacity-60 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select XP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">+10 XP</SelectItem>
                <SelectItem value="25">+25 XP</SelectItem>
                <SelectItem value="50">+50 XP</SelectItem>
                <SelectItem value="100">+100 XP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="isIndefinite" className="text-sm font-medium">
                Indefinite Habit (Build Streaks)
                {editingHabitId && (
                  <span className="text-xs text-gray-500 ml-2">(locked)</span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <Switch
                  id="isIndefinite"
                  checked={!!newHabit.isIndefinite}
                  onCheckedChange={(checked) =>
                    setNewHabit((prev) => ({
                      ...prev,
                      isIndefinite: checked,
                    }))
                  }
                  disabled={!!editingHabitId}
                />
                <Infinity className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {newHabit.isIndefinite
                ? "Focus on maintaining your streak indefinitely"
                : "Set a specific target number of completions"}
            </p>
          </div>
          {!newHabit.isIndefinite && (
            <div className="grid gap-2">
              <label htmlFor="targetCompletions" className="text-sm font-medium">
                Target Completions
                {editingHabitId && (
                  <span className="text-xs text-gray-500 ml-2">(locked)</span>
                )}
              </label>
              <Input
                id="targetCompletions"
                name="targetCompletions"
                type="number"
                min="1"
                value={
                  newHabit.targetCompletions === undefined ||
                  newHabit.targetCompletions === null
                    ? ""
                    : newHabit.targetCompletions
                }
                onChange={handleNumberChange}
                placeholder="How many times to complete"
                disabled={!!editingHabitId}
                className={editingHabitId ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={resetNewHabitForm} className="rounded-xl border-gray-200 hover:bg-gray-50">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={addOrUpdateHabit}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {editingHabitId ? "Update Habit" : "Add Habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


