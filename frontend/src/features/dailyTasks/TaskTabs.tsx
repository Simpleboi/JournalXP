import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { FC } from "react";

interface TaskTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const TaskTabs: FC<TaskTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
        <TabsTrigger value="all">All Tasks</TabsTrigger>
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="overdue" className="text-red-600">
          Overdue
        </TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
