import { useSocket } from "../hooks/useSocket";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/features/messageSlice";
import {
  addNotification,
  markAsRead,
} from "../redux/features/notificationSlice";
import { SocketContext } from "./SocketContext";
import { useMarkNotificationAsReadMutation } from "../redux/api/apiCommunication";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [markAsReadApi] = useMarkNotificationAsReadMutation();
  const markNotificationAsRead = async (id: string) => {
    try {
      await markAsReadApi(id).unwrap();
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  const dispatch = useDispatch();
  const { sendMessage, sendNotify, markMessagesAsRead } = useSocket(
    (msg) => dispatch(addMessage(msg)),
    (notify) => dispatch(addNotification(notify))
  );

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        sendNotify,
        markMessagesAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
