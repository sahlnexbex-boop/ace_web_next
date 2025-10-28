// /lib/auth.ts

const TOKEN_KEY = "accessToken";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
