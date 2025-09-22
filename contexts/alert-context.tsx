import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

interface AlertMessage {
  id: number;
  message: string;
  type?: EAlertType;
}

export enum EAlertType {
  INFOR = 'infor',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

interface AlertContextType {
  showAlert: (message: string, type?: EAlertType) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [mounted, setMounted] = useState(false); // chỉ render portal khi đã mount

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAlert = (message: string, type: EAlertType = EAlertType.INFOR) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== id)), 4000);
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-400 w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="text-yellow-400 w-5 h-5" />;
      case "error":
        return <XCircle className="text-red-400 w-5 h-5" />;
      default:
        return <Info className="text-blue-400 w-5 h-5" />;
    }
  };

  const getBorderColor = (type?: EAlertType) => {
    switch (type) {
      case EAlertType.SUCCESS:
        return "border-success text-success";
      case EAlertType.WARNING:
        return "border-warning text-warning";
      case EAlertType.ERROR:
        return "border-danger text-danger";
      default:
        return "border-primary text-primary";
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {mounted && (
        <div className="fixed top-4 right-4 flex flex-col pt-8 gap-3 z-50">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm 
                      bg-card border ${getBorderColor(alert.type)} transition-all`}
            >
              {getIcon(alert.type)}
              <span className="font-medium">{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx.showAlert;
}
