"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "./icons";

const ToastContext = createContext({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons = {
  success: <CheckCircleIcon size={22} className="text-green-600" />,
  error: <XCircleIcon size={22} className="text-red-600" />,
  warning: <AlertTriangleIcon size={22} className="text-yellow-600" />,
};

const accents = {
  success: "border-l-4 border-green-600",
  error: "border-l-4 border-red-600",
  warning: "border-l-4 border-yellow-600",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  const showToast = useCallback(
    ({ title, description, status = "success", duration = 5000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      setToasts((prev) => [...prev, { id, title, description, status }]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      timers.current.push(timer);
    },
    [],
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-6 right-6 z-[999999] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`toast-item bg-white shadow-lg rounded-md p-4 w-80 flex gap-3 ${
              accents[toast.status] || accents.success
            }`}
          >
            <div className="mt-1">{icons[toast.status] || icons.success}</div>

            <div>
              <h4 className="font-semibold text-gray-800">{toast.title}</h4>
              {toast.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {toast.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
