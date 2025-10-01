import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Habit } from "@/models/Habit";

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchHabits = async () => {
      const q = query(collection(db, "habits"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Habit[];
      setHabits(data);
    };
    fetchHabits();
  }, [user]);

  return { habits, setHabits };
};
