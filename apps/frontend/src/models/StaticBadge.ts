
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
}

export const badgeStore: Badge[] = [
  {
    id: "badge_beginner",
    name: "New Beginner",
    description: "Awarded for taking your first steps in self-care.",
    imageUrl: "/images/badges/beginner.png",
    cost: 500,
  },
  {
    id: "badge_specialist",
    name: "Mental Health Specialist",
    description: "A badge for those who take their growth seriously.",
    imageUrl: "/images/badges/specialist.png",
    cost: 20000,
  },
];
