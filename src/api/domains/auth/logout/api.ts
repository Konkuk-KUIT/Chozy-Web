import { apiClient } from "../../../client/axios";
import type { ApiResponse } from "../../../client/types";

export type LogoutResult = {
  loggedOut: boolean;
  logoutAt: string;
};

export async function logout() {
  const res = await apiClient.post<ApiResponse<LogoutResult>>(
    "/auth/logout",
    null,
    { withCredentials: true },
  );
  return res.data;
}
