import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";
import { FaRegUserCircle } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import { useGetChatUsersQuery } from "../redux/api/apiCommunication";
import { getImageUrl } from "../utils/helper";
import { motion, AnimatePresence } from "framer-motion";
import ErrorAlert from "../components/UI/ErrorAlert";
import DataLoader from "../components/UI/DataLoader";
import type { UserResponseProps } from "../types/UserProps";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/features/store";
import { markAsRead, setMessages } from "../redux/features/messageSlice";
import { useGetAllMessagesQuery } from "../redux/api/messageApiSlice";
import { useGetUserInfoQuery } from "../redux/api/userApiSlice";
import { useSocketContext } from "../context/SocketContext";

const ChatView = () => {
  const { data: { data: userInfo } = {} } = useGetUserInfoQuery();
  const messages = useSelector((state: RootState) => state.messages);
  const { data: response, isLoading, error } = useGetChatUsersQuery();
  const users = response?.data as unknown as UserResponseProps[];
  const [selectedUser, setSelectedUser] = useState<UserResponseProps | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();

  const { data: messageResponse } = useGetAllMessagesQuery();

  const { markMessagesAsRead } = useSocketContext();

  useEffect(() => {
    if (messageResponse?.data) {
      dispatch(setMessages(messageResponse.data));
    }
  }, [messageResponse, dispatch]);

  useEffect(() => {
    if (!selectedUser?.id) return;

    const hasUnread = messages.some(
      (msg) =>
        msg.senderId === selectedUser.id &&
        msg.receiverId === userInfo?.id &&
        msg.isRead === false
    );

    if (hasUnread) {
      markMessagesAsRead(selectedUser.id);
      dispatch(markAsRead(selectedUser.id));
    }
  }, [selectedUser?.id, messages]);

  // MOBILE HANDLER
  const handleSelectUser = (user: UserResponseProps) => {
    setSelectedUser(user);
    setIsSidebarOpen(false);
  };
  const handleBack = () => {
    setSelectedUser(null);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(true);
  };

  const countUnreadMessages = (userId: string) => {
    return messages.filter(
      (msg) =>
        msg.senderId === userId &&
        msg.receiverId === userInfo?.id &&
        msg.isRead === false
    ).length;
  };

  return (
    <div className="flex mt-4 h-[45rem] bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={window.innerWidth < 1024 ? { x: -400 } : false}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-50 w-96 h-full border-r border-gray-200/50 backdrop-blur-xl bg-white/90 shadow-2xl flex flex-col lg:shadow-none"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-gray-200/70 flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-3xl">💬</span> Trò chuyện
              </h2>
              {/* Nút đóng trên mobile */}
              {window.innerWidth < 1024 && (
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-full hover:bg-gray-200"
                >
                  <IoArrowBack className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Loading / Error */}
            {isLoading && <DataLoader />}
            {error && <ErrorAlert />}

            {/* Danh sách người dùng */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              <div className="p-4 space-y-2">
                {users
                  ?.filter((user: any) => user.id !== userInfo?.id)
                  ?.map((user: any) => {
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className={`flex items-center w-full p-4 rounded-2xl transition-all duration-300 group
                          ${
                            selectedUser === user.id
                              ? "bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-xl"
                              : "bg-white/70 hover:bg-teal-50/80 text-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                          }`}
                      >
                        <div className="relative flex-shrink-0">
                          {user.avatarUrl ? (
                            <img
                              src={getImageUrl(user.avatarUrl)}
                              alt={user.username || "Avatar"}
                              className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-md"
                            />
                          ) : (
                            <FaRegUserCircle className="w-12 h-12 text-gray-400 bg-gray-100 rounded-full p-1 shadow-md" />
                          )}
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>

                        <div className="flex ml-4 flex-1 text-left overflow-hidden">
                          <div className="flex font-semibold truncate">
                            {user.username || user.id}{" "}
                          </div>
                          <div className="flex flex-col ml-auto gap-1 ml-2">
                            {countUnreadMessages(user.id) > 0 && (
                              <span className="min-w-[1rem] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                                {countUnreadMessages(user.id)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 ml-2"></div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay khi mở drawer trên mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 translate-y-[5rem] bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col relative">
        {/* Header mobile: nút menu hoặc back */}
        <div className="lg:hidden absolute top-4 left-4 z-30 flex items-center gap-3">
          {selectedUser ? (
            <button
              onClick={handleBack}
              className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition"
            >
              <IoArrowBack className="w-6 h-6 text-teal-600" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition"
            >
              <HiMenu className="w-6 h-6 text-teal-600" />
            </button>
          )}
        </div>

        {/* Chat Content */}
        {selectedUser ? (
          <ChatBox
            currentUserId={userInfo?.id as string}
            receiver={selectedUser}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-8xl mb-6 opacity-20">💬</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                Chat App
              </h1>
              <p className="text-gray-600 mt-4 text-lg">
                {window.innerWidth < 1024
                  ? "Nhấn ☰ để xem danh sách"
                  : "Chọn một người để bắt đầu trò chuyện"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
