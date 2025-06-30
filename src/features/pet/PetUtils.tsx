// a function that returns the health badge
const getHealthColor = (health: number) => {
  if (health >= 70) return "bg-green-500";
  if (health >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

// a function that returns the color of the badge for the pet
const getHappinessColor = (happiness: number) => {
  if (happiness >= 70) return "bg-pink-500";
  if (happiness >= 40) return "bg-orange-500";
  return "bg-gray-500";
};
