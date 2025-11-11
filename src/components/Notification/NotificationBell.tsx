import React, { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationBellProps = {
  unreadCount: number;
  onClick: () => void;
};

const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick,
}) => {
  const [isRinging, setIsRinging] = useState(false);

  // Tự động rung chuông khi có thông báo mới
  useEffect(() => {
    if (unreadCount > 0) {
      setIsRinging(true);
      const timer = setTimeout(() => setIsRinging(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <motion.div
      className="relative cursor-pointer group"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Glow ring khi hover */}
      <div className="absolute inset-0 rounded-full bg-teal-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Chuông rung lắc */}
      <motion.div
        animate={
          isRinging
            ? {
                rotate: [0, -15, 15, -15, 15, 0],
                transition: { duration: 0.6, ease: "easeInOut" },
              }
            : {}
        }
        className="relative"
      >
        {isRinging ? (
          <BellRing className="w-7 h-7 text-teal-600 drop-shadow-lg" />
        ) : (
          <Bell className="w-7 h-7 text-gray-700 group-hover:text-teal-600 transition-all duration-300" />
        )}
      </motion.div>

      {/* Badge đỏ 3D siêu xịn */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-2 
                       bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs font-extrabold 
                       rounded-full shadow-2xl border-2 border-white 
                       animate-pulse ring-4 ring-red-400/30"
          >
            {/* Hiệu ứng số đếm mượt */}
            <span className="drop-shadow-md">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple effect khi click (tùy chọn) */}
      <span className="absolute inset-0 rounded-full bg-teal-400/20 scale-0 group-active:scale-150 transition-transform duration-500" />
    </motion.div>
  );
};

export default NotificationBell;
