import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useUserData } from "@/context/UserDataContext";
import { CompletionRate } from "@/utils/DailyTaskUtils";

export const TaskStats = () => {
  const { userData } = useUserData();

    if (!userData) {
        return(<h1>something?</h1>)
    }

    return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 mt-6">
      {/* Total Tasks Created */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{userData.totalTasksCreated}</p>
              <p className="text-sm text-blue-600">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Tasks Completed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">
                {userData.totalTasksCompleted}
              </p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Tasks Pending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900">
                {userData.taskStats.currentTasksPending}
              </p>
              <p className="text-sm text-orange-600">Pending</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Average Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">
              {CompletionRate(userData.totalTasksCompleted, userData.totalTasksCreated).toFixed(1)}%
              </p>
              <p className="text-sm text-purple-600">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
