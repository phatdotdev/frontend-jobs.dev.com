import type { ResponseProps } from "../../types/ResponseProps";
import { STATIS_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const apiStatisticsSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getGeneralStatistics: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${STATIS_URL}`,
      }),
    }),
    getRecruiterStatistic: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${STATIS_URL}/recruiter`,
      }),
    }),
    getJobSeekerActivities: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${STATIS_URL}/job-seeker`,
      }),
    }),
    getTrendingPostings: builder.query<ResponseProps<any>, any>({
      query: (count) => ({
        url: `${STATIS_URL}/postings/trend`,
        params: { count },
      }),
    }),
    getTrendingCompanies: builder.query<ResponseProps<any>, any>({
      query: (count) => ({
        url: `${STATIS_URL}/companies/trend`,
        params: { count },
      }),
    }),
  }),
});

export const {
  useGetGeneralStatisticsQuery,
  useGetRecruiterStatisticQuery,
  useGetJobSeekerActivitiesQuery,
  // HOME
  useGetTrendingCompaniesQuery,
  useGetTrendingPostingsQuery,
} = apiStatisticsSlice;
