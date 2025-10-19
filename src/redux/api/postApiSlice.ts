import { POST_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const postApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createJobPosting: builder.mutation<any, any>({
      query: (data) => ({
        url: `${POST_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getMineJobPostings: builder.query<any, void>({
      query: () => ({
        url: `${POST_URL}`,
      }),
    }),
  }),
});

export const { useGetMineJobPostingsQuery, useCreateJobPostingMutation } =
  postApiSlice;
