"use client";

import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

interface ToastContextType {
  showSuccess: (message: string, summary?: string) => void;
  showError: (message: string, summary?: string) => void;
  showInfo: (message: string, summary?: string) => void;
  showWarn: (message: string, summary?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showSuccess = (message: string, summary = "Success") => {
    toastRef.current?.show({
      severity: "success",
      summary,
      detail: message,
      life: 5000,
    });
  };

  const showError = (message: string, summary = "Error") => {
    toastRef.current?.show({
      severity: "error",
      summary,
      detail: message,
      life: 4000,
    });
  };

  const showInfo = (message: string, summary = "Info") => {
    toastRef.current?.show({
      severity: "info",
      summary,
      detail: message,
      life: 3000,
    });
  };

  const showWarn = (message: string, summary = "Warning") => {
    toastRef.current?.show({
      severity: "warn",
      summary,
      detail: message,
      life: 3000,
    });
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showWarn }}
    >
      <Toast ref={toastRef} position="bottom-right" className="z-[100] relative" />
      {children}
    </ToastContext.Provider>
  );
};

// custom hook for easy access
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
