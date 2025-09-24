import { Flag, Target, Zap } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  DocumentReference,
  getDocs,
} from "firebase/firestore";


/**
 * @returns a DocumentRefernece for the given user ID. 
*/
export const userDocRef = (userId: string): DocumentReference => {
  return doc(db, "users", userId)
}


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
    "taskStats.currentTasksPending": increment(1)
  })
}



/**
 * @returns an icon that represents priority
 */
export const getPriorityIcon = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return <Flag className="h-3 w-3" />;
    case "medium":
      return <Target className="h-3 w-3" />;
    case "high":
      return <Zap className="h-3 w-3" />;
    default:
      return <Flag className="h-3 w-3" />;
  }
};

/**
 * @returns a color based on priority
 */
export const getPriorityColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

//
// export const getCategoryInfo = (category: string) => {
//     return categories.find(cat => cat.value === category) || categories[0];
//   };
