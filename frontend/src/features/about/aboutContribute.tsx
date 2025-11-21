import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Users, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const contributions = [
  "Professor Schneider",
  "Anthony Boutte",
  "Professor Martinez",
  "Edward Davis",
  "Haley Baugh",
  "Calob Villegas",
  "Professor White",
  "Adam Eureste",
  "Pricsilla Eureste"
];

// Contributors section
export const AboutContribute = () => {
  return (
    <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Contributors */}
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contributors</h3>
                <p className="text-gray-600">
                  {contributions.map((user, index) => {
                    return (
                      <Badge
                        key={index}
                        variant="default"
                        className="m-1 px-3 py-1 bg-indigo-100 text-indigo-700 hover:text-indigo-400 hover:bg-indigo-50 cursor-pointer"
                      >
                        {user}
                      </Badge>
                    );
                  })}
                </p>
                <p className="text-gray-600 mt-1">
                  Thank you to everyone who contributed to the development of
                  JournalXP. Your help made this project possible and better for
                  all.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 p-2 rounded-full">
                <Code2 className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Want to Contribute?
                </h3>
                <p className="text-gray-600">
                  JournalXP is open-source. If you'd like to contribute, visit
                  our{" "}
                  <a
                    href="https://github.com/Simpleboi/JournalXP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-pink-600 hover:text-pink-700"
                  >
                    GitHub repository
                  </a>{" "}
                  to get started.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};
