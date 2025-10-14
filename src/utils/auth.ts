import type { UserInfoProp } from "../models/UserInfoProp";

export const getUserInfo = (): UserInfoProp | null => {
  const raw = localStorage.getItem("userInfo");
  const exp = localStorage.getItem("expirationTime");

  if (!raw || !exp) return null;

  const expirationTime = parseInt(exp) * 1000;
  const now = Date.now();

  if (expirationTime < now) {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expirationTime");
    return null;
  }

  try {
    const userInfo: UserInfoProp = JSON.parse(raw);
    return userInfo;
  } catch (error) {
    return null;
  }
};
