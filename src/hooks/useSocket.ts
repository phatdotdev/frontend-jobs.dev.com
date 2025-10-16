import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
}

export const useSocket = (
  userId: string,
  token: string,
  onMessage: (msg: ChatMessage) => void
) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      setError("Missing user or token");
      return;
    }

    const client = new Client({
      brokerURL: "ws://localhost:8080/api/v1/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (msg) => console.log("STOMP:", msg),
    });

    client.onConnect = () => {
      console.log(`[${userId}] connected.`);
      setConnected(true);
      setError("");

      client.subscribe("/user/queue/messages", (msg: IMessage) => {
        try {
          const body: ChatMessage = JSON.parse(msg.body);
          console.log(`[${userId}] received:`, body);
          onMessage(body);
        } catch (error) {
          console.error("Parse error:", error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.log("STOMP Error:", frame);
      setError("frame.body");
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log(`[${userId}] cleanup.`);
      client.deactivate();
    };
  }, [userId, token]);

  const sendMessage = (msg: ChatMessage) => {
    if (!clientRef.current?.connected) {
      return;
    }
    clientRef.current.publish({
      destination: "/app/send",
      body: JSON.stringify(msg),
    });
  };

  return { connected, error, sendMessage };
};
