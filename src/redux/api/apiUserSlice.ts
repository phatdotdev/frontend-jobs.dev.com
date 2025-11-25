import { apiSlice } from "./apiSlice";
import { UPLOAD_URL, USER_URL } from "../features/constant";
import type { ResponseProps } from "../../types/ResponseProps";

type AccountInfoProp = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  avatarUrl: string;
  coverUrl: string;
  createdAt: string;
  updatedAt?: string;
};

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
    getUserInfo: builder.query<ResponseProps<AccountInfoProp>, void>({
      query: () => ({
        url: `${USER_URL}/info`,
      }),
      providesTags: ["UserInfo"],
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
    changePassword: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${USER_URL}/password`,
        method: "PUT",
        body: data,
      }),
    }),
    // GET USERS BY ID
    getJobSeekerById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${USER_URL}/job-seeker/${id}`,
      }),
    }),
    getRecruiterById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${USER_URL}/recruiter/${id}`,
      }),
    }),
    getExpertById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${USER_URL}/expert/${id}`,
      }),
    }),
    // get expertise by expert id
    getExpertisesByExpertId: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${USER_URL}/expert/${id}/expertises`,
      }),
    }),
    // upload
    uploadUserAvatar: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `${UPLOAD_URL}/avatar`,
        method: "POST",
        body: formData,
      }),
    }),
    uploadUserBackground: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `${UPLOAD_URL}/background`,
        method: "POST",
        body: formData,
      }),
    }),
    // EXPERTISES
    getAllExpertises: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${USER_URL}/expert/expertises`,
      }),
    }),
    createExpertise: builder.mutation<ResponseProps<any>, any>({
      query: (formData) => ({
        url: `${USER_URL}/expert/expertises`,
        method: "POST",
        body: formData,
      }),
    }),
    updateExpertise: builder.mutation<ResponseProps<any>, any>({
      query: (formData) => ({
        url: `${USER_URL}/expert/expertises/${formData.id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteExpertise: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${USER_URL}/expert/expertises/${id}`,
        method: "DELETE",
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
  // UPLOAD
  useUploadUserAvatarMutation,
  useUploadUserBackgroundMutation,
  // PASSWORD
  useChangePasswordMutation,
  // GET USERS BY ID
  useGetRecruiterByIdQuery,
  useGetJobSeekerByIdQuery,
  useGetExpertByIdQuery,
  // expertises
  useGetExpertisesByExpertIdQuery,
  // EXPERTISES
  useGetAllExpertisesQuery,
  useCreateExpertiseMutation,
  useUpdateExpertiseMutation,
  useDeleteExpertiseMutation,
} = userApiSlice;
