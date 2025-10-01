import { Card, CardContent } from "@/components/ui/card";

export const NewUserMsg = () => {
  return (
    <Card className="w-fit mx-auto">
      <CardContent className="p-6 text-xl text-gray-600">
        You're welcome to explore JournalXP as a guest, but to save your journal entries or personalize your experience, please log in. Some features are available only to signed-in users.
      </CardContent>
    </Card>
  );
};
