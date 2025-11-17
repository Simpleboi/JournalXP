import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import { ToastProvider } from "./hooks/useToast";
import { Loading } from "./components/Loading";
import { AuthModalProvider } from "./context/AuthModalContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthWrapper from "./auth/AuthWrapper";

// Lazy load the routes
const JournalRoutes = lazy(() => import("./routes/route"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <UserDataProvider>
              <AuthModalProvider>
                <JournalRoutes />
                <AuthWrapper />
              </AuthModalProvider>
            </UserDataProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
