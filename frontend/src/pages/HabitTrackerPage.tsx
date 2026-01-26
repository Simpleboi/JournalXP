import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Habit } from "@/models/Habit";
import { HabitEmptyState } from "@/features/habits/HabitEmptyState";
import { HabitCard } from "@/features/habits/HabitCardElement";
import { HabitDialog } from "@/features/habits/HabitDialog";
import { useUserData } from "@/context/UserDataContext";
import { Header } from "@/components/Header";
import { ListChecks, Target, Sparkles, Trophy, Flame } from "lucide-react";
import {
  getHabits,
  getCompletedHabits,
  createHabit,
  updateHabit,
  completeHabit,
  deleteHabit as deleteHabitAPI,
} from "@/services/HabitService";
import { useToast } from "@/components/ui/use-toast";
import { SEO } from "@/components/SEO";

// Ambient colors for the habits page
const habitAmbience = {
  primary: 'rgba(34, 197, 94, 0.20)',     // Green
  secondary: 'rgba(16, 185, 129, 0.18)',   // Emerald
  accent: 'rgba(99, 102, 241, 0.15)',      // Indigo
  warm: 'rgba(251, 191, 36, 0.12)',        // Amber
};


const HabitBuilderPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    title: "",
    description: "",
    frequency: "daily",
    customFrequency: undefined,
    specificTime: undefined,
    category: "mindfulness",
    xpReward: 10,
    targetCompletions: 1,
    isIndefinite: false,
  });

  const { userData, refreshUserData } = useUserData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load habits from API
  useEffect(() => {
    if (userData) {
      loadHabits();
      loadCompletedHabits();
    }
  }, [userData]);

  const loadHabits = async () => {
    try {
      setIsLoading(true);
      const data = await getHabits();
      // Filter out fully completed habits
      const activeHabits = data.filter((h) => !h.isFullyCompleted);
      setHabits(activeHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompletedHabits = async () => {
    try {
      const data = await getCompletedHabits();
      setCompletedHabits(data);
    } catch (error) {
      console.error("Error loading completed habits:", error);
    }
  };

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
    setNewHabit((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseInt(value),
    }));
  };

  const resetNewHabitForm = () => {
    setNewHabit({
      title: "",
      description: "",
      frequency: "daily",
      customFrequency: undefined,
      specificTime: undefined,
      category: "mindfulness",
      xpReward: 10,
      targetCompletions: 1,
      isIndefinite: false,
    });
    setEditingHabitId(null);
  };

  const addOrUpdateHabit = async () => {
    if (!newHabit.title) return;

    try {
      setIsLoading(true);

      if (editingHabitId) {
        // Update existing habit (only editable fields: title, description, category)
        const updated = await updateHabit(editingHabitId, {
          title: newHabit.title,
          description: newHabit.description,
          category: newHabit.category,
        });

        setHabits((prev) =>
          prev.map((habit) => (habit.id === editingHabitId ? updated : habit))
        );

        toast({
          title: "Success",
          description: "Habit updated successfully",
        });
      } else {
        // Create new habit
        const created = await createHabit({
          title: newHabit.title,
          description: newHabit.description,
          frequency: newHabit.frequency,
          customFrequency: newHabit.customFrequency,
          specificTime: newHabit.specificTime,
          xpReward: newHabit.xpReward,
          category: newHabit.category,
          targetCompletions: newHabit.isIndefinite ? 0 : newHabit.targetCompletions,
          isIndefinite: newHabit.isIndefinite,
        });

        setHabits((prev) => [created, ...prev]);

        toast({
          title: "Success",
          description: newHabit.isIndefinite
            ? "Indefinite habit created successfully - focus on building your streak!"
            : "Habit created successfully",
        });
      }

      resetNewHabitForm();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving habit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save habit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editHabit = (habitId: string) => {
    const habitToEdit = habits.find((habit) => habit.id === habitId);
    if (habitToEdit) {
      setNewHabit(habitToEdit);
      setEditingHabitId(habitId);
      setIsAddDialogOpen(true);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await deleteHabitAPI(habitId);
      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete habit",
        variant: "destructive",
      });
    }
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const updated = await completeHabit(habitId);

      // If habit is now fully completed, move it to completed habits
      if (updated.isFullyCompleted) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        setCompletedHabits((prev) => [updated, ...prev]);
        toast({
          title: "Congratulations! 🎉",
          description: "You've completed this habit goal!",
        });
      } else {
        setHabits((prev) =>
          prev.map((habit) => (habit.id === habitId ? updated : habit))
        );
        toast({
          title: "Great job! ✨",
          description: `Habit completed! +${updated.xpReward} XP`,
        });
      }

      // Refresh user data to update XP
      refreshUserData();
    } catch (error: any) {
      console.error("Error completing habit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete habit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-16 sm:-left-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: habitAmbience.primary }}
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-12 sm:-right-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: habitAmbience.secondary }}
          animate={{
            x: [0, -15, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-2xl sm:blur-3xl"
          style={{ background: habitAmbience.accent }}
          animate={{
            x: [0, 25, 0],
            y: [0, -12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-2xl sm:blur-3xl hidden sm:block"
          style={{ background: habitAmbience.warm }}
          animate={{
            x: [0, -18, 0],
            y: [0, 18, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>

      <SEO
        title="Gamified Habit Tracker - Build Lasting Change"
        description="Build healthy habits that stick with JournalXP's gamified habit tracker. Daily, weekly, and monthly tracking with streak counters and XP rewards. Mindfulness, physical, social, and productivity habits."
        url="https://journalxp.com/habits"
      />
      {/* Header */}
      <Header title="Habit Builder" icon={ListChecks}/>

      <main className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-12">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 pb-2 bg-clip-text text-transparent">
                Build Your Habits
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Create positive routines and earn rewards
              </p>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm border-2 border-amber-200/60 rounded-xl sm:rounded-2xl shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="font-semibold text-amber-700 text-sm sm:text-base">Build streaks & earn XP</span>
          </motion.div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-end mb-6 max-w-6xl mx-auto"
        >
          <HabitDialog
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            editingHabitId={editingHabitId}
            newHabit={newHabit}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            setNewHabit={setNewHabit}
            handleNumberChange={handleNumberChange}
            resetNewHabitForm={resetNewHabitForm}
            addOrUpdateHabit={addOrUpdateHabit}
          />
        </motion.div>

        {/* Tabs Container */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="active" className="w-full">
            {/* Glass Morphism Tab List */}
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 p-1.5 bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-xl sm:rounded-2xl shadow-sm h-auto">
              <TabsTrigger
                value="active"
                className="flex items-center justify-center gap-2 py-3 sm:py-4 px-3 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200/50"
              >
                <Target className="h-4 w-4" />
                <span>Active Habits</span>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center justify-center gap-2 py-3 sm:py-4 px-3 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-200/50"
              >
                <Trophy className="h-4 w-4" />
                <span>Completed Goals</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {habits.length === 0 ? (
                <HabitEmptyState setIsAddDialogOpen={setIsAddDialogOpen} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
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
              {completedHabits.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/60 backdrop-blur-md border-2 border-white/50 rounded-2xl shadow-lg p-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 mb-4">
                      <Trophy className="h-10 w-10 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Completed Goals</h3>
                    <p className="text-gray-600 mb-2">
                      Track your achievements and completed habit goals here.
                    </p>
                    <p className="text-gray-500 text-sm">
                      No completed habits yet. Keep working on your active habits!
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedHabits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        editHabit={() => {}} // Disable editing for completed habits
                        deleteHabit={deleteHabit}
                        toggleHabitCompletion={() => {}} // Disable completion for completed habits
                        isCompleted={true}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default HabitBuilderPage;
