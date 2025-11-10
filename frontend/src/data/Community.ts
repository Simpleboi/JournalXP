import { Reflection } from "@shared/utils/CommunityPost";

export const STARTER_REFLECTIONS: Reflection[] = [
  {
    id: "starter-1",
    text: "Today I realized that small steps forward are still progress. Every moment of self-care counts.",
    mood: "hopeful",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    supportCount: 24,
    supported: false,
  },
  {
    id: "starter-2",
    text: "Grateful for the quiet moments that remind me to breathe and just be present.",
    mood: "grateful",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    supportCount: 18,
    supported: false,
  },
  {
    id: "starter-3",
    text: "You are worthy of love and kindness, especially from yourself. 💙",
    mood: "loved",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    supportCount: 31,
    supported: false,
  },
  {
    id: "starter-4",
    text: "Finding peace in accepting that not every day needs to be productive. Rest is healing too.",
    mood: "peaceful",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    supportCount: 27,
    supported: false,
  },
  {
    id: "starter-5",
    text: "Sometimes the bravest thing you can do is ask for help. You're not alone in this journey.",
    mood: "inspired",
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    supportCount: 22,
    supported: false,
  },
];
