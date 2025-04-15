import { Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";
import { JournalRoutes } from "./routes/route";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <UserDataProvider>
          <JournalRoutes />
        </UserDataProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
