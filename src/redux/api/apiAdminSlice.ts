import type { ResponseProps } from "../../types/ResponseProps";
import type { ExperienceProps } from "../../types/ResumeProps";
import type {
  ExpertProps,
  JobSeekerProps,
  RecruiterProps,
  UserResponseProps,
} from "../../types/UserProps";
import {
  CERT_URL,
  LOC_URL,
  POST_URL,
  SCH_URL,
  TAG_URL,
  USER_URL,
} from "../features/constant";
import { apiSlice } from "./apiSlice";

export const apiAdminSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /* USER MANAGEMENT */
    // get all users
    getAllUsers: builder.query<ResponseProps<[UserResponseProps]>, void>({
      query: () => ({
        url: `${USER_URL}/all`,
      }),
    }),
    // get users
    getUsersByFilter: builder.query<
      ResponseProps<any>,
      {
        page?: number;
        size?: number;
        username?: string;
        email?: string;
        role?: string;
        status?: string;
      }
    >({
      query: (parmas) => ({
        url: `${USER_URL}/search`,
        params: parmas,
      }),
    }),
    // update user status
    updateUserStatus: builder.mutation<
      ResponseProps<any>,
      { userId: string; status: string }
    >({
      query: ({ userId, status }) => ({
        url: `${USER_URL}/${userId}/status`,
        method: "PUT",
        params: { status },
      }),
    }),
    // create user
    createJobSeeker: builder.mutation<ResponseProps<any>, JobSeekerProps>({
      query: (data) => ({
        url: `${USER_URL}/job-seekers`,
        method: "POST",
        body: data,
      }),
    }),
    createRecruiter: builder.mutation<ResponseProps<any>, RecruiterProps>({
      query: (data) => ({
        url: `${USER_URL}/recruiters`,
        method: "POST",
        body: data,
      }),
    }),
    createExpert: builder.mutation<ResponseProps<any>, ExpertProps>({
      query: (data) => ({
        url: `${USER_URL}/experts`,
        method: "POST",
        body: data,
      }),
    }),
    // delete user
    deleteUser: builder.mutation<ResponseProps<string>, string>({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    /* GET ALL USERS*/
    getAllJobSeekersByFilter: builder.query<
      any,
      {
        page?: number;
        size?: number;
        username?: string;
        email?: string;
        phone?: string;
      }
    >({
      query: (params) => ({
        url: `${USER_URL}/job-seekers`,
        params,
      }),
    }),
    getAllRecruitersByFilter: builder.query<
      any,
      {
        page?: number;
        size?: number;
        username?: string;
        email?: string;
        phone?: string;
      }
    >({
      query: (params) => ({
        url: `${USER_URL}/recruiters`,
        params,
      }),
    }),
    getAllExpertsByFilter: builder.query<
      any,
      {
        page?: number;
        size?: number;
        username?: string;
        email?: string;
        phone?: string;
      }
    >({
      query: (params) => ({
        url: `${USER_URL}/experts`,
        params,
      }),
    }),
    verifyRecruiter: builder.mutation<any, any>({
      query: (id) => ({
        url: `${USER_URL}/recruiters/${id}/verified`,
        method: "PUT",
      }),
    }),
    /* POST MANAGEMENT */
    getPostsByFilter: builder.query<
      any,
      {
        state?: string;
        type?: string;
        companyName?: string;
        title?: string;
        page?: number;
        size?: number;
      }
    >({
      query: (params) => ({
        url: `${POST_URL}`,
        params,
      }),
    }),
    /* RESOURCE MANAGEMENT */
    // get all tags
    getAllTags: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${TAG_URL}`,
      }),
    }),
    // create tag
    createTag: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${TAG_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // update tag
    updateTag: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${TAG_URL}/${data.id}`,
        method: "PUT",
        body: data.name,
      }),
    }),
    // delete tag
    deleteTag: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${TAG_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // get all locations
    getAllLocations: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${LOC_URL}`,
      }),
    }),
    // create tag
    createLocation: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${LOC_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // update tag
    updateLocation: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${LOC_URL}/${data.id}`,
        method: "PUT",
        body: data.name,
      }),
    }),
    // delete tag
    deleteLocation: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${LOC_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // get all schools
    getAllSchools: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${SCH_URL}`,
      }),
    }),
    // create school
    createSchool: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${SCH_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // update school
    updateSchool: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${SCH_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    // delete school
    deleteSchool: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${SCH_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // get all schools
    getAllCertificates: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${SCH_URL}`,
      }),
    }),
    // create school
    createCertificate: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${SCH_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // update school
    updateCertificate: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${CERT_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    // delete certificate
    deleteCertificate: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${CERT_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUsersByFilterQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  // get users
  useGetAllJobSeekersByFilterQuery,
  useGetAllRecruitersByFilterQuery,
  useGetAllExpertsByFilterQuery,
  // verified
  useVerifyRecruiterMutation,
  // create users
  useCreateJobSeekerMutation,
  useCreateRecruiterMutation,
  useCreateExpertMutation,
  // posts
  useGetPostsByFilterQuery,
  // tags
  useGetAllTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  // locations
  useGetAllLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  // schools
  useGetAllSchoolsQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  // certificates
  useGetAllCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} = apiAdminSlice;
