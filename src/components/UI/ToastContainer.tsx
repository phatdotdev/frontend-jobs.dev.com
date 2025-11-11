// src/components/UI/ToastContainer.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/features/store";
import { removeToast } from "../../redux/features/toastSlice";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    case "info":
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

const getBgColor = (type: string) => {
  switch (type) {
    case "success":
      return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200";
    case "error":
      return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200";
    case "warning":
      return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
    case "info":
    default:
      return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200";
  }
};

const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => dispatch(removeToast(toast.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: any; onRemove: () => void }> = ({
  toast,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-xl ${getBgColor(
        toast.type
      )}`}
    >
      <div className="flex-shrink-0">{getIcon(toast.type)}</div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-bold text-gray-800">{toast.title}</p>
        )}
        <p className="text-sm text-gray-700">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-white/50 transition"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </motion.div>
  );
};

export default ToastContainer;
