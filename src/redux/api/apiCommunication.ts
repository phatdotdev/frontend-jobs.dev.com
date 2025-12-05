import type { ResponseProps } from "../../types/ResponseProps";
import type { UserResponseProps } from "../../types/UserProps";
import { MSG_URL, NOTI_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const apiCommunicationSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // MESSAGE
    getAllPartners: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${MSG_URL}/partners`,
      }),
    }),
    getChatUsers: builder.query<ResponseProps<UserResponseProps>, void>({
      query: () => ({
        url: `${MSG_URL}/users`,
      }),
    }),
    // NOTIFICATION
    getAllMyNotification: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${NOTI_URL}/mine`,
      }),
      keepUnusedDataFor: 0,
    }),
    markNotificationAsRead: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${NOTI_URL}/${id}/read`,
        method: "PUT",
      }),
    }),
    // create notification
    createNotification: builder.mutation<ResponseProps<any>, any>({
      query: (notification) => ({
        url: `${NOTI_URL}`,
        method: "POST",
        body: notification,
      }),
    }),
    sendInvitation: builder.mutation<ResponseProps<any>, any>({
      query: ({ postId, receiverId }) => ({
        url: `${NOTI_URL}/${postId}/invitation/${receiverId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetAllPartnersQuery,
  useGetChatUsersQuery,
  // NOTIFICATION
  useGetAllMyNotificationQuery,
  useMarkNotificationAsReadMutation,
  useCreateNotificationMutation,
  useSendInvitationMutation,
} = apiCommunicationSlice;
