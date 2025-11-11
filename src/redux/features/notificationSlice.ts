import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface NotificationPayload {
  id: string;
  senderId: string;
  receiverId: string;
  title: string;
  content: string;
  isRead: boolean;
  type?: string;
  timestamp?: string;
}

type NotificationsState = NotificationPayload[];

const initialState: NotificationsState = [];

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (_, action: PayloadAction<NotificationPayload[]>) =>
      action.payload,
    addNotification: (state, action: PayloadAction<NotificationPayload>) => {
      console.log(action.payload);
      state.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      return state.map((n) =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
    },
    clearNotifications: () => [],
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice;
