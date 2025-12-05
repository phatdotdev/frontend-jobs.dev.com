import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../features/constant";
import { addToast } from "../features/toastSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

let isRefreshing = false;

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshResult = await baseQuery(
        { url: "auth/refresh", method: "POST" },
        api,
        extraOptions
      );
      if (!refreshResult?.error) {
        api.dispatch(
          addToast({
            type: "info",
            title: "Khôi phục thành công!",
            message:
              "Phiên làm việc của bạn đã được khôi phục, reload trang nếu dữ liệu chưa khôi phục!",
          })
        );

        result = await baseQuery(args, api, extraOptions);
      } else {
        // api.dispatch(
        //   addToast({
        //     type: "error",
        //     title: "Xác thực thất bại!",
        //     message: "Người dùng chưa đăng nhập!",
        //   })
        // );
      }
      isRefreshing = false;
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["authentication", "messages", "UserInfo"],
  endpoints: () => ({}),
});
