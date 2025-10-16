import { useState } from "react";
import ChatBox from "../components/ChatBox";
import { type ChatMessage } from "../hooks/useSocket";
import { useGetAllUsersQuery } from "../redux/api/userApiSlice";
import { FaRegUserCircle } from "react-icons/fa";
import { type UserResponseProps } from "../types/UserProps";

const ChatView = () => {
  const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = localStorage.getItem("token") || "";

  const { data: response, isLoading, error } = useGetAllUsersQuery();
  const users: UserResponseProps[] = response?.data;
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [conversations, setConversations] = useState<
    Record<string, ChatMessage[]>
  >({});

  const handleNewMessage = (msg: ChatMessage) => {
    const otherUser =
      msg.senderId === currentUser.sub ? msg.receiverId : msg.senderId;
    setConversations((prev) => {
      const list = prev[otherUser] || [];
      return {
        ...prev,
        [otherUser]: [...list, msg],
      };
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Danh sách trò chuyện</h2>
        {users
          ?.filter((user) => user.id !== currentUser.sub)
          .map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`flex items-center w-full text-left px-4 py-3 rounded-lg mb-2 shadow-sm transition-all
          ${
            selectedUser === user.id
              ? "bg-teal-500 text-white font-semibold"
              : "bg-white hover:bg-teal-100 text-gray-800"
          }`}
            >
              <FaRegUserCircle className="mr-2" />
              {user.username || user.id}
            </button>
          ))}
      </div>

      {/* ChatBox */}
      <div className="w-2/3 p-4">
        {selectedUser ? (
          <ChatBox
            currentUserId={currentUser.sub}
            token={token}
            receiverId={selectedUser}
          />
        ) : (
          <div className="text-gray-500 text-center mt-20">
            Chọn một người để bắt đầu trò chuyện
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
