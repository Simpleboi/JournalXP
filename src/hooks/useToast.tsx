import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  ToastProvider as RadixToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast"; 

type ToastData = {
  title: string;
  description?: string;
};

interface ToastContextType {
  showToast: (toast: ToastData) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState<ToastData>({
    title: "",
    description: "",
  });

  const showToast = ({ title, description }: ToastData) => {
    setToastData({ title, description });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToastProvider swipeDirection="right">
        {children}
        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <ToastTitle>{toastData.title}</ToastTitle>
            {toastData.description && (
              <ToastDescription>{toastData.description}</ToastDescription>
            )}
          </div>
        </Toast>
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
