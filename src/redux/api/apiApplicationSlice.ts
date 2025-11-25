import type { ResponseProps } from "../../types/ResponseProps";
import { APP_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const applicationSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    applyJob: builder.mutation<ResponseProps<any>, any>({
      query: (formData) => ({
        url: `${APP_URL}`,
        method: "POST",
        body: formData,
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
    getApplicationById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${APP_URL}/${id}`,
      }),
    }),
    updateDocuments: builder.mutation<ResponseProps<any>, any>({
      query: ({ id, formData }) => ({
        url: `${APP_URL}/${id}/documents`,
        method: "PUT",
        body: formData,
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
    // GET JS BY APPLICATION ID
    getJobSeekerByApplicationId: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${APP_URL}/${id}/job-seeker`,
      }),
    }),
    // GET RESUME BY APPLICATION ID
    getResumeByApplicationId: builder.query<ResponseProps<any>, string>({
      query: (id) => ({
        url: `${APP_URL}/${id}/resume`,
      }),
    }),
  }),
});
export const {
  useApplyJobMutation,
  useSearchApplyQuery,
  useLazySearchApplyQuery,
  useGetMyApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateDocumentsMutation,
  // RECRUITER
  useGetApplicantsByPostQuery,
  useUpdateApplicationStateMutation,
  // CANDIDATE
  useGetJobSeekerByApplicationIdQuery,
  useGetResumeByApplicationIdQuery,
} = applicationSlice;
