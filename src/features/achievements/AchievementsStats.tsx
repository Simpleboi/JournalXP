import { ACHIEVEMENTS } from "@/data/achievementData";


export const AchievementStats = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <h3 className="text-lg text-gray-500">Total Achievements</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {ACHIEVEMENTS.length}
          </p>
        </div>
        <div>
          <h3 className="text-lg text-gray-500">Unlocked</h3>
          <p className="text-3xl font-bold text-green-600">
            {ACHIEVEMENTS.filter((a) => a.unlocked).length}
          </p>
        </div>
        <div>
          <h3 className="text-lg text-gray-500">Points Earned</h3>
          <p className="text-3xl font-bold text-purple-600">
            {ACHIEVEMENTS
              .filter((a) => a.unlocked)
              .reduce((sum, a) => sum + a.points, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
