import { SettingsNav } from "@/components/SettingsNav";

export const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <SettingsNav />

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>JournalXP - Your Mental Health Companion</p>
          <p className="mt-2">
            Remember, taking care of your mental health is a journey, not a
            destination.
          </p>
        </div>
      </footer>
    </div>
  );
};
