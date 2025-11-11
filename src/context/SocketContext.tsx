import { createContext, useContext } from "react";
import type {
  ChatMessagePayLoad,
  NotificationPayload,
} from "../hooks/useSocket";

interface SocketContextType {
  sendMessage: (msg: ChatMessagePayLoad) => void;
  sendNotify: (notify: NotificationPayload) => void;
  markMessagesAsRead: (senderId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocketContext must be used within SocketProvider");
  return context;
};
