import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfoProp } from "../../models/UserInfoProp";

interface AuthState {
  userInfo: UserInfoProp | null;
}

const initialState: AuthState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfoProp>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = action.payload.exp;
      localStorage.setItem("expirationTime", expirationTime.toString());
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
