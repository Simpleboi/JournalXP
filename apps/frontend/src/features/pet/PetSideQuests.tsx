import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pet } from "@/models/Pet";
import { FC } from "react";

interface MiniQuestsProps {
  pet: Pet;
}

export const MiniQuests: FC<MiniQuestsProps> = ({ pet }) => {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700 flex items-center">
          <Target className="h-6 w-6 mr-2" />
          Mini Quests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(pet.activeQuests || []).map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                quest.isCompleted
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{quest.title}</h3>
                  <p className="text-sm text-gray-600">{quest.description}</p>
                </div>
                {quest.isCompleted && (
                  <Badge className="bg-green-100 text-green-700">
                    Complete!
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                  <Progress
                    value={(quest.current / quest.target) * 100}
                    className="h-2"
                  />
                </div>

                <div className="text-center">
                  <div className="text-lg mb-1">
                    {quest.reward.type === "toy" && quest.reward.value}
                    {quest.reward.type === "accessory" && quest.reward.value}
                    {quest.reward.type === "dance" && "💃"}
                    {quest.reward.type === "points" && "⭐"}
                  </div>
                  <p className="text-xs text-gray-500">
                    {quest.reward.type === "points"
                      ? `+${quest.reward.value} XP`
                      : quest.reward.type.charAt(0).toUpperCase() +
                        quest.reward.type.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(!pet.activeQuests || pet.activeQuests.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No active quests right now.</p>
              <p className="text-sm mt-1">
                Complete some activities to unlock new quests!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
