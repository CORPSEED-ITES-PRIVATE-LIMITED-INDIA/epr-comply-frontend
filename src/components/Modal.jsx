import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({
  open,
  onCancel,
  onOk,
  title,
  children,
  width = 500,
  okText = "Submit",
  cancelText = "Cancel",
  okButtonProps = {},
  cancelButtonProps = {},
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width }}
            className="bg-white rounded-xl shadow-xl max-w-full p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="text-gray-700 mb-6">{children}</div>

            {/* Footer */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                {...cancelButtonProps}
              >
                {cancelText}
              </Button>

              <Button
                variant="primary"
                onClick={onOk}
                {...okButtonProps}
              >
                {okText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
