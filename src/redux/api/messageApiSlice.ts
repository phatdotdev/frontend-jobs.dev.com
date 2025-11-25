import type { ResponseProps } from "../../types/ResponseProps";
import { MSG_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const messageApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllMessages: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${MSG_URL}/mine`,
      }),
    }),
    getMessagesWithOtherUser: builder.query({
      query: (otherUserId: string) => ({
        url: `${MSG_URL}/with/${otherUserId}`,
      }),
    }),
  }),
});

export const { useGetAllMessagesQuery, useGetMessagesWithOtherUserQuery } =
  messageApiSlice;
