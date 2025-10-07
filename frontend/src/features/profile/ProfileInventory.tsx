import { TabsContent } from "@/components/ui/tabs";
import { ShoppingBag } from "lucide-react";

export const ProfileInventory = () => {
  return (
    <TabsContent value="inventory" className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Your Purchased Items</h3>
        <p className="text-gray-500 mb-4">
          Items you've purchased from the rewards store will appear here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-lg p-4 text-center flex flex-col items-center justify-center h-40">
            <ShoppingBag className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No items purchased yet</p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
