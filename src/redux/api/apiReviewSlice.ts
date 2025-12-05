import type { ResponseProps } from "../../types/ResponseProps";
import { FB_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const applicationSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // EXPERT
    getActiveFeedbackRequest: builder.query<ResponseProps<any>, any>({
      query: (params) => ({
        url: `${FB_URL}/requests`,
        method: "GET",
        params,
      }),
    }),
    getRequestById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${FB_URL}/request/${id}`,
      }),
    }),
    submitReview: builder.mutation<ResponseProps<any>, any>({
      query: ({ id, payload }) => ({
        url: `${FB_URL}/request/${id}/review`,
        method: "POST",
        body: payload,
      }),
    }),
    getMyFeedbacks: builder.query<ResponseProps<any>, any>({
      query: ({ page, size }) => ({
        url: `${FB_URL}/mine`,
        params: { page, size },
      }),
    }),
    getReviewById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${FB_URL}/reviews/${id}`,
      }),
    }),
    // JOBSEEKER
    getRequestByResume: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${FB_URL}/resume/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createFeedbackRequest: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${FB_URL}/request`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetActiveFeedbackRequestQuery,
  useGetRequestByIdQuery,
  useSubmitReviewMutation,
  useGetMyFeedbacksQuery,
  useGetReviewByIdQuery,
  // JS
  useGetRequestByResumeQuery,
  useCreateFeedbackRequestMutation,
} = applicationSlice;
