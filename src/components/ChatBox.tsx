import { useEffect, useState } from "react";
import { type ChatMessage, useSocket } from "../hooks/useSocket";
import { useGetMessagesWithOtherUserQuery } from "../redux/api/messageApiSlice";

interface ChatBoxProps {
  currentUserId: string;
  token: string;
  receiverId: string;
}

const ChatBox = ({ currentUserId, token, receiverId }: ChatBoxProps) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { connected, error, sendMessage } = useSocket(
    currentUserId,
    token,
    (incomingMessage) => {
      if (
        incomingMessage.senderId === receiverId &&
        incomingMessage.receiverId === currentUserId
      ) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    }
  );

  const { data: response, isLoading } =
    useGetMessagesWithOtherUserQuery(receiverId);

  useEffect(() => {
    setMessages(response?.data || []);
  }, [response]);

  const handleSend = () => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      senderId: currentUserId,
      receiverId,
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    sendMessage(msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-2">Chat với {receiverId}</h2>

      {/* message list */}
      <div className="flex-1 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.senderId === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.senderId === currentUserId
                  ? "bg-teal-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              <b>{msg.senderId === currentUserId ? "Bạn" : msg.senderId}:</b>{" "}
              {msg.content}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* enter message */}
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded-l px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-teal-500 text-white px-4 py-2 rounded-r hover:bg-teal-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
