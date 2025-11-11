import type { ResponseProps } from "../../types/ResponseProps";
import { APP_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const applicationSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    applyJob: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${APP_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    searchApply: builder.query<ResponseProps<any>, any>({
      query: (params) => ({
        url: `${APP_URL}/search`,
        params,
      }),
    }),
    getMyApplications: builder.query<ResponseProps<any>, any>({
      query: (params) => ({
        url: `${APP_URL}/mine`,
        params,
      }),
    }),
    // RECRUITER
    getApplicantsByPost: builder.query<ResponseProps<any>, any>({
      query: ({ postId, page, size, state }) => ({
        url: `${APP_URL}/post/${postId}`,
        method: "GET",
        params: { page, size, state },
      }),
    }),
    updateApplicationState: builder.mutation<ResponseProps<any>, any>({
      query: ({ id, payload }) => ({
        url: `${APP_URL}/${id}`,
        body: payload,
        method: "PUT",
      }),
    }),
  }),
});
export const {
  useApplyJobMutation,
  useSearchApplyQuery,
  useLazySearchApplyQuery,
  useGetMyApplicationsQuery,
  // RECRUITER
  useGetApplicantsByPostQuery,
  useUpdateApplicationStateMutation,
} = applicationSlice;
