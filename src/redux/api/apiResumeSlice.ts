import type { ResponseProps } from "../../types/ResponseProps";
import {
  type CertificationProps,
  type ActivityProps,
  type AwardProps,
  type ExperienceProps,
  type ProjectProps,
  type SkillProps,
} from "../../types/ResumeProps";
import {
  ACT_URL,
  AWD_URL,
  CER_URL,
  EDU_URL,
  EXP_URL,
  PROJ_URL,
  SKILL_URL,
} from "../features/constant";
import { apiSlice } from "./apiSlice";

export const apiResumeSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // EDUCATIONS
    getAllEducations: builder.query<any, void>({
      query: () => ({
        url: `${EDU_URL}`,
      }),
    }),
    createEducation: builder.mutation<any, any>({
      query: (data) => ({
        url: `${EDU_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // EXPERIENCES
    getAllExperiences: builder.query<ResponseProps<ExperienceProps[]>, void>({
      query: () => ({
        url: `${EXP_URL}`,
      }),
    }),
    createExperience: builder.mutation<
      ResponseProps<ExperienceProps>,
      ExperienceProps
    >({
      query: (data) => ({
        url: `${EXP_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // SKILLS
    getAllSkills: builder.query<ResponseProps<SkillProps[]>, void>({
      query: () => ({
        url: `${SKILL_URL}`,
      }),
    }),
    createSkill: builder.mutation<ResponseProps<SkillProps>, SkillProps>({
      query: (data) => ({
        url: `${SKILL_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // PROJECT
    getAllProjects: builder.query<ResponseProps<ProjectProps[]>, void>({
      query: () => ({ url: `${PROJ_URL}` }),
    }),
    createProject: builder.mutation<ResponseProps<ProjectProps>, ProjectProps>({
      query: (data) => ({
        url: `${PROJ_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // AWARDS
    getAllAwards: builder.query<ResponseProps<AwardProps[]>, void>({
      query: () => ({ url: `${AWD_URL}` }),
    }),
    createAward: builder.mutation<ResponseProps<AwardProps>, AwardProps>({
      query: (data) => ({
        url: `${PROJ_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // ACTIVITY
    getAllActivities: builder.query<ResponseProps<ActivityProps[]>, void>({
      query: () => ({ url: `${ACT_URL}` }),
    }),
    createActivity: builder.mutation<
      ResponseProps<ActivityProps>,
      ActivityProps
    >({
      query: (data) => ({
        url: `${ACT_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // CERTIFICATIONS
    getAllCertifications: builder.query<
      ResponseProps<CertificationProps[]>,
      void
    >({
      query: () => ({ url: `${CER_URL}` }),
    }),
    createCertification: builder.mutation<
      ResponseProps<CertificationProps>,
      CertificationProps
    >({
      query: (data) => ({
        url: `${CER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  // GET
  useGetAllEducationsQuery,
  useGetAllExperiencesQuery,
  useGetAllSkillsQuery,
  useGetAllProjectsQuery,
  useGetAllAwardsQuery,
  useGetAllActivitiesQuery,
  useGetAllCertificationsQuery,
  // POST
  useCreateEducationMutation,
  useCreateExperienceMutation,
  useCreateSkillMutation,
  useCreateProjectMutation,
  useCreateAwardMutation,
  useCreateActivityMutation,
  useCreateCertificationMutation,
} = apiResumeSlice;
