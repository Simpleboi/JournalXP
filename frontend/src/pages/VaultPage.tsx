import { VaultSection } from "@/features/journal/VaultSection";
import { Header } from "@/components/Header";
import { Lock } from "lucide-react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { SEO } from "@/components/SEO";

const VaultPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Secure Vault - Password-Protected Journal Entries"
        description="Store your most sensitive thoughts in the Secure Vault with password protection and AES-256 encryption. Your privacy matters."
        url="https://journalxp.com/vault"
      />

      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link sr-only-focusable">
        Skip to main content
      </a>

      {/* Header */}
      <Header title="Secure Vault" icon={Lock} />

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <VaultSection />
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default VaultPage;
