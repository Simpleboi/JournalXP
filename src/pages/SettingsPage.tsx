import { SettingsNav } from "@/components/SettingsNav";
import { SettingsMain } from "@/components/SettingsMain";
import { Footer } from "@/components/Footer";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <SettingsNav />

      {/* Main Content */}
      <SettingsMain />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SettingsPage;
