import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Award,
  CheckCircle,
  Calendar,
  Flame,
  Target,
  ArrowLeft,
} from "lucide-react";
import { Habit } from "@/models/Habit";
import { Link } from "react-router-dom";
import { GetCategoryColor } from "@/features/habits/HabitUtils";
import { GetFrequencyText } from "@/features/habits/HabitUtils";
import { CalculateProgress } from "@/features/habits/HabitUtils";
import { EmptyState } from "@/features/habits/HabitEmptyState";
import { HabitHeader } from "@/features/habits/HabitHeader";
import { HabitCard } from "@/features/habits/HabitCardElement";

const HabitBuilderPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    title: "",
    description: "",
    frequency: "daily",
    category: "mindfulness",
    xpReward: 10,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewHabit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewHabit((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHabit((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const resetNewHabitForm = () => {
    setNewHabit({
      title: "",
      description: "",
      frequency: "daily",
      category: "mindfulness",
      xpReward: 10,
    });
    setEditingHabitId(null);
  };

  const addOrUpdateHabit = () => {
    if (!newHabit.title) return;

    if (editingHabitId) {
      // Update existing habit
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                ...newHabit,
              }
            : habit
        )
      );
    } else {
      // Add new habit
      const habit: Habit = {
        id: Date.now().toString(),
        title: newHabit.title || "",
        description: newHabit.description || "",
        frequency: newHabit.frequency as "daily" | "weekly" | "monthly",
        customFrequency: newHabit.customFrequency,
        completed: false,
        streak: 0,
        xpReward: newHabit.xpReward || 10,
        category: newHabit.category as
          | "mindfulness"
          | "physical"
          | "social"
          | "productivity",
        customCategory: newHabit.customCategory,
        createdAt: new Date().toISOString(),
        targetCompletions: newHabit.targetCompletions || 1,
        currentCompletions: 0,
      };

      setHabits((prevHabits) => [...prevHabits, habit]);
    }

    resetNewHabitForm();
    setIsAddDialogOpen(false);
  };

  const editHabit = (habitId: string) => {
    const habitToEdit = habits.find((habit) => habit.id === habitId);
    if (habitToEdit) {
      setNewHabit(habitToEdit);
      setEditingHabitId(habitId);
      setIsAddDialogOpen(true);
    }
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.filter((habit) => habit.id !== habitId)
    );
  };

  const toggleHabitCompletion = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === habitId) {
          const now = new Date();
          const today = now.toISOString().split("T")[0];
          const wasCompletedToday = habit.lastCompleted?.startsWith(today);

          // If already completed today, uncomplete it
          if (wasCompletedToday && habit.completed) {
            return {
              ...habit,
              completed: false,
              lastCompleted: undefined,
              streak: Math.max(0, habit.streak - 1),
              currentCompletions: Math.max(
                0,
                (habit.currentCompletions || 0) - 1
              ),
            };
          }
          // Otherwise, mark as completed
          else {
            return {
              ...habit,
              completed: true,
              lastCompleted: now.toISOString(),
              streak: habit.streak + 1,
              currentCompletions: (habit.currentCompletions || 0) + 1,
            };
          }
        }
        return habit;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pb-12">
      {/* Header */}
      <HabitHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Your Habits</h2>
            <p className="text-gray-600">
              Build positive routines and earn rewards
            </p>
          </div>
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
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="productivity">
                          Productivity
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="frequency" className="text-sm font-medium">
                      Frequency
                    </label>
                    <Select
                      value={newHabit.frequency as string}
                      onValueChange={(value) =>
                        handleSelectChange("frequency", value)
                      }
                    >
                      <SelectTrigger>
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
                  </label>
                  <Select
                    value={String(newHabit.xpReward)}
                    onValueChange={(value) =>
                      setNewHabit((prev) => ({
                        ...prev,
                        xpReward: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger>
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
                  <label
                    htmlFor="targetCompletions"
                    className="text-sm font-medium"
                  >
                    Target Completions
                  </label>
                  <Input
                    id="targetCompletions"
                    name="targetCompletions"
                    type="number"
                    min="0"
                    value={newHabit.targetCompletions || 1}
                    onChange={handleNumberChange}
                    placeholder="How many times to complete"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetNewHabitForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={addOrUpdateHabit}>
                  {editingHabitId ? "Update Habit" : "Add Habit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active">Active Habits</TabsTrigger>
            <TabsTrigger value="completed">Completed Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {habits.length === 0 ? (
              <Card className="bg-white shadow-sm border-dashed border-2 border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Target className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No Habits Yet
                    </h3>
                    <p className="text-gray-500 mb-4 max-w-md">
                      Start building positive routines by adding your first
                      habit. Click the "Add New Habit" button below.
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      <Plus className="h-5 w-5 mr-2" /> Add Your First Habit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      editHabit={editHabit}
                      deleteHabit={deleteHabit}
                      toggleHabitCompletion={toggleHabitCompletion}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Completed Goals</h3>
                <p className="text-gray-600">
                  Track your achievements and completed habit goals here.
                </p>
                {/* This section will be implemented in the next phase */}
                <div className="py-8 text-center text-gray-500">
                  <p>Coming soon! Complete habits to see them here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HabitBuilderPage;
