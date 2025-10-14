import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../features/constant";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: any;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: "JOBSEEKER" | "RECRUITER";
}

interface RegisterResponse {
  message: string;
  data: any;
}

export const authenticationApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authenticationApiSlice;
