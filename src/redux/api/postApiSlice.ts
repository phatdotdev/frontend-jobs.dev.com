import type { ResponseProps } from "../../types/ResponseProps";
import { POST_URL } from "../features/constant";
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
    // ADMIN
    getAllJobPostings: builder.query<ResponseProps<any>, JobSearchProps>({
      query: (params) => ({
        url: `${POST_URL}`,
        params,
      }),
    }),
    // RECRUITER
    getMineJobPostings: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${POST_URL}/mine`,
      }),
    }),
    createJobPosting: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${POST_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getPostImage: builder.query<string, { postId: string; imageName: string }>({
      query: ({ postId, imageName }) => ({
        url: `${POST_URL}/${postId}/images/${imageName}`,
        responseHandler: (response) => response.blob(),
        responseType: "blob",
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
    }),
  }),
});

export const {
  useGetMineJobPostingsQuery,
  useCreateJobPostingMutation,
  useGetPostImageQuery,
  useSearchJobPostingsQuery,
} = postApiSlice;
