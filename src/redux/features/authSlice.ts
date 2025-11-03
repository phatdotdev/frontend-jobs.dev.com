import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CredentialsProps } from "../../types/UserProps";
import { getUserInfo } from "../../utils/auth";

const initialState = getUserInfo();

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsProps>) => {
      state = {
        id: action.payload.id,
        username: action.payload.username,
        role: action.payload.role,
      };
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = action.payload.exp;
      localStorage.setItem("expirationTime", expirationTime.toString());
    },
    logout: (state) => {
      state = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
