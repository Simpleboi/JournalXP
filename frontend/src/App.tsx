import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import { ToastProvider } from "./hooks/useToast";
import { Loading } from "./components/Loading";
import { AuthModalProvider } from "./context/AuthModalContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { JournalPreferencesProvider } from "./context/JournalPreferencesContext";
import AuthWrapper from "./auth/AuthWrapper";
import "./styles/accessibility.css";

// Lazy load the routes
const JournalRoutes = lazy(() => import("./routes/route"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HelmetProvider>
        <AccessibilityProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <UserDataProvider>
                  <JournalPreferencesProvider>
                    <AuthModalProvider>
                      <JournalRoutes />
                      <AuthWrapper />
                    </AuthModalProvider>
                  </JournalPreferencesProvider>
                </UserDataProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
