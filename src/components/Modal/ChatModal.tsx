import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/features/store";
import { useGetAllMessagesQuery } from "../../redux/api/messageApiSlice";
import { addMessage, setMessages } from "../../redux/features/messageSlice";
import { type ChatMessagePayLoad } from "../../hooks/useSocket";
import { formatTime } from "../../utils/helper";
import { useGetUserInfoQuery } from "../../redux/api/apiUserSlice";
import { useSocketContext } from "../../context/SocketContext";

// Định nghĩa theme màu
type ChatColor = "teal" | "blue" | "purple";

interface ThemeConfig {
  gradientFrom: string;
  gradientTo: string;
  buttonBg: string;
  buttonHover: string;
  bubbleBg: string;
  textColor: string;
  focusRing: string;
  avatarGradient: string;
}

const themes: Record<ChatColor, ThemeConfig> = {
  teal: {
    gradientFrom: "from-teal-600",
    gradientTo: "to-emerald-600",
    buttonBg: "bg-teal-600",
    buttonHover: "hover:bg-teal-700",
    bubbleBg: "bg-teal-600",
    textColor: "text-teal-600",
    focusRing: "focus:ring-teal-500",
    avatarGradient: "from-teal-500 to-emerald-500",
  },
  blue: {
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    bubbleBg: "bg-blue-600",
    textColor: "text-blue-600",
    focusRing: "focus:ring-blue-500",
    avatarGradient: "from-blue-500 to-indigo-500",
  },
  purple: {
    gradientFrom: "from-purple-600",
    gradientTo: "to-pink-600",
    buttonBg: "bg-purple-600",
    buttonHover: "hover:bg-purple-700",
    bubbleBg: "bg-purple-600",
    textColor: "text-purple-600",
    focusRing: "focus:ring-purple-500",
    avatarGradient: "from-purple-500 to-pink-500",
  },
};

const ChatModal: React.FC<{ name: string; id: string; color?: ChatColor }> = ({
  name,
  id,
  color = "teal",
}) => {
  const theme = themes[color];

  const { data: { data: userInfo } = {} } = useGetUserInfoQuery();
  const [openChat, setOpenChat] = useState(false);
  const dispatch = useDispatch();
  const { data: messageResponse } = useGetAllMessagesQuery();

  useEffect(() => {
    if (messageResponse?.data) {
      dispatch(setMessages(messageResponse.data));
    }
  }, [messageResponse, dispatch]);

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const messages = useSelector((state: RootState) => state.messages);
  const conversation = messages
    .filter((message) => message.senderId === id || message.receiverId === id)
    .sort(
      (a, b) =>
        new Date(a.timestamp as string).getTime() -
        new Date(b.timestamp as string).getTime()
    );

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [conversation]);

  const [content, setContent] = useState("");
  const { sendMessage } = useSocketContext();

  const handleSendMessage = () => {
    if (!content.trim()) return;
    const msg: ChatMessagePayLoad = {
      senderId: userInfo?.id as string,
      receiverId: id,
      content: content.trim(),
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    sendMessage(msg);
    dispatch(addMessage(msg));
    setContent("");
  };

  return (
    <>
      {/* Nút mở chat */}
      {!openChat && (
        <button
          onClick={() => setOpenChat(true)}
          className={`fixed right-6 bottom-6 md:right-10 w-14 h-14 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 group`}
          aria-label="Mở chat"
        >
          <MessageCircle size={26} className="group-hover:animate-pulse" />
        </button>
      )}

      {/* Chat Modal */}
      {openChat && (
        <div className="fixed right-6 bottom-20 md:right-10 w-[320px] md:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in z-50">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white p-4 flex items-center justify-between rounded-t-2xl`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                  {name[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">{name}</h3>
                <p className="text-xs opacity-90">Đang hoạt động</p>
              </div>
            </div>
            <button
              onClick={() => setOpenChat(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Đóng chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div
            ref={chatBodyRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {conversation.map((message, index) =>
              message.senderId === id ? (
                <div key={index} className="flex gap-2">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.avatarGradient} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {name[0].toUpperCase()}
                  </div>
                  <div className="max-w-[75%]">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      {formatTime(message.timestamp as string)}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={index} className="flex gap-2 justify-end">
                  <div className="max-w-[75%]">
                    <div
                      className={`${theme.bubbleBg} text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mr-1 text-right">
                      {formatTime(message.timestamp as string)}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={content}
                className={`flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 ${theme.focusRing} focus:border-transparent transition-all placeholder-gray-400`}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!content.trim()}
                className={`p-2.5 ${theme.buttonBg} text-white rounded-full ${theme.buttonHover} transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Gửi tin nhắn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
