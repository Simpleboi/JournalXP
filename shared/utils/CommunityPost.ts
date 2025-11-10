export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  supportCount: number;
  supported: boolean;
}

export interface Reflection {
  id: string;
  text: string;
  mood: string;
  createdAt: string;
  supportCount: number;
  supported: boolean;
  comments?: Comment[];
  commentsExpanded?: boolean;
}

export const MOODS = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-700" },
  { value: "grateful", label: "Grateful", color: "bg-green-100 text-green-700" },
  { value: "hopeful", label: "Hopeful", color: "bg-blue-100 text-blue-700" },
  { value: "peaceful", label: "Peaceful", color: "bg-purple-100 text-purple-700" },
  { value: "inspired", label: "Inspired", color: "bg-yellow-100 text-yellow-700" },
  { value: "loved", label: "Loved", color: "bg-pink-100 text-pink-700" },
];