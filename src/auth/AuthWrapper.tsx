import { Suspense, lazy } from "react";
import { useAuthModal } from "@/context/AuthModalContext";

const Signup = lazy(() => import("./signup"));
const Login = lazy(() => import("./login"));

const AuthWrapper = () => {
  const { mode, openModal, closeModal } = useAuthModal();

  return (
    <Suspense fallback={null}>
      {mode === "signup" && (
        <Signup open={true} onOpenChange={(v) => (v ? openModal("signup") : closeModal())} onSwitch={() => openModal("login")} />
      )}
      {mode === "login" && (
        <Login open={true} onOpenChange={(v) => (v ? openModal("login") : closeModal())} onSwitch={() => openModal("signup")} />
      )}
    </Suspense>
  );
};

export default AuthWrapper;
