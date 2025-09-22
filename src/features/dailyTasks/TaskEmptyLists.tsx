import { Card, CardContent } from "@/components/ui/card";
import TaskCard from "./TaskCard";
import { Task } from "@/models/Task";

interface TaskListProps {
  tasks: Task[];
  editingTaskId: string | null;
  editTitle: string;
  editDescription: string;
  editPriority: "low" | "medium" | "high";
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  startEditing: (task: Task) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  setEditPriority: (value: "low" | "medium" | "high") => void;
}

const TaskList = ({
  tasks,
  editingTaskId,
  editTitle,
  editDescription,
  editPriority,
  toggleTaskCompletion,
  deleteTask,
  startEditing,
  saveEdit,
  cancelEdit,
  setEditTitle,
  setEditDescription,
  setEditPriority,
  onUpdate,
  onDelete
}: TaskListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No tasks yet. Add your first task above!
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            editingTaskId={editingTaskId}
            editTitle={editTitle}
            editDescription={editDescription}
            editPriority={editPriority}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
            startEditing={startEditing}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            setEditTitle={setEditTitle}
            setEditDescription={setEditDescription}
            setEditPriority={setEditPriority}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

// export default TaskList;
