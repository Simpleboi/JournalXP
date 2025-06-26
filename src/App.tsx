import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
// import { JournalRoutes } from "./routes/route";
import { ToastProvider } from "./hooks/useToast";

// Lazy load the routes
const JournalRoutes = lazy(() => import("./routes/route"))

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ToastProvider>
        <AuthProvider>
          <UserDataProvider>
            <JournalRoutes />
          </UserDataProvider>
        </AuthProvider>
      </ToastProvider>
    </Suspense>
  );
}

export default App;
