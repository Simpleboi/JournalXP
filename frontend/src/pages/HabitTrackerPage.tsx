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
import { ListChecks } from "lucide-react";
import {
  getHabits,
  getCompletedHabits,
  createHabit,
  updateHabit,
  completeHabit,
  deleteHabit as deleteHabitAPI,
} from "@/services/HabitService";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 pb-12">
      {/* Header */}
      <Header title="Habit Builder" icon={ListChecks}/>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl md:text-2xl font-semibold text-gray-800 text-center md:text-left">
              Your Habits
            </h2>
            <p className="text-gray-600 mb-2">
              Build positive routines and earn rewards
            </p>
          </div>
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
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active">Active Habits</TabsTrigger>
            <TabsTrigger value="completed">Completed Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {habits.length === 0 ? (
              <HabitEmptyState setIsAddDialogOpen={setIsAddDialogOpen} />
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
            {completedHabits.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Completed Goals</h3>
                  <p className="text-gray-600 mb-4">
                    Track your achievements and completed habit goals here.
                  </p>
                  <div className="py-8 text-center text-gray-500">
                    <p>No completed habits yet. Keep working on your active habits!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedHabits.map((habit) => (
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
      </main>
    </div>
  );
};

export default HabitBuilderPage;
