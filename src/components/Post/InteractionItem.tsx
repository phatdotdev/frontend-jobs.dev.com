import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Eye, NotebookPen, Heart } from "lucide-react";
import { formatCount } from "../../utils/helper";

interface InteractionItemProps {
  likes: number;
  liked?: boolean;
  views?: number;
  applied?: number;
}

const InteractionItem: React.FC<InteractionItemProps> = ({
  likes = 1,
  liked = false,
  views = 0,
  applied = 0,
}) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [displayCount, setDisplayCount] = useState(likes);

  // Animation count-up mượt như TikTok
  useEffect(() => {
    if (displayCount === likeCount) return;

    const start = displayCount;
    const end = likeCount;
    const duration = 600;
    const steps = Math.min(30, Math.abs(end - start) * 2);
    const increment = (end - start) / steps;

    let current = start;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      setDisplayCount(Math.round(current));

      if (step >= steps) {
        setDisplayCount(end);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [likeCount, displayCount]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-inner border border-gray-100">
      {/* Nút Thích – SIÊU XỊN, 3D, Pulse, Fill, Heart Burst */}
      <motion.button
        onClick={handleLike}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        className={`group relative flex items-center gap-2 px-2 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl overflow-hidden
          ${
            isLiked
              ? "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white shadow-rose-500/50"
              : "bg-gradient-to-r from-white to-gray-50 border-2 border-teal-500 text-teal-600 hover:shadow-2xl"
          }`}
      >
        {/* Gradient Glow khi hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/20 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

        {/* Pulse khi vừa thích */}
        <AnimatePresence>
          {isLiked && displayCount === likeCount && likeCount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 bg-white/40 rounded-2xl"
            />
          )}
        </AnimatePresence>

        {/* Icon ThumbsUp → Heart khi thích */}
        <motion.div
          animate={isLiked ? { scale: [1, 1.6, 1.1] } : { scale: 1 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 400 }}
          className="relative"
        >
          {isLiked ? (
            <Heart className="w-6 h-6 fill-white text-white drop-shadow-md" />
          ) : (
            <ThumbsUp className="w-6 h-6 fill-transparent text-teal-600 group-hover:fill-teal-500 transition-all" />
          )}
        </motion.div>

        {/* Text */}
        <span className="text-sm font-semibold whitespace-nowrap">
          {isLiked ? "Đã thích" : "Thích"}
        </span>

        {/* Số lượt thích với spring + format đẹp */}
        <motion.span
          key={displayCount}
          initial={{ scale: 1.4, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`text-lg font-bold min-w-[40px] text-center ${
            isLiked ? "text-white drop-shadow-md" : "text-rose-600"
          }`}
        >
          {formatCount(displayCount)}
        </motion.span>

        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl">
            {isLiked ? "Bỏ thích" : "Thích bài viết này"}
          </div>
          <div className="w-3 h-3 bg-gray-800 rotate-45 absolute top-4 left-1/2 -translate-x-1/2" />
        </div>
      </motion.button>

      {/* Lượt xem – Gradient xanh lá + nhãn */}
      <div className="flex items-center gap-2.5 px-3 py-3 rounded-2xl bg-gradient-to-r from-blue-50 via-teal-50 to-cyan-50 border border-blue-200 shadow-md hover:shadow-xl transition-all group">
        <div className="p-1.5 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
          <Eye className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-right flex items-center">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Lượt xem
          </p>
          <p className="ml-2 mb-[1.5px] text-lg font-bold text-blue-700">
            {formatCount(views)}
          </p>
        </div>
      </div>

      {/* Ứng tuyển – Gradient tím + nhãn */}
      <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-50 via-violet-50 to-pink-50 border border-purple-200 shadow-md hover:shadow-xl transition-all group">
        <div className="p-1.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
          <NotebookPen className="w-5 h-5 text-purple-600" />
        </div>
        <div className="text-right flex items-center">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Ứng tuyển
          </p>
          <p className="ml-2 text-lg font-bold text-purple-700">
            {formatCount(applied)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionItem;
