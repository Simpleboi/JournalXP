import { motion } from "framer-motion";
import { Bell, Award, Calendar, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NotificationsPage = () => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      type: "achievement",
      title: "Level Up!",
      description: "You've reached Level 5: Mindful Adept",
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      date: "2 days ago",
      read: false,
    },
    {
      id: 2,
      type: "streak",
      title: "7-Day Streak!",
      description: "You've completed tasks for 7 days in a row",
      icon: <Star className="h-8 w-8 text-indigo-500" />,
      date: "3 days ago",
      read: true,
    },
    {
      id: 3,
      type: "reminder",
      title: "Journal Reminder",
      description: "Don't forget to write in your journal today",
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      date: "5 days ago",
      read: true,
    },
    {
      id: 4,
      type: "achievement",
      title: "Badge Unlocked",
      description: "You've earned the 'Early Riser' badge",
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      date: "1 week ago",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mr-2 hover:bg-indigo-50"
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5 text-indigo-600" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-600" />
            Notifications
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                <EmptyState message="No notifications yet" />
              )}
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              {notifications
                .filter((n) => n.type === "achievement" || n.type === "streak")
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))}
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              {notifications
                .filter((n) => n.type === "reminder")
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

const NotificationCard = ({ notification }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`overflow-hidden ${!notification.read ? "border-l-4 border-l-indigo-500" : ""}`}
      >
        <CardContent className="p-0">
          <div className="flex items-start p-4">
            <div className="flex-shrink-0 mr-4 p-2 rounded-full bg-indigo-50">
              {notification.icon}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{notification.title}</h3>
              <p className="text-gray-600">{notification.description}</p>
              <p className="text-sm text-gray-400 mt-1">{notification.date}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-gray-400"
            >
              Mark as read
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState = ({ message }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-indigo-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Notifications about your achievements and reminders will appear here.
      </p>
    </div>
  );
};

export default NotificationsPage;
