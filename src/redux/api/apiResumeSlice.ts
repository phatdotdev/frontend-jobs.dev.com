import type { ResponseProps } from "../../types/ResponseProps";
import {
  type CertificationProps,
  type ActivityProps,
  type AwardProps,
  type ExperienceProps,
  type ProjectProps,
  type SkillProps,
  type EducationProps,
  type ResumeProps,
} from "../../types/ResumeProps";
import {
  ACT_URL,
  AWD_URL,
  CER_URL,
  EDU_URL,
  EXP_URL,
  PROJ_URL,
  RSM_URL,
  SKILL_URL,
} from "../features/constant";
import { apiSlice } from "./apiSlice";

export const apiResumeSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // EDUCATIONS
    getAllEducations: builder.query<ResponseProps<EducationProps[]>, void>({
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
    updateEducation: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${EDU_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteEducation: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${EDU_URL}/${id}`,
        method: "DELETE",
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
    updateExperience: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${EXP_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteExperience: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${EXP_URL}/${id}`,
        method: "DELETE",
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
    updateSkill: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${SKILL_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSkill: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${SKILL_URL}/${id}`,
        method: "DELETE",
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
    updateProject: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${PROJ_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteProject: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${PROJ_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // AWARDS
    getAllAwards: builder.query<ResponseProps<AwardProps[]>, void>({
      query: () => ({ url: `${AWD_URL}` }),
    }),
    createAward: builder.mutation<ResponseProps<AwardProps>, AwardProps>({
      query: (data) => ({
        url: `${AWD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateAward: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${AWD_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAward: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${AWD_URL}/${id}`,
        method: "DELETE",
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
    updateActivity: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${ACT_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteActivity: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${ACT_URL}/${id}`,
        method: "DELETE",
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
    updateCertification: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${CER_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCertification: builder.mutation<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${CER_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // RESUMES
    getAllResumes: builder.query<ResponseProps<ResumeProps[]>, void>({
      query: () => ({ url: `${RSM_URL}` }),
    }),
    createResume: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({ url: `${RSM_URL}`, method: "POST", body: data }),
    }),
    getResumeById: builder.query<ResponseProps<any>, any>({
      query: (id) => ({
        url: `${RSM_URL}/${id}`,
      }),
    }),
    updateResume: builder.mutation<ResponseProps<any>, any>({
      query: (data) => ({
        url: `${RSM_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteResume: builder.mutation<ResponseProps<any>, string>({
      query: (id) => ({
        url: `${RSM_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // PUBLIC
    getEducationsByJobSeekerId: builder.query<ResponseProps<any>, string>({
      query: (id) => ({
        url: `job-seeker/${id}/educations`,
      }),
    }),
    getExperiencesByJobSeekerId: builder.query<ResponseProps<any>, string>({
      query: (id) => ({
        url: `job-seeker/${id}/experiences`,
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
  useGetAllResumesQuery,
  useGetResumeByIdQuery,
  useLazyGetAllResumesQuery,
  // POST
  useCreateEducationMutation,
  useCreateExperienceMutation,
  useCreateSkillMutation,
  useCreateProjectMutation,
  useCreateAwardMutation,
  useCreateActivityMutation,
  useCreateCertificationMutation,
  useCreateResumeMutation,
  // PUT
  useUpdateEducationMutation,
  useUpdateExperienceMutation,
  useUpdateSkillMutation,
  useUpdateActivityMutation,
  useUpdateAwardMutation,
  useUpdateCertificationMutation,
  useUpdateProjectMutation,
  useUpdateResumeMutation,
  // DELETE
  useDeleteEducationMutation,
  useDeleteExperienceMutation,
  useDeleteSkillMutation,
  useDeleteActivityMutation,
  useDeleteAwardMutation,
  useDeleteCertificationMutation,
  useDeleteProjectMutation,
  useDeleteResumeMutation,
  // PUBLIC
  useGetEducationsByJobSeekerIdQuery,
  useGetExperiencesByJobSeekerIdQuery,
} = apiResumeSlice;
