import { useEffect, useRef, useState } from "react";
import { type ChatMessagePayLoad } from "../hooks/useSocket";
import { FaPaperPlane, FaRegUserCircle } from "react-icons/fa";
import { getImageUrl } from "../utils/helper";
import { type UserResponseProps } from "../types/UserProps";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/features/store";
import { addMessage } from "../redux/features/messageSlice";
import { useSocketContext } from "../context/SocketContext";

interface ChatBoxProps {
  currentUserId: string;
  receiver: UserResponseProps;
}

const ChatBox = ({ currentUserId, receiver }: ChatBoxProps) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => state.messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const msg: ChatMessagePayLoad = {
      senderId: currentUserId,
      receiverId: receiver.id,
      content: text.trim(),
      isRead: false,
      timestamp: new Date().toISOString(),
    };

    sendMessage(msg);
    dispatch(addMessage(msg));
    setText("");
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
      ? date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString("vi-VN");
  };

  const { sendMessage } = useSocketContext();

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.receiverId === receiver.id) ||
      (msg.senderId === receiver.id && msg.receiverId === currentUserId)
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header Chat */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <div className="relative">
          {receiver?.avatarUrl ? (
            <img
              src={getImageUrl(receiver.avatarUrl)}
              alt={receiver.username as string}
              className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
          ) : (
            <FaRegUserCircle className="w-12 h-12 text-gray-400 bg-gray-100 rounded-full p-1 shadow-lg" />
          )}
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            {receiver?.username || receiver.id}
          </h3>
          <p className="text-sm text-teal-600 font-medium">Đang hoạt động</p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {filteredMessages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`flex max-w-xs lg:max-w-md ${
                  isMe ? "flex-row-reverse" : "flex-row"
                } gap-3 items-end`}
              >
                <div
                  className={`px-4 py-3 rounded-3xl shadow-md relative ${
                    isMe
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm lg:text-base leading-relaxed">
                    {msg.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block text-right ${
                      isMe ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg?.timestamp as string)}
                  </span>
                  {/* Tail bubble */}
                  <div
                    className={`absolute bottom-0 ${
                      isMe ? "right-0" : "left-0"
                    } w-3 h-3 transform ${
                      isMe ? "translate-x-1/2" : "-translate-x-1/2"
                    }`}
                  >
                    <svg
                      className={`${isMe ? "text-teal-500" : "text-white"}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d={isMe ? "M12 0 L0 0 L12 12 Z" : "M0 0 L12 0 L0 12 Z"}
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-5 py-3 shadow-inner">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSend())
            }
            placeholder="Aa..."
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-base"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-3 rounded-full transition-all duration-300 transform ${
              text.trim()
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:scale-110 hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
