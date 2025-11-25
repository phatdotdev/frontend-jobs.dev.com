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
  }),
});

export const {
  useGetGeneralStatisticsQuery,
  useGetRecruiterStatisticQuery,
  useGetJobSeekerActivitiesQuery,
} = apiStatisticsSlice;
