import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import { ToastProvider } from "./hooks/useToast";
import { Loading } from "./components/Loading";

// Lazy load the routes
const JournalRoutes = lazy(() => import("./routes/route"))

function App() {
  return (
    <Suspense fallback={<Loading />}>
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
