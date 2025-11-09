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
import React from "react";
import { FC } from "react";
import { Plus } from "lucide-react";
import { Habit } from "@/models/Habit";

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
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Plus className="h-5 w-5 mr-2" /> Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
                </SelectContent>
              </Select>
            </div>
          </div>
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
              min="0"
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
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button variant="outline" onClick={resetNewHabitForm}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={addOrUpdateHabit}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-2"
          >
            {editingHabitId ? "Update Habit" : "Add Habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


