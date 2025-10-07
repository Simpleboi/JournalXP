import { createContext, useContext, useState } from "react";

type AuthModalType = "login" | "signup" | null;

interface AuthModalContextType {
  mode: AuthModalType;
  openModal: (mode: AuthModalType) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<AuthModalType>(null);

  return (
    <AuthModalContext.Provider
      value={{
        mode,
        openModal: setMode,
        closeModal: () => setMode(null),
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used within AuthModalProvider");
  return context;
};
