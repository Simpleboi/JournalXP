import { Card, CardContent } from "@/components/ui/card";

export const NewUserMsg = () => {
  return (
    <Card className="w-fit mx-auto">
      <CardContent className="p-6 text-xl text-gray-600">
        Feel free to explore JournalXP as a guest! To save your journal entries
        and customize your experience, please log in
      </CardContent>
    </Card>
  );
};
