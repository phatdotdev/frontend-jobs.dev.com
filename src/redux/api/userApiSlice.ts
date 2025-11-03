import { apiSlice } from "./apiSlice";
import { USER_URL } from "../features/constant";
import type { ResponseProps } from "../../types/ResponseProps";
import type { UserResponseProps } from "../../types/UserProps";

export const userApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all users
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/all`,
      }),
    }),
    // get authenticated user info
    getUserInfo: builder.query<ResponseProps<UserResponseProps>, void>({
      query: () => ({
        url: `${USER_URL}/info`,
      }),
    }),
    // jobseeker profile
    getJobSeekerProfile: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/job-seeker/profile`,
        method: "GET",
      }),
    }),
    updateJobSeekerProfile: builder.mutation<any, any>({
      query: (data: any) => ({
        url: `${USER_URL}/job-seeker/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    // recruiter profile
    getRecruiterProfile: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/recruiter/profile`,
      }),
    }),
    updateRecruiterProfile: builder.mutation<any, any>({
      query: (data: any) => ({
        url: `${USER_URL}/recruiter/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    // expert profile
    getExpertProfile: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${USER_URL}/expert/profile`,
      }),
    }),
    updateExpertProfile: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${USER_URL}/expert/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    // search companies
    searchCompanies: builder.query<ResponseProps<any>, any>({
      query: (params) => ({
        url: `${USER_URL}/companies`,
        params,
      }),
    }),
    // get company by id
    getCompanyById: builder.query<ResponseProps<any>, any>({
      query: ({ id }) => ({
        url: `${USER_URL}/companies/${id}`,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,

  useGetJobSeekerProfileQuery,
  useUpdateJobSeekerProfileMutation,

  useGetRecruiterProfileQuery,
  useUpdateRecruiterProfileMutation,

  useGetExpertProfileQuery,
  useUpdateExpertProfileMutation,

  // COMPANIES
  useSearchCompaniesQuery,
  useGetCompanyByIdQuery,
} = userApiSlice;
