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
  }),
});

export const { useGetGeneralStatisticsQuery } = apiStatisticsSlice;
