import type { UserResponseProps } from "../types/UserProps";

export const getUserInfo = (): UserResponseProps | null => {
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
    const userInfo: UserResponseProps = JSON.parse(raw);
    return userInfo;
  } catch (error) {
    return null;
  }
};
