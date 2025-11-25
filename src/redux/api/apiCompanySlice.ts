import type { ResponseProps } from "../../types/ResponseProps";
import { REC_URL } from "../features/constant";
import { apiSlice } from "./apiSlice";

export const companyApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFeaturedCompanies: builder.query<ResponseProps<any>, void>({
      query: () => ({
        url: `${REC_URL}/recruiters`,
      }),
    }),
  }),
});

export const { useGetFeaturedCompaniesQuery } = companyApiSlice;
