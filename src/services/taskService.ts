import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  increment,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Task } from "@/models/Task";

// To save a task in the database
export const saveTaskToFirestore = async (userId: string, task: any) => {
  const taskRef = doc(collection(db, "users", userId, "tasks"), task.id);
  await setDoc(taskRef, task);
};

// To know when a task is completed
export const completeTask = async (userId: string, taskId: string) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await updateDoc(taskRef, {
    completed: true,
    completedAt: new Date().toISOString(),
  });

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    points: increment(20),
  });
};

// To fetch tasks from the database
export const fetchTasksFromFirestore = async (
  userId: string
): Promise<Task[]> => {
  const querySnapshot = await getDocs(collection(db, "users", userId, "tasks"));

  const tasks: Task[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id, // use the Firestore doc ID
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt,
      priority: data.priority,
    };
  });

  return tasks;
};

// 🧹 Delete a task from Firestore
export const deleteTaskFromFirestore = async (
  userId: string,
  taskId: string
) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await deleteDoc(taskRef);
};
