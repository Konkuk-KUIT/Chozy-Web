import axiosInstance from "../../../axiosInstance";
import type { ApiResponse, RecentKeyword, RecentKeywordsResult } from "./types";

export const getRecentKeywords = async (): Promise<RecentKeyword[]> => {
  const { data } =
    await axiosInstance.get<ApiResponse<RecentKeywordsResult>>(
      "/me/search/recent",
    );

  if (!data.success) throw new Error(data.message);
  return data.result.keywords ?? [];
};

export const saveSearchKeyword = async (keyword: string) => {
  const { data } = await axiosInstance.post<ApiResponse<unknown>>(
    "/me/search",
    { keyword },
  );

  if (!data.success) throw new Error(data.message);
};

export const deleteAllRecentKeywords = async () => {
  const { data } =
    await axiosInstance.delete<ApiResponse<unknown>>("/me/search/recent");

  if (!data.success) throw new Error(data.message);
};

export const deleteRecentKeyword = async (keywordId: number) => {
  const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
    `/me/search/recent/${keywordId}`,
  );

  if (!data.success) throw new Error(data.message);
};
