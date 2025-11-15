import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Eye, NotebookPen, Heart } from "lucide-react";
import { formatCount } from "../../utils/helper";
import {
  useIsLikedQuery,
  useLikeJobPostingMutation,
} from "../../redux/api/apiPostSlice";
import { useParams } from "react-router-dom";

interface InteractionItemProps {
  likes: number;
  views?: number;
  applied?: number;
}

const InteractionItem: React.FC<InteractionItemProps> = ({
  likes = 0,
  views = 0,
  applied = 0,
}) => {
  const { id } = useParams<{ id: string }>();
  const postId = id;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [displayCount, setDisplayCount] = useState(likes);
  const [justLiked, setJustLiked] = useState(false);

  // RTK Query hooks
  const {
    data: isLikedResponse,
    isLoading: isLikedLoading,
    isError,
  } = useIsLikedQuery(postId);

  const [likePost, { isLoading: isLiking }] = useLikeJobPostingMutation();

  // Cập nhật trạng thái từ server
  useEffect(() => {
    if (isLikedResponse?.data !== undefined) {
      const serverLiked = isLikedResponse.data as boolean;
      setIsLiked(serverLiked);
      // Nếu server trả về khác với local, cập nhật likeCount
      if (serverLiked && likeCount === likes) {
        setLikeCount(likes + 1);
      } else if (!serverLiked && likeCount > likes) {
        setLikeCount(likes);
      }
    }
  }, [isLikedResponse, likes]);

  // Animation số đếm mượt
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

  // Xử lý like
  const handleLike = useCallback(async () => {
    if (isLiking) return;

    const wasLiked = isLiked;
    const newLiked = !wasLiked;
    const newCount = wasLiked ? likeCount - 1 : likeCount + 1;

    // Optimistic update
    setIsLiked(newLiked);
    setLikeCount(newCount);
    setJustLiked(!wasLiked);

    try {
      await likePost(postId).unwrap();
    } catch (error) {
      // Revert nếu lỗi
      setIsLiked(wasLiked);
      setLikeCount(likes + (wasLiked ? 1 : 0));
      setJustLiked(false);
    }
  }, [isLiking, isLiked, likeCount, likes, likePost, postId]);

  useEffect(() => {
    if (justLiked) {
      const timer = setTimeout(() => setJustLiked(false), 700);
      return () => clearTimeout(timer);
    }
  }, [justLiked]);

  if (isError) return;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-inner border border-gray-100">
      {/* Nút Like */}
      <motion.button
        onClick={handleLike}
        disabled={isLiking || isLikedLoading}
        whileTap={{ scale: isLiking ? 1 : 0.92 }}
        whileHover={{ scale: isLiking ? 1 : 1.08 }}
        className={`group relative flex items-center gap-2 px-2 py-3 rounded-2xl font-bold transition-all duration-300 shadow-xl overflow-hidden
          ${
            isLiked
              ? "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white shadow-rose-500/50"
              : "bg-gradient-to-r from-white to-gray-50 border-2 border-teal-500 text-teal-600 hover:shadow-2xl"
          }
          ${isLiking || isLikedLoading ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/20 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

        {/* Pulse Animation khi vừa like */}
        <AnimatePresence>
          {justLiked && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 bg-white/40 rounded-2xl"
            />
          )}
        </AnimatePresence>

        {/* Icon: ThumbsUp → Heart */}
        <motion.div
          animate={isLiked ? { scale: [1, 1.6, 1.1] } : { scale: 1 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 400 }}
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

        {/* Số lượt thích */}
        <motion.span
          key={displayCount}
          initial={{ scale: 1.3, opacity: 0, y: -8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`text-lg font-bold min-w-[40px] text-center ${
            isLiked ? "text-white drop-shadow-md" : "text-rose-600"
          }`}
        >
          {formatCount(displayCount)}
        </motion.span>

        {/* Tooltip */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
          <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl">
            {isLiked ? "Bỏ thích" : "Thích bài viết này"}
          </div>
          <div className="w-3 h-3 bg-gray-800 rotate-45 absolute top-4 left-1/2 -translate-x-1/2" />
        </div>

        {/* Loading spinner nhỏ */}
        {isLiking && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-2xl">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Lượt xem */}
      <div className="flex items-center gap-2 px-2 py-3 rounded-2xl bg-gradient-to-r from-blue-50 via-teal-50 to-cyan-50 border border-blue-200 shadow-md hover:shadow-xl transition-all group">
        <div className="p-1.5 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
          <Eye className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Lượt xem
          </p>
          <p className="text-lg text-center font-bold text-blue-700">
            {formatCount(views)}
          </p>
        </div>
      </div>

      {/* Ứng tuyển */}
      <div className="flex items-center gap-2 px-2 py-3 rounded-2xl bg-gradient-to-r from-purple-50 via-violet-50 to-pink-50 border border-purple-200 shadow-md hover:shadow-xl transition-all group">
        <div className="p-1.5 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
          <NotebookPen className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Ứng tuyển
          </p>
          <p className="text-lg text-center font-bold text-purple-700">
            {formatCount(applied)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionItem;
