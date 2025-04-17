import { useHabits } from "@/hooks/habitHooks";
import EmptyState from "./HabitEmptyState";
import HabitCard from "./HabitCardElement";

const HabitList = ({ onAddHabit }: { onAddHabit: () => void }) => {
  const { habits } = useHabits();

  if (habits.length === 0) return <EmptyState onAddHabit={onAddHabit} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
};

export default HabitList;
