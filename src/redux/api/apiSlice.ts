import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Token expired. Attempting to refresh token...");

    const refreshResult = await baseQuery(
      { url: "/api/v1/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (!refreshResult?.error) {
      console.log(
        "Refresh successful (new Access Token saved via Cookie). Retrying original request..."
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed. Logging out...");
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["authentication", "messages"],
  endpoints: () => ({}),
});
