import { apiSlice } from "./apiSlice";
import { USER_URL } from "../features/constant";

export const userApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getJobSeekerProfile: builder.query<any, void>({
      query: () => ({
        url: `${USER_URL}/job-seeker/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetJobSeekerProfileQuery } = userApiSlice;
