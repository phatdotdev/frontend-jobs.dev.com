import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

export interface ChatMessagePayLoad {
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  timestamp?: string;
}

export interface NotificationPayload {
  id: string;
  title: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  type?: string;
  timestamp?: string;
}

export const useSocket = (
  onMessage: (msg: ChatMessagePayLoad) => void,
  onNotify: (notify: NotificationPayload) => void,
  onConnect?: () => void,
  onDisconnect?: () => void,
  onError?: (error: string) => void
) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/api/v1/ws",
      reconnectDelay: 5000,
      // debug: (msg) => console.log("STOMP:", msg),
    });

    client.onConnect = () => {
      setConnected(true);
      setError("");

      client.subscribe("/user/queue/messages", (msg: IMessage) => {
        try {
          const body: ChatMessagePayLoad = JSON.parse(msg.body);
          onMessage(body);
        } catch (error) {}
      });

      client.subscribe("/user/queue/notifications", (msg: IMessage) => {
        try {
          const notify = JSON.parse(msg.body);
          onNotify(notify);
        } catch (error) {
          console.error("Notification parse error:", error);
        }
      });
    };

    client.onStompError = () => {
      setError("frame.body");
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = (msg: ChatMessagePayLoad) => {
    if (!clientRef.current?.connected) {
      return;
    }
    clientRef.current.publish({
      destination: "/app/send",
      body: JSON.stringify(msg),
    });
  };

  const markMessagesAsRead = (senderId: string) => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: "/app/read",
      body: JSON.stringify({ senderId }),
    });
  };

  const sendNotify = (notify: NotificationPayload) => {
    if (!clientRef.current?.connected) {
      return;
    }
    clientRef.current.publish({
      destination: "/app/notify",
      body: JSON.stringify(notify),
    });
  };

  return { connected, error, sendMessage, sendNotify, markMessagesAsRead };
};
