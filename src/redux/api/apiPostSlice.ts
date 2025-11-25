import type { ResponseProps } from "../../types/ResponseProps";
import { POST_URL, REC_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

type JobSearchProps = {
  keyword?: string;
  minSalary?: number;
  maxSalary?: number;
  locationId?: string;
  type?: string;
  page?: number;
  size?: number;
  experienceLevel?: string;
  sortBy?: string;
};

export const postApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // PUBLIC
    searchJobPostings: builder.query<ResponseProps<any>, JobSearchProps>({
      query: (params) => ({
        url: `${POST_URL}/search`,
        params,
      }),
    }),
    getJobPostingDetail: builder.query<ResponseProps<any>, string>({
      query: (id) => ({ url: `${POST_URL}/${id}` }),
    }),
    getSimilarJobs: builder.query<ResponseProps<any>, string>({
      query: (id) => ({
        url: `${POST_URL}/${id}/similar`,
      }),
    }),
    // ADMIN
    getAllJobPostings: builder.query<ResponseProps<any>, JobSearchProps>({
      query: (params) => ({
        url: `${POST_URL}`,
        params,
      }),
    }),
    // RECRUITER
    getMineJobPostings: builder.query<
      ResponseProps<any>,
      { page: number; size: number }
    >({
      query: (params) => ({
        url: `${POST_URL}/mine`,
        params,
      }),
    }),
    getMyDraftJobPosting: builder.query<
      ResponseProps<any>,
      { page: number; size: number }
    >({
      query: (params) => ({
        url: `${POST_URL}/mine/draft`,
        params,
      }),
    }),
    getMyPublishedJobPosting: builder.query<
      ResponseProps<any>,
      { page: number; size: number }
    >({
      query: (params) => ({
        url: `${POST_URL}/mine/published`,
        params,
      }),
    }),
    getMyClosedJobPosting: builder.query<
      ResponseProps<any>,
      { page: number; size: number }
    >({
      query: (params) => ({
        url: `${POST_URL}/mine/closed`,
        params,
      }),
    }),
    getMyCompletedJobPosting: builder.query<
      ResponseProps<any>,
      { page: number; size: number }
    >({
      query: (params) => ({
        url: `${POST_URL}/mine/completed`,
        params,
      }),
    }),
    createJobPosting: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${POST_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateJobPosting: builder.mutation<ResponseProps<any>, any>({
      query: ({ data, id }) => ({
        url: `${POST_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateJobPostingState: builder.mutation<ResponseProps<any>, any>({
      query: ({ state, id }) => ({
        url: `${POST_URL}/${id}/state`,
        method: "PUT",
        params: { state },
      }),
    }),
    // INTERACTION
    likeJobPosting: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${POST_URL}/${id}/like`,
        method: "POST",
      }),
    }),
    isLiked: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${POST_URL}/${id}/like`,
      }),
    }),
    viewJobPosting: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${POST_URL}/${id}/view`,
        method: "POST",
      }),
    }),
    getRecentPostByRecruiter: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${POST_URL}/recruiter/${id}/recent`,
      }),
    }),
    // RECOMMEND
    getRecommendedJobPostings: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${REC_URL}/postings`,
      }),
    }),
  }),
});

export const {
  // RECRUITER
  useGetMineJobPostingsQuery,
  useCreateJobPostingMutation,
  useGetMyDraftJobPostingQuery,
  useGetMyPublishedJobPostingQuery,
  useGetMyClosedJobPostingQuery,
  useGetMyCompletedJobPostingQuery,
  useUpdateJobPostingMutation,
  useUpdateJobPostingStateMutation,
  // PUBLIC
  useSearchJobPostingsQuery,
  useGetJobPostingDetailQuery,
  useGetSimilarJobsQuery,
  // INTERACTION
  useLikeJobPostingMutation,
  useViewJobPostingMutation,
  useIsLikedQuery,
  // RECENT
  useGetRecentPostByRecruiterQuery,
  // RECOMMEND
  useGetRecommendedJobPostingsQuery,
} = postApiSlice;
