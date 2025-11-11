import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  timestamp?: string;
}

type MessagesState = ChatMessagePayload[];

const initialState: MessagesState = [];

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (_, action: PayloadAction<ChatMessagePayload[]>) =>
      action.payload,
    addMessage: (state, action: PayloadAction<ChatMessagePayload>) => {
      state.push(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      return state.map((msg) =>
        msg.senderId === action.payload && msg.isRead === false
          ? { ...msg, isRead: true }
          : msg
      );
    },
  },
});

export const { setMessages, addMessage, markAsRead } = messagesSlice.actions;
export default messagesSlice;
