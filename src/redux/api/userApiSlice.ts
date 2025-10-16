import { apiSlice } from "./apiSlice";
import { USER_URL } from "../features/constant";

export const userApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/all`,
      }),
    }),
    getJobSeekerProfile: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/job-seeker/profile`,
        method: "GET",
      }),
    }),
    getRecruiterProfile: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/recruiter/profile`,
      }),
    }),
    updateJobSeekerProfile: builder.mutation<any, any>({
      query: (data: any) => ({
        url: `${USER_URL}/job-seeker/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    updateRecruiterProfile: builder.mutation<any, any>({
      query: (data: any) => ({
        url: `${USER_URL}/recruiter/profile`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetJobSeekerProfileQuery,
  useGetRecruiterProfileQuery,
  useUpdateJobSeekerProfileMutation,
  useUpdateRecruiterProfileMutation,
} = userApiSlice;
