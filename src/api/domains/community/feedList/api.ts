import { apiClient } from "../../../client/axios";
import type { ApiResponse } from "../../../client/types";
import type { FeedsResult, GetFeedsParams } from "./types";

export async function getFeeds(params: GetFeedsParams) {
  const res = await apiClient.get<ApiResponse<FeedsResult>>(
    "/community/feeds",
    { params },
  );
  return res.data;
}
