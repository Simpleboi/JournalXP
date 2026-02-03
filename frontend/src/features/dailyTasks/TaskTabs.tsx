import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { FC } from "react";
import { List, CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TaskTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const TaskTabs: FC<TaskTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
      <TabsList className="grid w-full grid-cols-4 p-1 sm:p-1.5 bg-white/90 backdrop-blur-sm border-2 border-gray-200/80 rounded-xl sm:rounded-2xl shadow-md h-auto">
        <TabsTrigger
          value="all"
          className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-200/50"
        >
          <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline sm:inline">All</span>
        </TabsTrigger>
        <TabsTrigger
          value="today"
          className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-200/50"
        >
          <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline sm:inline">Today</span>
        </TabsTrigger>
        <TabsTrigger
          value="overdue"
          className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all text-red-600 data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-200/50"
        >
          <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline sm:inline">Overdue</span>
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200/50"
        >
          <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline sm:inline">Done</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
