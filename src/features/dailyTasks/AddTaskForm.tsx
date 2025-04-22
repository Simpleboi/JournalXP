import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

const AddTaskForm = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  newTaskPriority,
  setNewTaskPriority,
  addTask,
}: any) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Add New Task</CardTitle>
      <CardDescription>Create a new task for today</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <div className="flex gap-2">
          {["low", "medium", "high"].map((level) => (
            <Button
              key={level}
              variant={newTaskPriority === level ? "default" : "outline"}
              className={newTaskPriority === level ? `bg-${level}-500` : ""}
              onClick={() => setNewTaskPriority(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={addTask} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </CardFooter>
  </Card>
);

export default AddTaskForm;
