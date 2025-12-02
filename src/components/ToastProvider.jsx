import React, { createContext, useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const icons = {
  success: <CheckCircle size={22} className="text-green-600" />,
  error: <XCircle size={22} className="text-red-600" />,
  warning: <AlertTriangle size={22} className="text-yellow-600" />,
};

const bgColors = {
  success: "border-l-4 border-green-600",
  error: "border-l-4 border-red-600",
  warning: "border-l-4 border-yellow-600",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({
    title,
    description,
    status = "success",
    duration = 3000,
  }) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, title, description, status }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[999999] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", damping: 20 }}
              className={`bg-white shadow-lg rounded-md p-4 w-80 flex gap-3 ${
                bgColors[toast.status]
              }`}
            >
              <div className="mt-1">{icons[toast.status]}</div>

              <div>
                <h4 className="font-semibold text-gray-800">{toast.title}</h4>
                {toast.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {toast.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// use it like this

// onClick={() =>
//           showToast({
//             title: "Error!",
//             description: "Failed to save changes.",
//             status: "error",
//           })
//         }
