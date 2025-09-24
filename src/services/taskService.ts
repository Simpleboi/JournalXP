import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  increment,
  getDocs,
  deleteDoc,
  DocumentReference,
} from "firebase/firestore";
import { Task } from "@/models/Task";

/**
 * @returns a DocumentRefernece for the given user ID.
 */
export const userDocRef = (userId: string): DocumentReference => {
  return doc(db, "users", userId);
};

// To save a task in the database
export const saveTaskToFirestore = async (userId: string, task: any) => {
  const taskRef = doc(collection(db, "users", userId, "tasks"), task.id);
  await setDoc(taskRef, task);
};

// To know when a task is completed
export const completeTask = async (userId: string, taskId: string) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  const ref = userDocRef(userId);
  await updateDoc(taskRef, {
    completed: true,
    completedAt: new Date().toISOString(),
  });
  await updateDoc(ref, {
    "taskStats.currentTasksPending": increment(-1),
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
  const ref = userDocRef(userId);
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await updateDoc(ref, {
    "taskStats.currentTasksCreated": increment(-1),
  });
  await deleteDoc(taskRef);
};

/**
 * This function updates 'totalTask' when the user creates a new task. It adds 20 points
 */
export const awardNewTaskCreation = async (userId: string): Promise<void> => {
  const ref = userDocRef(userId);
  await updateDoc(ref, {
    points: increment(20),
    totalPoints: increment(20),
    totalTasks: increment(1),
    "taskStats.currentTasksCreated": increment(1),
    "taskStats.currentTasksPending": increment(1),
  });
};
