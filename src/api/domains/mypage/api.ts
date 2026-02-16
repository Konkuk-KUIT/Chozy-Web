import { apiClient } from "../../client/axios";
import type { ApiResponse } from "../../client/types";
import type { MyProfile } from "./types";

export async function getMyProfile() {
  const res = await apiClient.get<ApiResponse<MyProfile>>("api/me/profile");
  return res.data;
}
