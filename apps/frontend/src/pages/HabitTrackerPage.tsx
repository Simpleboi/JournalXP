import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Habit } from "@/models/Habit";
import { HabitEmptyState } from "@/features/habits/HabitEmptyState";
import { HabitCard } from "@/features/habits/HabitCardElement";
import { HabitDialog } from "@/features/habits/HabitDialog";
import {
  canCompleteHabit,
  saveHabit,
  deleteHabitFromFirestore,
} from "@/features/habits/HabitUtils";
import { useUserData } from "@/context/UserDataContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/Header";
import { ListChecks } from "lucide-react";

const HabitBuilderPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    title: "",
    description: "",
    frequency: "daily",
    category: "mindfulness",
    xpReward: 10,
  });

  const { userData } = useUserData();
  const userId = userData?.uid;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);

  // load habits from firestore
  useEffect(() => {
    if (userId) {
      loadHabitsFromFirestore();
    }
  }, [userId]);

  const loadHabitsFromFirestore = async () => {
    if (!userId) return;

    const habitsRef = collection(db, "users", userId, "habits");
    const snapshot = await getDocs(habitsRef);

    const loadedHabits: Habit[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Habit[];

    setHabits(loadedHabits);
  };

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!userId) return;

    const updateHabitsInFirestore = async () => {
      for (const habit of habits) {
        await saveHabit(userId, habit);
      }
    };

    updateHabitsInFirestore();
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
      category: "mindfulness",
      xpReward: 10,
    });
    setEditingHabitId(null);
  };

  const addOrUpdateHabit = async () => {
    if (!newHabit.title || !userId) return;

    if (editingHabitId) {
      const updatedHabit = {
        ...habits.find((h) => h.id === editingHabitId)!,
        ...newHabit,
        completed: false,
        currentCompletions: 0,
        streak: 0,
        lastCompleted: undefined,
      };

      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === editingHabitId ? updatedHabit : habit
        )
      );

      await saveHabit(userId, updatedHabit);
    }
    // else add new habit
    else {
      const habit: Habit = {
        id: Date.now().toString(),
        title: newHabit.title || "",
        description: newHabit.description || "",
        frequency: newHabit.frequency as "daily" | "weekly" | "monthly",
        completed: false,
        streak: 0,
        xpReward: newHabit.xpReward || 10,
        category: newHabit.category as any,
        createdAt: new Date().toISOString(),
        targetCompletions: newHabit.targetCompletions || 1,
        currentCompletions: 0,
      };

      setHabits((prev) => [...prev, habit]);
      await saveHabit(userId, habit);
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

  const deleteHabit = async (habitId: string) => {
    if (!userId) return;
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    await deleteHabitFromFirestore(userId, habitId);
  };

  const toggleHabitCompletion = async (habitId: string) => {
    if (!userId) return;

    const now = new Date();

    const updatedHabits = habits.map((habit) => {
      if (habit.id !== habitId) return habit;

      if (!canCompleteHabit(habit)) return habit; // lock if too soon

      const updated = {
        ...habit,
        completed: true,
        lastCompleted: now.toISOString(),
        streak: habit.streak + 1,
        currentCompletions: (habit.currentCompletions || 0) + 1,
      };
      // You could also trigger a user XP update here
      saveHabit(userId, updated);
      return updated;
    });

    setHabits(updatedHabits);
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
