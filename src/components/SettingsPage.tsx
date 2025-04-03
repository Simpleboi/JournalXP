import { SettingsNav } from "./SettingsNav";
import { SettingsMain } from "./SettingsMain";
import { SettingsFooter } from "./SettingsFooter";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <SettingsNav />

      {/* Main Content */}
      <SettingsMain />

      {/* Footer */}
      <SettingsFooter />
    </div>
  );
};

export default SettingsPage;
